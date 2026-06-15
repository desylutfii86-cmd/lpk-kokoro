import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { bootstrapAdmin } from "@/lib/admin-bootstrap.functions";

export const Route = createFileRoute("/admin/login")({
  validateSearch: (search: Record<string, unknown>) => ({
    unauthorized: search.unauthorized === "1" ? "1" : undefined,
  }),
  head: () => ({
    meta: [{ title: "Admin Login — SO KOKORO BREBES" }],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const search = Route.useSearch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState("");
  const navigate = useNavigate();
  const callBootstrap = useServerFn(bootstrapAdmin);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setInfo("");
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      navigate({ to: "/admin" });
    } catch (err: any) {
      setError(err.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  const handleBootstrap = async () => {
    if (!email || !password) {
      setError("Isi email & password dulu");
      return;
    }
    setLoading(true);
    setError("");
    setInfo("");
    try {
      await callBootstrap({ data: { email, password } });
      setInfo("Akun admin berhasil dibuat. Silakan klik Login.");
    } catch (err: any) {
      setError(err.message || "Gagal membuat admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-japan mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl text-primary-foreground font-bold">🔐</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
          <p className="text-sm text-muted-foreground mt-1">SO KOKORO BREBES</p>
        </div>

        <form onSubmit={handleLogin} className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm space-y-4">
          {search.unauthorized && <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">Akun ini belum punya akses admin.</p>}
          {error && <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">{error}</p>}
          {info && <p className="text-sm text-green-700 bg-green-100 p-3 rounded-lg">{info}</p>}
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary outline-none" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary outline-none" />
          <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-gradient-japan text-primary-foreground font-semibold disabled:opacity-50">
            {loading ? "⏳..." : "Login"}
          </button>
        </form>

        <div className="text-center mt-4">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Kembali ke Beranda</Link>
        </div>
      </div>
    </div>
  );
}
