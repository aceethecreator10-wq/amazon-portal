"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function MediatorIndexPage() {
  const router = useRouter();
  useEffect(() => {
    const check = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await (supabase.from("profiles") as any).select("role").eq("id", session.user.id).single();
        if (profile?.role === "mediator") { router.replace("/mediator/dashboard"); return; }
      }
      router.replace("/mediator/login");
    };
    check();
  }, [router]);
  return null;
}
