import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { ResetForm } from "@/components/auth/PasswordForms";
import { IMG } from "@/data/images";

export const metadata: Metadata = { title: "New password" };
export const dynamic = "force-dynamic";

export default function ResetPasswordPage() {
  return (
    <AuthShell
      image={IMG.authLogin}
      caption="NO JUDGEMENT — ONLY DOGS, CATS AND FRESH STARTS"
      kicker="ALMOST DONE"
      title={
        <>
          CHOOSE A NEW
          <br />
          <span className="serif-i font-normal normal-case text-forest">password.</span>
        </>
      }
      sub="Eight characters minimum. After saving, you will land straight in your account."
    >
      <Suspense>
        <ResetForm />
      </Suspense>
    </AuthShell>
  );
}
