import Link from "next/link";
import { ArrowRight, MoveRight } from "lucide-react";
import { and, eq, avg, count } from "drizzle-orm";
import { db } from "@/db";
import { reviews } from "@/db/schema";
import { DOCTORS } from "@/data/doctors";
import { ensureSeed } from "@/lib/seed";
import { getNextSlots } from "@/lib/availability-data";
import { humanShort } from "@/lib/dates";
import { IMG } from "@/data/images";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowLink, SectionHeading, Stars } from "@/components/ui/bits";

// ---------------------------------------------------------------- doctors
export async function DoctorsShowcase() {
  let nextSlots = new Map<string, { date: string; start: string }>();
  let ratings = new Map<string, { avg: number; count: number }>();
  try {
    await ensureSeed();
    const [slots, rows] = await Promise.all([
      getNextSlots("general"),
      db
        .select({ doctorId: reviews.doctorId, a: avg(reviews.rating), c: count() })
        .from(reviews)
        .where(and(eq(reviews.approved, true)))
        .groupBy(reviews.doctorId),
    ]);
    nextSlots = new Map(slots.map((s) => [s.doctorId, { date: s.date, start: s.start }]));
    ratings = new Map(rows.map((r) => [r.doctorId, { avg: r.a ? Number(r.a) : 0, count: r.c }]));
  } catch {
    /* DB unavailable — section renders without live chips */
  }

  return (
    <section className="container-x py-24 lg:py-32" aria-label="Doctors">
      <SectionHeading index="05" label="THE PEOPLE" right="DEMONSTRATION TEAM — REAL PROFILES PENDING" />
      <div className="mt-14 grid grid-cols-12 gap-x-6 gap-y-14">
        {DOCTORS.map((d, i) => {
          const next = nextSlots.get(d.id);
          const rating = ratings.get(d.id);
          const big = i === 0 || i === 3;
          return (
            <Reveal
              key={d.id}
              delay={(i % 2) * 90}
              className={`col-span-12 sm:col-span-6 ${big ? "lg:col-span-7" : "lg:col-span-5"} ${i === 1 ? "lg:mt-20" : ""} ${i === 2 ? "lg:-mt-10 lg:col-start-2 lg:!col-span-4" : ""} ${i === 3 ? "lg:col-start-6" : ""}`}
            >
              <article className="group">
                <Link href={`/doctors/${d.id}`} className="img-zoom relative block overflow-hidden" aria-label={d.name}>
                  <img
                    src={d.photo}
                    alt={d.photoAlt}
                    loading="lazy"
                    className={`${big ? "aspect-[4/3]" : "aspect-[4/4.4]"} w-full object-cover`}
                  />
                  <span className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center border border-cream/60 text-cream opacity-0 transition-all duration-500 group-hover:opacity-100">
                    <ArrowRight size={16} strokeWidth={1.75} aria-hidden />
                  </span>
                  {next && (
                    <span className="absolute bottom-4 left-4 border border-cream/40 bg-ink/40 px-3 py-2 backdrop-blur-[2px]">
                      <span className="label !text-[8.5px] text-cream">
                        NEXT AVAILABLE — {humanShort(next.date)} · {next.start}
                      </span>
                    </span>
                  )}
                </Link>
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-[clamp(1.2rem,1.8vw,1.6rem)] font-extrabold uppercase tracking-tight">
                      <Link href={`/doctors/${d.id}`} className="transition-colors hover:text-forest">
                        {d.name}
                      </Link>
                    </h3>
                    <p className="label mt-2 !text-[9.5px] text-stone">{d.specialty}</p>
                  </div>
                  <div className="text-right">
                    {rating && rating.count > 0 && (
                      <>
                        <Stars rating={Math.round(rating.avg)} />
                        <p className="label mt-1.5 !text-[8.5px] text-stone tabular">
                          {rating.avg.toFixed(1)} · {rating.count} REVIEW{rating.count > 1 ? "S" : ""}
                        </p>
                      </>
                    )}
                    <Link href={`/appointment?doctor=${d.id}`} className="link-arrow mt-3 !text-[9.5px]">
                      BOOK
                    </Link>
                  </div>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
      <Reveal className="mt-16 flex justify-center">
        <Link href="/doctors" className="btn btn-ghost">
          ALL DOCTORS <ArrowRight size={14} strokeWidth={2} aria-hidden />
        </Link>
      </Reveal>
    </section>
  );
}

// ---------------------------------------------------------------- how it works
const STEPS = [
  { n: "01", t: "ANIMAL", d: "You tell us who they are — species, age, and what you have noticed at home." },
  { n: "02", t: "UNDERSTAND", d: "A short, adaptive conversation. Only questions that matter for your situation." },
  { n: "03", t: "RECOMMEND", d: "We explain — transparently — which kind of visit fits and how soon it should happen." },
  { n: "04", t: "BOOK", d: "A suitable doctor, a real calendar, a time that exists. No back-and-forth calls." },
  { n: "05", t: "CARE", d: "Arrive to a team that already knows why you are here. Follow-up included." },
];

export function HowItWorks() {
  return (
    <section className="border-y border-line bg-sand" aria-label="How it works">
      <div className="container-x py-24 lg:py-32">
        <SectionHeading index="06" label="HOW IT WORKS" right="ANIMAL → UNDERSTAND → RECOMMEND → BOOK → CARE" />
        <div className="mt-14 grid grid-cols-12">
          {STEPS.map((s, i) => (
            <Reveal
              key={s.n}
              delay={i * 80}
              className="col-span-12 border-b border-line/60 py-8 last:border-b-0 sm:col-span-6 lg:col-span-auto lg:flex-1 lg:border-b-0 lg:border-l lg:border-line/60 lg:px-6 lg:py-0 lg:first:border-l-0 lg:first:pl-0"
            >
              <p className="text-[clamp(2.6rem,4vw,4rem)] font-extrabold leading-none text-ink/15">{s.n}</p>
              <h3 className="mt-4 flex items-center gap-2.5 text-[15px] font-extrabold uppercase tracking-[0.08em]">
                {s.t}
                {i < STEPS.length - 1 && <MoveRight size={15} strokeWidth={1.5} className="hidden text-stone lg:inline" aria-hidden />}
              </h3>
              <p className="mt-3 max-w-[24ch] text-[13.5px] leading-relaxed text-stone">{s.d}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- booking teaser
export function BookingTeaser() {
  return (
    <section className="container-x grid grid-cols-12 gap-x-6 gap-y-12 py-24 lg:py-36" aria-label="Smart booking">
      <div className="col-span-12 lg:col-span-5">
        <Reveal>
          <p className="label text-stone">07 — SMART BOOKING</p>
        </Reveal>
        <Reveal delay={90}>
          <h2 className="display-2 mt-8">
            TELL US ABOUT
            <br />
            YOUR <span className="serif-i font-normal normal-case text-forest">companion.</span>
          </h2>
        </Reveal>
        <Reveal delay={170} className="mt-8 max-w-md text-[15px] leading-relaxed text-stone">
          Not "choose a service, choose a date". A short conversation — species,
          age, what you have noticed, how urgent it feels — translated into a
          transparent recommendation, a suitable doctor and a real time slot.
        </Reveal>
        <Reveal delay={240} className="mt-8 space-y-3">
          {[
            "5 – 10 ADAPTIVE QUESTIONS, NEVER MORE",
            "NO DIAGNOSIS — HONEST GUIDANCE ONLY",
            "LIVE AVAILABILITY, DURATION-AWARE SLOTS",
            "GUEST BOOKING, NO ACCOUNT REQUIRED",
          ].map((f) => (
            <p key={f} className="flex items-center gap-3 text-[11.5px] font-bold tracking-[0.14em] text-ink/80">
              <span className="h-px w-6 bg-forest" aria-hidden />
              {f}
            </p>
          ))}
        </Reveal>
        <Reveal delay={300} className="mt-10">
          <Link href="/appointment" className="btn btn-dark">
            START — HOW CAN WE HELP? <ArrowRight size={14} strokeWidth={2} aria-hidden />
          </Link>
        </Reveal>
      </div>

      <Reveal delay={140} className="relative col-span-12 lg:col-span-7">
        <Reveal variant="clip" className="overflow-hidden">
          <img src={IMG.teaser.src} alt={IMG.teaser.alt} loading="lazy" className="aspect-[16/11] w-full object-cover" />
        </Reveal>
        {/* mock of the questionnaire */}
        <div className="relative -mt-16 ml-auto w-[min(92%,420px)] border border-line bg-cream p-6 shadow-[0_24px_60px_-30px_rgb(17_21_18/0.35)] sm:absolute sm:-bottom-10 sm:right-8 sm:mt-0">
          <p className="label !text-[9px] text-stone">QUESTION 01 — COMPANION</p>
          <p className="mt-3 text-[19px] font-extrabold uppercase tracking-tight">WHO ARE WE CARING FOR?</p>
          <div className="mt-5 grid grid-cols-3 gap-2">
            <span className="border border-ink bg-ink px-3 py-3 text-center text-[10px] font-bold tracking-[0.14em] text-cream">DOG</span>
            <span className="border border-line px-3 py-3 text-center text-[10px] font-bold tracking-[0.14em]">CAT</span>
            <span className="border border-line px-3 py-3 text-center text-[10px] font-bold tracking-[0.14em]">BIRD</span>
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
            <span className="label !text-[8.5px] text-stone">BACK</span>
            <span className="flex items-center gap-2 bg-forest px-4 py-2.5 text-[9.5px] font-bold tracking-[0.18em] text-cream">
              CONTINUE <ArrowRight size={12} strokeWidth={2} aria-hidden />
            </span>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
