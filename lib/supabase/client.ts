// ============================================================
// Supabase Browser Client
// Used in client-side ("use client") components.
// Safe to expose NEXT_PUBLIC_* keys here.
// ============================================================

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
