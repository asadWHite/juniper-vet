import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthForm } from "@/components/auth/AuthForm";
import { IMG } from "@/data/images";

export const metadata: Metadata = { title: "Sign in" };
export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <AuthShell
      image={IMG.authLogin}
      caption="PATIENTS 1187 & 2093 — INSEPARABLE, APPARENTLY"
      kicker="WELCOME BACK"
      title={
        <>
          YOUR COMPANIONS
          <br />
          <span className="serif-i font-normal normal-case text-forest">missed you.</span>
        </>
      }
      sub="Sign in to see upcoming visits, your pets' history and saved doctors."
    >
      <Suspense>
        <AuthForm mode="login" />
      </Suspense>
    </AuthShell>
  );
}
