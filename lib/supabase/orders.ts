"use server";

import { createServerSupabaseClient, createAdminClient } from "./server";

export async function submitOrder(formData: {
  buyerName: string;
  email: string;
  whatsapp: string;
  dealId: string;
  orderNumber: string;
  amount: number;
  orderDate: string;
  notes?: string;
}) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("full_name, whatsapp, email")
    .eq("id", user.id)
    .single();

  const { data: deal } = await admin
    .from("deals")
    .select("platform, title")
    .eq("id", formData.dealId)
    .single();

  const { data: order, error } = await admin
    .from("orders")
    .insert({
      buyer_id: user.id,
      buyer_name: formData.buyerName,
      email: formData.email,
      whatsapp: formData.whatsapp,
      deal_id: formData.dealId,
      platform: deal?.platform || "",
      order_number: formData.orderNumber,
      amount: formData.amount,
      order_date: formData.orderDate,
      notes: formData.notes || "",
      status: "submitted",
    })
    .select("tracking_id, id")
    .single();

  if (error) return { error: error.message };

  await admin.from("status_logs").insert({
    entity_type: "order",
    entity_id: order.id,
    new_status: "submitted",
    note: "Order submitted",
    changed_by: user.id,
  });

  return { success: true, trackingId: order.tracking_id };
}

export async function fetchOrders() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { orders: [] };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role;
  let query = supabase.from("orders").select("*");

  if (role === "buyer") {
    query = query.eq("buyer_id", user.id);
  } else   if (role === "mediator") {
    query = query.or(`assigned_mediator_id.eq.${user.id},assigned_mediator_id.is.null`);
  }

  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) return { orders: [], error: error.message };
  return { orders: data || [] };
}

export async function fetchOrderByTrackingId(trackingId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("tracking_id", trackingId)
    .single();
  if (error || !data) return null;
  return data;
}

export async function fetchOrderStatusLogs(orderId: string) {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("status_logs")
    .select("*")
    .eq("entity_type", "order")
    .eq("entity_id", orderId)
    .order("created_at", { ascending: true });
  return data || [];
}

export async function updateOrderStatus(
  orderId: string,
  newStatus: string,
  note?: string
) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: order } = await supabase
    .from("orders")
    .select("status")
    .eq("id", orderId)
    .single();

  const admin = createAdminClient();
  const { error: updateError } = await admin
    .from("orders")
    .update({ status: newStatus })
    .eq("id", orderId);

  if (updateError) return { error: updateError.message };

  await admin.from("status_logs").insert({
    entity_type: "order",
    entity_id: orderId,
    old_status: order?.status,
    new_status: newStatus,
    note: note || `Status changed to ${newStatus}`,
    changed_by: user.id,
  });

  return { success: true };
}

export async function assignMediatorToOrder(
  orderId: string,
  mediatorId: string
) {
  const admin = createAdminClient();
  const { error } = await admin
    .from("orders")
    .update({ assigned_mediator_id: mediatorId })
    .eq("id", orderId);
  if (error) return { error: error.message };
  return { success: true };
}
