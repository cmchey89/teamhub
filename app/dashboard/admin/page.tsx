"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Users, Trash2 } from "lucide-react";

interface Member { id: string; email: string; name: string; role: string; createdAt: string; }

export default function AdminPage() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "member">("member");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = () =>
    fetch("/api/auth/register")
      .then(r => {
        if (r.status === 403) { router.push("/dashboard"); return null; }
        return r.json();
      })
      .then(d => d && setMembers(d));

  useEffect(() => { load(); }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name, password, role }),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.error || "Failed to create account");
      setLoading(false); return;
    }
    setName(""); setEmail(""); setPassword(""); setRole("member");
    setShowForm(false); setLoading(false);
    load();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Team Members</h2>
          <p className="text-gray-500 mt-1">Manage who has access to TeamHub</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium">
          <Plus className="w-4 h-4" /> Add Member
        </button>
      </div>

      {showForm && (
        <form onSubmit={create} className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">New Team Member</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input value={name} onChange={e => setName(e.target.value)} required placeholder="Full name or nickname"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Email"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Password (min 8 chars)" minLength={8}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <select value={role} onChange={e => setRole(e.target.value as "admin" | "member")}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
          <div className="flex gap-2 mt-4">
            <button type="submit" disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
              {loading ? "Creating…" : "Create Account"}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setError(null); }}
              className="border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </form>
      )}

      {members.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No team members yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Added</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {members.map(m => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">
                        {m.name[0]?.toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-900">{m.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{m.email}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${m.role === "admin" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>
                      {m.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{new Date(m.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
