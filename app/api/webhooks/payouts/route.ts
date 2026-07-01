import { createAdminClient } from "@/lib/supabase/server";
import { getPayoutConfig } from "@/lib/payouts/provider";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const config = getPayoutConfig();
  const signature = req.headers.get("x-razorpay-signature") || "";
  const body = await req.text();

  if (config.razorpayxWebhookSecret) {
    const crypto = require("crypto");
    const expected = crypto.createHmac("sha256", config.razorpayxWebhookSecret).update(body).digest("hex");
    if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  try {
    const payload = JSON.parse(body);
    const event = payload.event;
    const providerPayoutId = payload.payload?.payout?.id;

    if (!providerPayoutId) {
      return NextResponse.json({ error: "Missing payout ID" }, { status: 400 });
    }

    const admin = createAdminClient();
    const { data: payout } = await admin
      .from("payouts")
      .select("id, refund_request_id")
      .eq("provider_payout_id", providerPayoutId)
      .single();

    if (!payout) {
      return NextResponse.json({ error: "Unknown payout" }, { status: 404 });
    }

    if (event === "payout.processed") {
      await admin.from("payouts").update({ status: "processed", processed_at: new Date().toISOString() }).eq("id", payout.id);
      if (payout.refund_request_id) {
        await admin.from("refund_requests").update({ status: "paid" }).eq("id", payout.refund_request_id);
        await admin.from("status_logs").insert({
          entity_type: "refund",
          entity_id: payout.refund_request_id,
          new_status: "paid",
          note: "Payout processed via provider webhook",
        });
      }
      await admin.from("status_logs").insert({
        entity_type: "payout",
        entity_id: payout.id,
        new_status: "processed",
        note: "Webhook confirmed",
      });
    } else if (event === "payout.failed") {
      const failureReason = payload.payload?.payout?.failure_reason || "Unknown error";
      await admin.from("payouts").update({ status: "failed", failure_reason: failureReason }).eq("id", payout.id);
      if (payout.refund_request_id) {
        await admin.from("refund_requests").update({ status: "failed" }).eq("id", payout.refund_request_id);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
