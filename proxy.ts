// ============================================================
// PRODUCTION NOTE: This middleware provides route-level auth
// enforcement. It runs on every request matched by `config.matcher`.
// ============================================================

import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { createAdminClient } from "@/lib/supabase/server";

// --- Public routes that never require authentication ---
const PUBLIC_ROUTES = new Set([
  "/",
  "/deals",
  "/order",
  "/track",
  "/refund",
  "/help",
  "/privacy",
  "/terms",
  "/refund-policy",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/auth/callback",
]);

// --- Role-based route prefixes ---
const ROLE_ROUTES: Record<string, string> = {
  buyer: "/buyer",
  mediator: "/mediator",
  admin: "/admin",
};

// --- Role dashboard mapping for redirects ---
const DASHBOARD: Record<string, string> = {
  buyer: "/buyer/dashboard",
  mediator: "/mediator/dashboard",
  admin: "/admin/dashboard",
};

function getRouteRole(pathname: string): string | null {
  for (const [role, prefix] of Object.entries(ROLE_ROUTES)) {
    if (pathname === prefix || pathname.startsWith(prefix + "/")) {
      return role;
    }
  }
  return null;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- Public routes: just refresh session and pass through ---
  if (PUBLIC_ROUTES.has(pathname)) {
    return await updateSession(request);
  }

  // --- Determine required role for this route ---
  const requiredRole = getRouteRole(pathname);

  // If no role required and not public, it might be a protected page.
  // We still check for a valid session.
  // First, update session via Supabase SSR.
  let supabaseResponse = NextResponse.next({ request });

  // We need to create the supabase client ourselves to read user.
  // We'll use the same pattern as updateSession but also check auth.
  const { createServerClient } = await import("@supabase/ssr");
  // Import Database type for type safety
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // --- Unauthenticated: redirect to login ---
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // --- Role-based route enforcement ---
  if (requiredRole) {
    // Use admin client to bypass RLS and read the profile role
    // PRODUCTION NOTE: This is the only way to reliably get the
    // user's role in middleware, since the session payload may
    // not include role metadata and RLS would block anon access.
    const admin = createAdminClient();
    const { data: profile } = await admin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const actualRole = profile?.role;

    if (!actualRole) {
      // No profile found — redirect to login
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    if (actualRole !== requiredRole) {
      // Wrong role — redirect to the user's correct dashboard
      const target = DASHBOARD[actualRole] || "/login";
      const url = request.nextUrl.clone();
      url.pathname = target;
      return NextResponse.redirect(url);
    }

    // Handle /mediator root (redirect to dashboard or login)
    // PRODUCTION NOTE: This block handles the short-circuit for
    // the mediator landing page when the user is already authenticated.
    if (pathname === "/mediator") {
      if (actualRole === "mediator") {
        const url = request.nextUrl.clone();
        url.pathname = "/mediator/dashboard";
        return NextResponse.redirect(url);
      }
      const url = request.nextUrl.clone();
      url.pathname = "/mediator/login";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

// PRODUCTION NOTE: The matcher must match all routes that need
// middleware processing. We exclude static assets and common
// non-route files to avoid unnecessary invocations.
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icons/*|manifest.json).*)",
  ],
};
