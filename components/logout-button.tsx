"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={loading}
      className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-medium transition disabled:opacity-50"
    >
      {loading ? "…" : "Logout"}
    </button>
  );
}
