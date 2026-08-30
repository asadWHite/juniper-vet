import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { ensureSeed } from "@/lib/seed";
import { appointmentCardsForUser } from "@/lib/account-data";
import { AppointmentsManager } from "@/components/account/clients";

export const metadata: Metadata = { title: "My appointments" };
export const dynamic = "force-dynamic";

export default async function AppointmentsPage() {
  const user = await getSessionUser();
  // The layout also guards this, but layouts and pages render in
  // parallel — the page must not assume a session exists.
  if (!user) redirect("/login?next=/account/appointments");
  await ensureSeed();
  const appts = await appointmentCardsForUser(user.id).catch(() => []);

  return (
    <div>
      <p className="label text-stone">APPOINTMENTS</p>
      <h1 className="display-3 mt-4">
        EVERY VISIT, <span className="serif-i font-normal normal-case text-forest">remembered.</span>
      </h1>
      <p className="mt-4 max-w-lg text-[14.5px] leading-relaxed text-stone">
        Upcoming visits can be cancelled here up to 4 hours ahead. Completed
        visits can be reviewed — once, honestly, after the fact.
      </p>
      <div className="mt-10">
        <AppointmentsManager initial={appts} />
      </div>
    </div>
  );
}
