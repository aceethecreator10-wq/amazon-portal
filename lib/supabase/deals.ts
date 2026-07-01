"use server";

import { createServerSupabaseClient, createAdminClient } from "./server";

export async function fetchDeals() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("deals")
    .select("*")
    .in("status", ["active", "closing_soon"])
    .order("created_at", { ascending: false });
  if (error) return { deals: [], error: error.message };
  return { deals: data || [] };
}

export async function fetchAllDeals() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("deals")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return { deals: [], error: error.message };
  return { deals: data || [] };
}

export async function createDeal(formData: {
  title: string;
  platform: string;
  category: string;
  original_price: number;
  deal_price: number;
  cashback_amount: number;
  status: string;
}) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const admin = createAdminClient();
  const effectivePrice = formData.deal_price - formData.cashback_amount;

  const { error } = await admin.from("deals").insert({
    title: formData.title,
    platform: formData.platform,
    category: formData.category,
    original_price: formData.original_price,
    deal_price: formData.deal_price,
    cashback_amount: formData.cashback_amount,
    effective_price: effectivePrice,
    status: formData.status,
    created_by: user.id,
  });

  if (error) return { error: error.message };
  return { success: true };
}

export async function updateDeal(id: string, formData: {
  title: string;
  platform: string;
  category: string;
  original_price: number;
  deal_price: number;
  cashback_amount: number;
  status: string;
}) {
  const admin = createAdminClient();
  const effectivePrice = formData.deal_price - formData.cashback_amount;

  const { error } = await admin.from("deals").update({
    title: formData.title,
    platform: formData.platform,
    category: formData.category,
    original_price: formData.original_price,
    deal_price: formData.deal_price,
    cashback_amount: formData.cashback_amount,
    effective_price: effectivePrice,
    status: formData.status,
  }).eq("id", id);

  if (error) return { error: error.message };
  return { success: true };
}

export async function deleteDeal(id: string) {
  const admin = createAdminClient();
  const { error } = await admin.from("deals").delete().eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}
