"use client";

import { useEffect } from "react";
import { apiFetch } from "../../lib/api";
import { useRouter } from "next/navigation";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    apiFetch("/v1/api/auth/logout", { method: "POST" }).finally(() =>
      router.push("/")
    );
  }, []);

  return <p>Logging out...</p>;
}
