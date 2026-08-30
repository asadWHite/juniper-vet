import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { and, avg, count, eq } from "drizzle-orm";
import { db } from "@/db";
import { reviews } from "@/db/schema";
import { ensureSeed } from "@/lib/seed";
import { getNextSlots } from "@/lib/availability-data";
import { DOCTORS } from "@/data/doctors";
import { humanShort } from "@/lib/dates";
import { clinic } from "@/data/clinic";
import { Reveal } from "@/components/ui/Reveal";
import { Stars } from "@/components/ui/bits";
import { EmergencyBand, FinalCta, Footer } from "@/components/site/Closing";

export const metadata: Metadata = {
  title: "Doctors — the team",
  description: "Meet the veterinary team: specializations, focus areas and next available times.",
};
export const dynamic = "force-dynamic";

export default async function DoctorsPage() {
  await ensureSeed();
  const [slots, ratings] = await Promise.all([
    getNextSlots("general").catch(() => []),
    db
      .select({ doctorId: reviews.doctorId, a: avg(reviews.rating), c: count() })
      .from(reviews)
      .where(and(eq(reviews.approved, true)))
      .groupBy(reviews.doctorId)
      .catch(() => []),
  ]);
  const nextMap = new Map(slots.map((s) => [s.doctorId, s]));
  const rateMap = new Map(ratings.map((r) => [r.doctorId, { avg: r.a ? Number(r.a) : 0, c: r.c }]));

  return (
    <>
      <section className="container-x pb-24 pt-32 lg:pt-44">
        <Reveal>
          <p className="label text-stone">THE TEAM</p>
          <h1 className="display-1 mt-8 max-w-5xl">
            GENTLE HANDS,
            <br />
            <span className="serif-i font-normal normal-case text-forest">sharp</span> MINDS.
          </h1>
          <p className="mt-8 max-w-xl text-[15px] leading-relaxed text-stone">
            Four doctors, deliberately different specializations, one shared
            habit: they all start by listening to the owner. Ratings come from
            verified, completed visits only.
          </p>
        </Reveal>

        <div className="mt-20 grid grid-cols-12 gap-x-6 gap-y-16">
          {DOCTORS.map((d, i) => {
            const next = nextMap.get(d.id);
            const rate = rateMap.get(d.id);
            return (
              <Reveal key={d.id} delay={(i % 2) * 80} className={`col-span-12 sm:col-span-6 ${i % 2 === 1 ? "lg:mt-14" : ""}`}>
                <article className="group">
                  <Link href={`/doctors/${d.id}`} className="img-zoom relative block overflow-hidden" aria-label={d.name}>
                    <img src={d.photo} alt={d.photoAlt} loading="lazy" className="aspect-[4/4.6] w-full object-cover" />
                    <span className="absolute bottom-0 left-0 bg-cream px-4 py-3">
                      <span className="text-[11px] font-extrabold uppercase tracking-[0.14em]">
                        {next ? `NEXT — ${humanShort(next.date)} · ${next.start}` : "FULLY BOOKED — 14 DAYS"}
                      </span>
                    </span>
                  </Link>
                  <div className="mt-6 grid grid-cols-12 items-start gap-4">
                    <div className="col-span-9">
                      <h2 className="text-[clamp(1.4rem,2.2vw,1.9rem)] font-extrabold uppercase leading-tight tracking-tight">
                        <Link href={`/doctors/${d.id}`} className="transition-colors hover:text-forest">
                          {d.name}
                        </Link>
                      </h2>
                      <p className="label mt-2 !text-[9.5px] text-forest">{d.specialty}</p>
                      <div className="mt-3.5 flex flex-wrap gap-2">
                        {d.focus.map((f) => (
                          <span key={f} className="border border-line px-2.5 py-1.5 text-[8.5px] font-bold tracking-[0.16em] text-stone">
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="col-span-3 text-right">
                      {rate && rate.c > 0 && (
                        <>
                          <Stars rating={Math.round(rate.avg)} />
                          <p className="label mt-1.5 !text-[8px] text-stone tabular">{rate.avg.toFixed(1)}</p>
                        </>
                      )}
                      <Link href={`/doctors/${d.id}`} aria-label={`Open ${d.name}`} className="mt-3 ml-auto flex h-11 w-11 items-center justify-center border border-line transition-all group-hover:border-ink group-hover:bg-ink group-hover:text-cream">
                        <ArrowRight size={15} strokeWidth={1.75} aria-hidden />
                      </Link>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-20 border border-dashed border-line px-8 py-8">
          <p className="max-w-3xl text-[11px] font-bold uppercase leading-relaxed tracking-[0.16em] text-stone">
            {clinic.demoNote} Verified credentials and registration numbers will be published with the real profiles.
          </p>
        </Reveal>
      </section>
      <EmergencyBand />
      <FinalCta />
      <Footer />
    </>
  );
}
