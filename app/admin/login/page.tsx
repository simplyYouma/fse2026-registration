"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, password }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setError(json.error || "Invalid credentials");
        return;
      }
      const from = params.get("from") || "/admin";
      router.push(from);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-10">
          <div className="text-center mb-8">
            <div className="inline-block text-xs uppercase tracking-[0.2em] text-blue-600 font-semibold mb-3">
              FSE 2026 · Admin
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Sign in</h1>
            <p className="text-sm text-slate-500 mt-1">Access the registration dashboard</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="fse-label">Username</label>
              <input
                type="text"
                required
                autoFocus
                autoComplete="username"
                value={user}
                onChange={e => setUser(e.target.value)}
                className="fse-input"
                placeholder="admin"
              />
            </div>

            <div>
              <label className="fse-label">Password</label>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="fse-input"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full fse-btn-primary"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="text-xs text-slate-400 text-center mt-6">
            Authorized personnel only. All access is logged.
          </p>
        </div>

        <p className="text-center mt-6">
          <a href="/" className="text-sm text-slate-500 hover:text-slate-700">← Back to registration</a>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
