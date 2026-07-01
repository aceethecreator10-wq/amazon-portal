import { createAdminClient } from "@/lib/supabase/server";
import { getPayoutProvider, getPayoutConfig } from "@/lib/payouts/provider";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const admin = createAdminClient();
    const { data: { user } } = await admin.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: profile } = await admin.from("profiles").select("role").eq("id", user.id).single();
    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { refundRequestId, beneficiaryId } = body;
    if (!refundRequestId || !beneficiaryId) {
      return NextResponse.json({ error: "refundRequestId and beneficiaryId required" }, { status: 400 });
    }

    const { data: refund } = await admin.from("refund_requests").select("id, amount").eq("id", refundRequestId).single();
    if (!refund) return NextResponse.json({ error: "Refund request not found" }, { status: 404 });

    const config = getPayoutConfig();
    const idempotencyKey = `payout-${refundRequestId}-${Date.now()}`;

    const { data: payout, error: insertError } = await admin
      .from("payouts")
      .insert({
        refund_request_id: refundRequestId,
        beneficiary_id: beneficiaryId,
        amount: refund.amount,
        provider: config.provider,
        idempotency_key: idempotencyKey,
        status: config.enabled ? "created" : "manual_required",
        created_by: user.id,
      })
      .select("id, payout_id")
      .single();

    if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });

    await admin.from("refund_requests").update({ payout_id: payout.id, status: "payout_queued" }).eq("id", refundRequestId);

    await admin.from("status_logs").insert({
      entity_type: "refund",
      entity_id: refundRequestId,
      new_status: "payout_queued",
      note: "Payout initiated",
      changed_by: user.id,
    });

    await admin.from("status_logs").insert({
      entity_type: "payout",
      entity_id: payout.id,
      new_status: config.enabled ? "created" : "manual_required",
      changed_by: user.id,
    });

    await admin.from("audit_logs").insert({
      actor_id: user.id,
      action: "payout.create",
      entity_type: "payout",
      entity_id: payout.id,
      metadata: { refund_request_id: refundRequestId, provider: config.provider, enabled: config.enabled },
      ip_address: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || undefined,
      user_agent: req.headers.get("user-agent") || undefined,
    });

    if (config.enabled) {
      try {
        const provider = getPayoutProvider();
        const { data: beneficiary } = await admin.from("payout_beneficiaries").select("*").eq("id", beneficiaryId).single();
        if (beneficiary?.provider_fund_account_id) {
          const result = await provider.createPayout({
            fundAccountId: beneficiary.provider_fund_account_id,
            amount: Math.round(Number(refund.amount) * 100),
            referenceId: payout.payout_id,
            idempotencyKey,
          });
          if (result.success && result.providerPayoutId) {
            await admin.from("payouts").update({ provider_payout_id: result.providerPayoutId, status: result.status }).eq("id", payout.id);
          } else {
            await admin.from("payouts").update({ status: "manual_required", failure_reason: result.error }).eq("id", payout.id);
          }
        }
      } catch (err: any) {
        await admin.from("payouts").update({ status: "manual_required", failure_reason: err.message }).eq("id", payout.id);
      }
    }

    return NextResponse.json({ success: true, payoutId: payout.payout_id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
