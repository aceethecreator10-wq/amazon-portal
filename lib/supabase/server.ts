// ============================================================
// Supabase Server Client
// Used in Server Components, API routes, and Server Actions.
// Reads auth cookies from the request.
// ============================================================
// IMPORTANT: Do NOT import this into client components.
// It uses Next.js cookies() which is server-only.
// ============================================================

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./types";

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}

// ============================================================
// Supabase Admin Client (Service Role)
// WARNING: Bypasses RLS. Use ONLY in server-side code.
// NEVER import this into client components or expose its key.
// ============================================================

import { createClient } from "@supabase/supabase-js";

export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. " +
      "This key must only be used in server-side code."
    );
  }
  // TODO: Add Database generic after generating types with:
  //   npx supabase gen types typescript --linked > lib/supabase/types.ts
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    key,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
