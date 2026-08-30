import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { ForgotForm } from "@/components/auth/PasswordForms";
import { IMG } from "@/data/images";

export const metadata: Metadata = { title: "Reset password" };
export const dynamic = "force-dynamic";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      image={IMG.authRegister}
      caption="LOYALTY, UNCONDITIONAL — PASSWORDS, RECOVERABLE"
      kicker="IT HAPPENS"
      title={
        <>
          LET'S GET YOU
          <br />
          <span className="serif-i font-normal normal-case text-forest">back in.</span>
        </>
      }
      sub="Tell us the email you registered with and we will send a reset link."
    >
      <Suspense>
        <ForgotForm />
      </Suspense>
    </AuthShell>
  );
}
