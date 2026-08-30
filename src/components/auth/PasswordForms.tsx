"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ArrowRight, CheckCircle2, Copy } from "lucide-react";

export function ForgotForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [devUrl, setDevUrl] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setDevUrl(data?.devResetUrl ?? null);
      setSent(true);
    } catch {
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="w-full max-w-md">
        <p className="flex items-start gap-3 border border-forest/30 bg-sage/40 px-5 py-4 text-[13.5px] font-semibold leading-relaxed">
          <CheckCircle2 size={17} strokeWidth={1.75} className="mt-0.5 shrink-0 text-forest" aria-hidden />
          If an account exists for this email, a reset link is on its way. The link
          stays valid for one hour.
        </p>
        {devUrl && (
          <div className="mt-6 border border-line bg-paper p-5">
            <p className="label !text-[8.5px] text-stone">
              NO EMAIL PROVIDER IN THIS ENVIRONMENT — USE THE LINK DIRECTLY:
            </p>
            <div className="mt-3 flex items-center gap-3">
              <code className="flex-1 overflow-x-auto whitespace-nowrap text-[12px] font-bold">{devUrl}</code>
              <button
                type="button"
                aria-label="Copy link"
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.origin + devUrl);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
                className="flex h-9 w-9 shrink-0 items-center justify-center border border-line transition-colors hover:border-ink"
              >
                <Copy size={13} strokeWidth={1.75} aria-hidden />
              </button>
              <Link href={devUrl} className="btn btn-dark !px-4 !py-2.5">OPEN</Link>
            </div>
            {copied && <p className="label mt-3 !text-[8.5px] text-forest">COPIED</p>}
          </div>
        )}
        <Link href="/login" className="link-arrow mt-8">
          BACK TO SIGN IN <ArrowRight size={14} strokeWidth={2} aria-hidden />
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="w-full max-w-md">
      <div className="mb-6">
        <label htmlFor="email" className="field">YOUR ACCOUNT EMAIL *</label>
        <input id="email" type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
      </div>
      <button type="submit" disabled={loading} className="btn btn-dark w-full">
        {loading ? "SENDING…" : "SEND RESET LINK"} <ArrowRight size={14} strokeWidth={2} aria-hidden />
      </button>
    </form>
  );
}

export function ResetForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("The two passwords don't match.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error?.message ?? "Something went wrong.");
        return;
      }
      router.push("/account");
      router.refresh();
    } catch {
      setError("The connection dropped. Please try once more.");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <p className="w-full max-w-md border border-alert/40 bg-[#f5e9e6] px-5 py-4 text-[13.5px] font-semibold text-alert">
        This reset link is incomplete. Please <Link href="/forgot-password" className="underline underline-offset-4">request a fresh one</Link>.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="w-full max-w-md">
      <div className="mb-6">
        <label htmlFor="password" className="field">NEW PASSWORD *</label>
        <input id="password" type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" minLength={8} required />
      </div>
      <div className="mb-6">
        <label htmlFor="confirm" className="field">REPEAT NEW PASSWORD *</label>
        <input id="confirm" type="password" className="input" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" minLength={8} required />
      </div>
      {error && (
        <p role="alert" className="mb-6 border border-alert/40 bg-[#f5e9e6] px-4 py-3 text-[13px] font-semibold text-alert">
          {error}
        </p>
      )}
      <button type="submit" disabled={loading} className="btn btn-dark w-full">
        {loading ? "SAVING…" : "SET NEW PASSWORD"} <ArrowRight size={14} strokeWidth={2} aria-hidden />
      </button>
    </form>
  );
}
