import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // PRODUCTION NOTE: Uncomment and customize CSP before production launch
  // {
  //   key: "Content-Security-Policy",
  //   value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://*.supabase.co; font-src 'self'; connect-src 'self' https://*.supabase.co; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self';",
  // },
];

const nextConfig: NextConfig = {
  // PRODUCTION NOTE: Add your production domain here
  // images: {
  //   remotePatterns: [
  //     { protocol: "https", hostname: "*.supabase.co" },
  //   ],
  // },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },

  // PRODUCTION NOTE: Add redirect for /mediator/index → /mediator
  // (Handled via middleware and page-level redirect)

  typescript: {
    // Warning: Set to false before production launch.
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
