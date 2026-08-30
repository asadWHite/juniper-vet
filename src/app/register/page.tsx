import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthForm } from "@/components/auth/AuthForm";
import { IMG } from "@/data/images";

export const metadata: Metadata = { title: "Create account" };
export const dynamic = "force-dynamic";

export default function RegisterPage() {
  return (
    <AuthShell
      image={IMG.authRegister}
      caption="TWO OF OUR FAVOURITE REGULARS, OFF DUTY"
      kicker="JOIN THE CLINIC"
      title={
        <>
          EVERY COMPANION,
          <br />
          <span className="serif-i font-normal normal-case text-forest">one home base.</span>
        </>
      }
      sub="Pets, visits, vaccination reminders and reviews — all in one calm place."
    >
      <Suspense>
        <AuthForm mode="register" />
      </Suspense>
    </AuthShell>
  );
}
