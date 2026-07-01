// ============================================================
// Supabase Auth Server Actions
// Use these in client components via server actions or API routes.
// ============================================================

"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient, createAdminClient } from "./server";

// --- Sign Up ---
export async function signUp(formData: {
  email: string;
  password: string;
  fullName: string;
  whatsapp: string;
}) {
  const supabase = await createServerSupabaseClient();

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        full_name: formData.fullName,
        whatsapp: formData.whatsapp,
      },
    },
  });

  if (authError) return { error: authError.message };
  if (!authData.user) return { error: "Sign up failed" };

  // Create profile (admin client bypasses RLS for this)
  const admin = createAdminClient();
  const { error: profileError } = await admin.from("profiles").insert({
    id: authData.user.id,
    full_name: formData.fullName,
    email: formData.email,
    whatsapp: formData.whatsapp,
    role: "buyer",
    status: "active",
  });

  if (profileError) return { error: profileError.message };

  revalidatePath("/", "layout");
  return { success: true };
}

// --- Sign In ---
export async function signIn(formData: { email: string; password: string }) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  });

  if (error) return { error: error.message };
  if (!data.user) return { error: "Login failed" };

  revalidatePath("/", "layout");
  return { success: true };
}

// --- Sign Out ---
export async function signOut() {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signOut();
  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  return { success: true };
}

// --- Forgot Password ---
export async function forgotPassword(email: string) {
  const supabase = await createServerSupabaseClient();
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth/callback?next=/reset-password`,
  });

  if (error) return { error: error.message };
  return { success: true };
}

// --- Reset Password ---
export async function resetPassword(password: string) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  return { success: true };
}

// --- Get Current User (Server) ---
export async function getCurrentUser() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

// --- Get Current User Profile ---
export async function getCurrentProfile() {
  const supabase = await createServerSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userData.user.id)
    .single();

  return data;
}
