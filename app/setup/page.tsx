"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SetupPage() {
  const router = useRouter();
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/auth/setup")
      .then(r => r.json())
      .then(d => {
        if (!d.allowed) router.push("/");
        else setAllowed(true);
      });
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setLoading(true); setError(null);
    const res = await fetch("/api/auth/setup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name, password }),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.error || "Setup failed."); setLoading(false); return;
    }
    router.push("/dashboard");
  }

  if (allowed === null) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 w-full max-w-sm">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6">
          <span className="text-white font-bold text-lg">T</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-1">First-time Setup</h1>
        <p className="text-gray-500 text-sm text-center mb-8">
          Create your admin account. This page closes after setup.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Your Name</label>
            <input value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. CM"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8}
              placeholder="Minimum 8 characters"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Confirm Password</label>
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required
              placeholder="Repeat password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          {error && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors">
            {loading ? "Creating account…" : "Create Admin Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
