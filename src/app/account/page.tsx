import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Bell, Calendar, Heart } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { ensureSeed } from "@/lib/seed";
import {
  appointmentCardsForUser,
  favoriteDoctorsForUser,
  petsForUser,
  remindersForUser,
  splitAppointments,
} from "@/lib/account-data";
import { humanLong, humanShort } from "@/lib/dates";

export const metadata: Metadata = { title: "Account overview" };
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await getSessionUser();
  // The layout also guards this, but layouts and pages render in
  // parallel — the page must not assume a session exists.
  if (!user) redirect("/login?next=/account");
  await ensureSeed();
  const [pets, appts, reminders, favs] = await Promise.all([
    petsForUser(user.id).catch(() => []),
    appointmentCardsForUser(user.id).catch(() => []),
    remindersForUser(user.id).catch(() => []),
    favoriteDoctorsForUser(user.id).catch(() => []),
  ]);
  const { upcoming, completed } = splitAppointments(appts);
  const next = upcoming[0];

  return (
    <div>
      <p className="label text-stone">OVERVIEW</p>
      <h1 className="display-3 mt-4">
        HELLO, <span className="serif-i font-normal normal-case text-forest">{user.fullName.split(" ")[0]?.toLowerCase() ?? "there"}</span>
      </h1>

      {/* next visit */}
      <section className="mt-10" aria-label="Next visit">
        <div className="label mb-4 flex items-center justify-between text-stone">
          <span>NEXT VISIT</span>
          <Link href="/account/appointments" className="link-arrow !text-[9px]">ALL APPOINTMENTS</Link>
        </div>
        {next ? (
          <div className="grid grid-cols-12 border border-ink bg-ink text-cream">
            <img src={next.petPhoto ?? ""} alt={next.petName} className="col-span-4 h-full w-full object-cover sm:col-span-3" />
            <div className="col-span-8 p-6 sm:col-span-5 sm:p-8">
              <p className="label !text-[8.5px] text-cream/60">{next.serviceName}</p>
              <p className="mt-2 text-[clamp(1.4rem,2.4vw,2rem)] font-extrabold uppercase leading-none tracking-tight">
                {next.petName}
              </p>
              <p className="mt-3 text-[12.5px] font-bold uppercase tracking-[0.1em] text-cream/75">
                {humanLong(next.date)} · {next.startTime} · {next.doctorName}
              </p>
            </div>
            <div className="col-span-12 flex items-center justify-between gap-3 border-t border-cream/15 p-5 sm:col-span-4 sm:border-l sm:border-t-0 sm:p-8">
              <div>
                <p className="text-[34px] font-extrabold leading-none tabular">{next.startTime}</p>
                <p className="label mt-1 !text-[8px] text-cream/60">{next.durationMinutes} MIN</p>
              </div>
              <Link href={`/doctors/${next.doctorId}`} aria-label="Doctor profile" className="flex h-12 w-12 items-center justify-center border border-cream/40 transition-colors hover:bg-cream hover:text-ink">
                <ArrowUpRight size={17} strokeWidth={1.75} aria-hidden />
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-start gap-5 border border-dashed border-line px-8 py-12">
            <p className="max-w-md text-[14.5px] leading-relaxed text-stone">
              No upcoming visits. When life gives you a limp, an itch or a
              vaccine reminder — you know where to find us.
            </p>
            <Link href="/appointment" className="btn btn-dark">
              BOOK A VISIT <ArrowRight size={13} strokeWidth={2} aria-hidden />
            </Link>
          </div>
        )}
      </section>

      {/* reminders + favorites */}
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section aria-label="Vaccination reminders" className="border border-line bg-paper">
          <div className="flex items-center gap-3 border-b border-line px-6 py-4">
            <Bell size={15} strokeWidth={1.75} className="text-forest" aria-hidden />
            <p className="label !text-[9.5px]">VACCINATION REMINDERS</p>
          </div>
          {reminders.length === 0 ? (
            <p className="px-6 py-8 text-[13px] font-semibold text-stone">All up to date. Good human.</p>
          ) : (
            <ul>
              {reminders.map((r) => {
                const overdue = r.dueOn && r.dueOn < new Date().toISOString().slice(0, 10);
                return (
                  <li key={`${r.petId}-${r.name}`} className="flex items-center justify-between gap-4 border-b border-line-soft px-6 py-4 last:border-b-0">
                    <div>
                      <p className="text-[13.5px] font-extrabold uppercase tracking-wide">{r.name} — {r.petName}</p>
                      <p className="label mt-1 !text-[8px] text-stone">DUE {r.dueOn ? humanShort(r.dueOn) : "SOON"}</p>
                    </div>
                    <span className={`px-2.5 py-1.5 text-[8.5px] font-bold tracking-[0.16em] ${overdue ? "bg-alert text-cream" : "bg-sage text-forest"}`}>
                      {overdue ? "OVERDUE" : "UPCOMING"}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section aria-label="Saved doctors" className="border border-line bg-paper">
          <div className="flex items-center gap-3 border-b border-line px-6 py-4">
            <Heart size={15} strokeWidth={1.75} className="text-forest" aria-hidden />
            <p className="label !text-[9.5px]">SAVED DOCTORS</p>
            <Link href="/account/favorites" className="link-arrow ml-auto !text-[9px]">MANAGE</Link>
          </div>
          {favs.length === 0 ? (
            <p className="px-6 py-8 text-[13px] font-semibold text-stone">
              Tap the heart on any doctor to keep them here.
            </p>
          ) : (
            <ul>
              {favs.slice(0, 3).map((f) => (
                <li key={f.doctorId} className="flex items-center gap-4 border-b border-line-soft px-6 py-4 last:border-b-0">
                  <img src={f.photoUrl} alt="" className="h-11 w-11 object-cover" loading="lazy" />
                  <div className="flex-1">
                    <p className="text-[13.5px] font-extrabold uppercase tracking-wide">{f.name}</p>
                    <p className="label mt-0.5 !text-[8px] text-stone">{f.specialty}</p>
                  </div>
                  <Link href={`/appointment?doctor=${f.doctorId}`} className="link-arrow !text-[9px]">BOOK</Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* pets + recent */}
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section aria-label="My pets">
          <div className="label mb-4 flex items-center justify-between text-stone">
            <span>MY PETS · {pets.length}</span>
            <Link href="/account/pets" className="link-arrow !text-[9px]">MANAGE</Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {pets.slice(0, 4).map((p) => (
              <Link key={p.id} href={`/account/pets/${p.id}`} className="img-zoom group relative block overflow-hidden border border-line">
                <img src={p.photoUrl ?? ""} alt={p.name} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                <span className="absolute bottom-0 left-0 bg-cream/95 px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.1em]">
                  {p.name}
                </span>
              </Link>
            ))}
            <Link href="/account/pets" className="flex aspect-[4/3] items-center justify-center border border-dashed border-line text-stone transition-colors hover:border-ink hover:text-ink">
              <span className="label !text-[9px]">+ ADD</span>
            </Link>
          </div>
        </section>

        <section aria-label="Recent appointments">
          <div className="label mb-4 flex items-center gap-3 text-stone">
            <Calendar size={14} strokeWidth={1.75} aria-hidden />
            <span>RECENT VISITS</span>
          </div>
          {completed.length === 0 ? (
            <p className="border border-dashed border-line px-6 py-8 text-[13px] font-semibold text-stone">
              Your history will live here after the first visit.
            </p>
          ) : (
            <ul className="border-t border-line">
              {completed.slice(0, 3).map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-4 border-b border-line py-4">
                  <div>
                    <p className="text-[13.5px] font-extrabold uppercase tracking-wide">{a.petName} — {a.serviceName}</p>
                    <p className="label mt-1 !text-[8px] text-stone">{humanLong(a.date)} · {a.doctorName}</p>
                  </div>
                  <span className="label !text-[8.5px] text-forest">COMPLETED</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
