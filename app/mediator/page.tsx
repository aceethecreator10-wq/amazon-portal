"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default function MediatorIndexPage() {
  const router = useRouter();
  useEffect(() => {
    const user = getCurrentUser();
    if (user && user.role === "mediator") {
      router.replace("/mediator/dashboard");
    } else {
      router.replace("/mediator/login");
    }
  }, [router]);
  return null;
}
