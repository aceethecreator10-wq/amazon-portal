"use server";

import { createServerSupabaseClient, createAdminClient } from "./server";

export async function getCurrentProfile() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return data;
}

export async function fetchAllProfiles() {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return { profiles: [] };
  return { profiles: data || [] };
}

export async function updateProfileRole(userId: string, role: string) {
  const admin = createAdminClient();
  const { error } = await admin
    .from("profiles")
    .update({ role })
    .eq("id", userId);
  if (error) return { error: error.message };

  await admin.from("audit_logs").insert({
    actor_id: userId,
    action: "role_changed",
    entity_type: "profile",
    entity_id: userId,
    metadata: { new_role: role },
  });

  return { success: true };
}

export async function updateProfileStatus(userId: string, status: string) {
  const admin = createAdminClient();
  const { error } = await admin
    .from("profiles")
    .update({ status })
    .eq("id", userId);
  if (error) return { error: error.message };
  return { success: true };
}
