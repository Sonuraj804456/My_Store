"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  email: string;
  role: string;
};

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadMe() {
      try {
        const res = await apiFetch("/v1/api/users/me");

        if (!res.ok) {
          router.push("/");
          return;
        }

        const json = await res.json();
        setUser(json.data);
      } catch {
        router.push("/");
      } finally {
        setLoading(false);
      }
    }

    loadMe();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg">Loading dashboard...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800">
          Dashboard
        </h2>

        <div className="mb-4 flex justify-between">
          <span className="text-gray-500">Email</span>
          <span className="font-medium text-gray-800">
            {user.email}
          </span>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <span className="text-gray-500">Role</span>
          <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700">
            {user.role}
          </span>
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("auth_token");
            router.push("/");
          }}
          className="w-full rounded-lg bg-red-500 py-2 font-semibold text-white transition hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
