"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Info } from "lucide-react";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/account";

  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "", confirm: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (mode === "register" && form.password !== form.confirm) {
      setError("The two passwords don't match.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error?.message ?? "Something went wrong.");
        return;
      }
      router.push(next);
      router.refresh();
    } catch {
      setError("The connection dropped. Please try once more.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="w-full max-w-md">
      {mode === "register" && (
        <div className="mb-6">
          <label htmlFor="fullName" className="field">FULL NAME *</label>
          <input id="fullName" className="input" value={form.fullName} onChange={set("fullName")} autoComplete="name" required />
        </div>
      )}
      <div className="mb-6">
        <label htmlFor="email" className="field">EMAIL *</label>
        <input id="email" type="email" className="input" value={form.email} onChange={set("email")} autoComplete="email" required />
      </div>
      {mode === "register" && (
        <div className="mb-6">
          <label htmlFor="phone" className="field">PHONE — OPTIONAL</label>
          <input id="phone" className="input" value={form.phone} onChange={set("phone")} autoComplete="tel" inputMode="tel" />
        </div>
      )}
      <div className="mb-6">
        <label htmlFor="password" className="field">PASSWORD *</label>
        <input
          id="password"
          type="password"
          className="input"
          value={form.password}
          onChange={set("password")}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          minLength={8}
          required
        />
      </div>
      {mode === "register" && (
        <div className="mb-6">
          <label htmlFor="confirm" className="field">CONFIRM PASSWORD *</label>
          <input id="confirm" type="password" className="input" value={form.confirm} onChange={set("confirm")} autoComplete="new-password" minLength={8} required />
        </div>
      )}

      {error && (
        <p role="alert" className="mb-6 border border-alert/40 bg-[#f5e9e6] px-4 py-3 text-[13px] font-semibold text-alert">
          {error}
        </p>
      )}

      <button type="submit" disabled={loading} className="btn btn-dark w-full">
        {loading ? "ONE MOMENT…" : mode === "login" ? "SIGN IN" : "CREATE ACCOUNT"}
        <ArrowRight size={14} strokeWidth={2} aria-hidden />
      </button>

      <div className="mt-6 flex items-center justify-between text-[10.5px] font-bold uppercase tracking-[0.16em] text-stone">
        {mode === "login" ? (
          <>
            <Link href="/forgot-password" className="transition-colors hover:text-ink">FORGOT PASSWORD</Link>
            <Link href="/register" className="transition-colors hover:text-ink">CREATE ACCOUNT</Link>
          </>
        ) : (
          <>
            <span>ALREADY REGISTERED?</span>
            <Link href="/login" className="transition-colors hover:text-ink">SIGN IN</Link>
          </>
        )}
      </div>

      {mode === "login" && (
        <p className="mt-8 flex items-start gap-2.5 border border-line bg-paper px-4 py-3.5 text-[11px] font-semibold leading-relaxed text-stone">
          <Info size={14} strokeWidth={1.75} className="mt-0.5 shrink-0" aria-hidden />
          DEMO ACCOUNT — EMAIL <span className="text-ink">demo@juniper.vet</span>, PASSWORD <span className="text-ink">juniper-demo</span>
        </p>
      )}
    </form>
  );
}
