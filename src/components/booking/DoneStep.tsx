"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import type { SessionUser } from "@/types";
import { humanLong } from "@/lib/dates";
import { IMG } from "@/data/images";
import type { DoneAppointment } from "./BookingFlow";

export function DoneStep({ done, user }: { done: DoneAppointment; user: SessionUser | null }) {
  return (
    <div className="flex min-h-[100svh] flex-col justify-center py-28">
      <p className="flex items-center gap-3 label text-forest">
        <CheckCircle2 size={17} strokeWidth={1.75} aria-hidden /> STATUS — {done.status.toUpperCase()}
      </p>
      <h1 className="display-2 mt-6">
        YOU'RE <span className="serif-i font-normal normal-case text-forest">all set.</span>
      </h1>
      <p className="mt-6 max-w-md text-[15px] leading-relaxed text-stone">
        The appointment is in the book and the doctor already knows why you are
        coming. We will send a confirmation to your email.
      </p>

      <div className="mt-12 grid max-w-4xl gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {[
          ["COMPANION", done.petName],
          ["VISIT", done.serviceName],
          ["DOCTOR", done.doctorName],
          ["DATE", humanLong(done.date)],
          ["TIME", `${done.startTime} — ${done.endTime}`],
          ["DURATION", `${done.durationMinutes} MIN`],
        ].map(([k, v]) => (
          <div key={k} className="bg-paper px-6 py-6">
            <p className="label !text-[8.5px] text-stone">{k}</p>
            <p className="mt-2 text-[15px] font-extrabold uppercase tracking-wide leading-snug">{v}</p>
          </div>
        ))}
        <div className="bg-forest px-6 py-6 text-cream sm:col-span-2 lg:col-span-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="label !text-[8.5px] text-cream/60">APPOINTMENT ID</p>
              <p className="mt-2 text-[15px] font-extrabold uppercase tracking-[0.12em] tabular">{done.id}</p>
            </div>
            <p className="max-w-xs text-[10.5px] font-bold uppercase leading-relaxed tracking-[0.14em] text-cream/60">
              RUNNING LATE? CALL US — WE WILL MOVE THINGS AROUND RATHER THAN LOSE YOUR SLOT.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10 grid max-w-4xl gap-6 sm:grid-cols-[240px_1fr] sm:items-center">
        <img src={IMG.confirm.src} alt={IMG.confirm.alt} className="aspect-[4/3] w-full object-cover" />
        <div className="flex flex-wrap gap-3.5">
          {user ? (
            <Link href="/account/appointments" className="btn btn-dark">
              MY APPOINTMENTS <ArrowRight size={13} strokeWidth={2} aria-hidden />
            </Link>
          ) : (
            <Link href="/register" className="btn btn-dark">
              CREATE AN ACCOUNT TO TRACK THIS VISIT <ArrowRight size={13} strokeWidth={2} aria-hidden />
            </Link>
          )}
          <Link href="/" className="btn btn-ghost">
            BACK HOME
          </Link>
        </div>
      </div>
    </div>
  );
}
