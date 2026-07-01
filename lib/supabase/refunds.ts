"use server";

import { createServerSupabaseClient, createAdminClient } from "./server";

export async function submitRefund(formData: {
  trackingId: string;
  paymentMethod: string;
  upiId?: string;
  bankLast4?: string;
  accountHolder: string;
  ifsc?: string;
  whatsapp: string;
  reason: string;
}) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const admin = createAdminClient();

  const { data: order } = await admin
    .from("orders")
    .select("id, buyer_id")
    .eq("tracking_id", formData.trackingId)
    .single();

  if (!order) return { error: "Order not found for this tracking ID" };

  const upiMasked = formData.upiId
    ? formData.upiId.substring(0, 3) + "***@" + formData.upiId.split("@")[1]
    : "";

  const { data: refund, error } = await admin
    .from("refund_requests")
    .insert({
      order_id: order.id,
      tracking_id: formData.trackingId,
      buyer_id: user.id,
      payment_method: formData.paymentMethod,
      upi_masked: upiMasked,
      bank_last4: formData.bankLast4 || "",
      account_holder: formData.accountHolder,
      ifsc: formData.ifsc || "",
      whatsapp: formData.whatsapp,
      reason: formData.reason,
      status: "submitted",
    })
    .select("refund_id, id")
    .single();

  if (error) return { error: error.message };

  await admin.from("status_logs").insert({
    entity_type: "refund",
    entity_id: refund.id,
    new_status: "submitted",
    note: "Refund request submitted",
    changed_by: user.id,
  });

  return { success: true, refundId: refund.refund_id };
}

export async function fetchRefunds() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { refunds: [] };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role;
  let query = supabase.from("refund_requests").select("*");

  if (role === "buyer") {
    query = query.eq("buyer_id", user.id);
  } else if (role === "mediator") {
    query = query.or(`assigned_mediator_id.eq.${user.id},assigned_mediator_id.is.null`);
  }

  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) return { refunds: [], error: error.message };
  return { refunds: data || [] };
}

export async function fetchRefundByTrackingId(trackingId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("refund_requests")
    .select("*")
    .eq("tracking_id", trackingId)
    .single();
  if (error) return null;
  return data;
}

export async function fetchRefundStatusLogs(refundId: string) {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("status_logs")
    .select("*")
    .eq("entity_type", "refund")
    .eq("entity_id", refundId)
    .order("created_at", { ascending: true });
  return data || [];
}

export async function updateRefundStatus(
  refundId: string,
  newStatus: string,
  note?: string
) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: refund } = await supabase
    .from("refund_requests")
    .select("status")
    .eq("id", refundId)
    .single();

  const admin = createAdminClient();
  const { error: updateError } = await admin
    .from("refund_requests")
    .update({ status: newStatus })
    .eq("id", refundId);

  if (updateError) return { error: updateError.message };

  await admin.from("status_logs").insert({
    entity_type: "refund",
    entity_id: refundId,
    old_status: refund?.status,
    new_status: newStatus,
    note: note || `Status changed to ${newStatus}`,
    changed_by: user.id,
  });

  return { success: true };
}

export async function assignMediatorToRefund(
  refundId: string,
  mediatorId: string
) {
  const admin = createAdminClient();
  const { error } = await admin
    .from("refund_requests")
    .update({ assigned_mediator_id: mediatorId })
    .eq("id", refundId);
  if (error) return { error: error.message };
  return { success: true };
}
