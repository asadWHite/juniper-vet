import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, GraduationCap, Languages } from "lucide-react";
import { and, avg, count, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { favorites, reviews } from "@/db/schema";
import { ensureSeed } from "@/lib/seed";
import { getSessionUser } from "@/lib/auth";
import { getDayStrip, getNextSlots } from "@/lib/availability-data";
import { getDoctor, DOCTORS } from "@/data/doctors";
import { getService, SERVICES } from "@/data/services";
import { DAY_STATUS_LABEL } from "@/lib/availability";
import { humanShort } from "@/lib/dates";
import { Reveal } from "@/components/ui/Reveal";
import { Stars } from "@/components/ui/bits";
import { FavoriteButton } from "@/components/account/clients";
import { EmergencyBand, Footer } from "@/components/site/Closing";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const d = getDoctor(slug);
  return { title: d ? d.name : "Doctor" };
}
export const dynamic = "force-dynamic";

export default async function DoctorProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doctor = getDoctor(slug);
  if (!doctor) notFound();

  await ensureSeed();
  const user = await getSessionUser();

  const serviceId = doctor.serviceIds[0];
  const [slots, rateRows, reviewRows, favRows, strip] = await Promise.all([
    getNextSlots(serviceId).catch(() => []),
    db.select({ a: avg(reviews.rating), c: count() }).from(reviews).where(and(eq(reviews.doctorId, slug), eq(reviews.approved, true))).catch(() => []),
    db.select().from(reviews).where(and(eq(reviews.doctorId, slug), eq(reviews.approved, true))).orderBy(desc(reviews.createdAt)).limit(6).catch(() => []),
    user
      ? db.select().from(favorites).where(eq(favorites.userId, user.id)).catch(() => [])
      : Promise.resolve([] as { userId: string; doctorId: string; createdAt: Date }[]),
    getDayStrip(slug, serviceId).catch(() => []),
  ]);

  const next = slots.find((s) => s.doctorId === slug);
  const rate = rateRows[0];
  const isFav = favRows.some((f: { doctorId: string }) => f.doctorId === slug);

  return (
    <>
      <article className="container-x pb-24 pt-32 lg:pt-44">
        {/* header */}
        <div className="grid grid-cols-12 items-start gap-x-6">
          <Reveal className="col-span-12 lg:col-span-7">
            <p className="label text-stone">
              <Link href="/doctors" className="transition-colors hover:text-ink">TEAM</Link> — {String(DOCTORS.indexOf(doctor) + 1).padStart(2, "0")}
            </p>
            <h1 className="mt-6 text-[clamp(2.6rem,7vw,6.5rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.03em]">
              {doctor.name.split(" ").map((w, i) => (
                <span key={w + i} className={i >= 1 ? "lg:ml-[16%] block" : "block"}>
                  {w}
                </span>
              ))}
            </h1>
            <p className="label mt-6 !text-[11px] text-forest">{doctor.specialty}</p>
            <div className="mt-6 flex flex-wrap items-center gap-6">
              {rate && rate.c > 0 && (
                <span className="flex items-center gap-3">
                  <Stars rating={Math.round(Number(rate.a))} />
                  <span className="label !text-[9px] text-stone tabular">
                    {Number(rate.a).toFixed(1)} · {rate.c} VERIFIED REVIEW{rate.c > 1 ? "S" : ""}
                  </span>
                </span>
              )}
              <span className="flex items-center gap-2 text-stone">
                <Languages size={14} strokeWidth={1.75} aria-hidden />
                <span className="label !text-[9px]">{doctor.languages.join(" · ")}</span>
              </span>
            </div>
          </Reveal>

          <div className="col-span-12 mt-10 flex gap-3 lg:col-span-5 lg:mt-24 lg:justify-end">
            <Link href={`/appointment?doctor=${doctor.id}`} className="btn btn-dark !px-8">
              BOOK WITH {doctor.name.split(" ")[1]} <ArrowRight size={13} strokeWidth={2} aria-hidden />
            </Link>
            <FavoriteButton doctorId={slug} initial={isFav} loggedIn={!!user} />
          </div>
        </div>

        {/* photos + bio */}
        <div className="mt-16 grid grid-cols-12 gap-x-6 gap-y-10">
          <Reveal variant="clip" className="col-span-12 sm:col-span-7 lg:col-span-5">
            <img src={doctor.photo} alt={doctor.photoAlt} className="aspect-[4/4.6] w-full object-cover" />
            <p className="label mt-3 !text-[8.5px] text-stone">WITH A PATIENT — PHOTOGRAPHY FROM THE CLINIC</p>
          </Reveal>
          <Reveal variant="clip" delay={100} className="col-span-8 col-start-3 sm:col-span-5 sm:col-start-8 lg:col-span-3 lg:col-start-7 lg:mt-24">
            <img src={doctor.secondPhoto} alt="" loading="lazy" className="aspect-[4/5] w-full object-cover" />
          </Reveal>
          <div className="col-span-12 lg:col-span-4 lg:mt-40">
            <Reveal>
              <p className="serif-i text-[clamp(1.4rem,2.2vw,1.9rem)] leading-[1.3] text-ink">“{doctor.bio}”</p>
            </Reveal>
            <Reveal delay={100} className="mt-8">
              <p className="label !text-[9px] text-stone">FOCUS AREAS</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {doctor.focus.map((f) => (
                  <span key={f} className="border border-line px-3 py-2 text-[9px] font-bold tracking-[0.16em]">{f}</span>
                ))}
              </div>
            </Reveal>
            <Reveal delay={160} className="mt-8 border-t border-line pt-6">
              <p className="flex items-start gap-3 text-stone">
                <GraduationCap size={16} strokeWidth={1.5} className="mt-0.5 shrink-0" aria-hidden />
                <span className="text-[12px] font-semibold leading-relaxed">
                  Doctor of Veterinary Medicine (DVM). Full credential register is
                  shown at reception — placeholder profiles pending clinic data.
                </span>
              </p>
            </Reveal>
          </div>
        </div>

        {/* availability + services */}
        <div className="mt-24 grid grid-cols-12 gap-x-6 gap-y-12 border-t border-line pt-16">
          <div className="col-span-12 lg:col-span-7">
            <p className="label text-stone">AVAILABILITY — NEXT 14 DAYS ({getService(serviceId)?.name})</p>
            <div className="mt-6 grid grid-cols-7 gap-1.5">
              {strip.slice(0, 14).map((d) => (
                <div
                  key={d.date}
                  className={`border p-2.5 text-center ${
                    d.status === "available" || d.status === "limited"
                      ? "border-line bg-paper"
                      : "border-line-soft text-stone/50"
                  }`}
                >
                  <p className="text-[8px] font-bold tracking-[0.18em] text-stone">{d.weekday}</p>
                  <p className="mt-1 text-[16px] font-extrabold tabular">{d.dayNum}</p>
                  <p className={`mt-1 text-[7px] font-bold tracking-[0.12em] ${d.status === "full" ? "strike" : ""} ${d.status === "limited" ? "text-forest" : "text-stone/70"}`}>
                    {DAY_STATUS_LABEL[d.status]}
                  </p>
                </div>
              ))}
            </div>
            {next && (
              <p className="mt-5 text-[12px] font-bold uppercase tracking-[0.14em] text-forest">
                NEXT OPEN — {humanShort(next.date)} · {next.start}
              </p>
            )}
            <Link href={`/appointment?doctor=${doctor.id}`} className="btn btn-ghost mt-7">
              CHOOSE A TIME <ArrowRight size={13} strokeWidth={2} aria-hidden />
            </Link>
          </div>
          <div className="col-span-12 lg:col-span-5">
            <p className="label text-stone">PERFORMS</p>
            <ul className="mt-4 border-t border-line">
              {doctor.serviceIds.map((sid) => {
                const s = getService(sid);
                if (!s) return null;
                return (
                  <li key={sid} className="flex items-baseline justify-between gap-4 border-b border-line py-4">
                    <div>
                      <p className="text-[14px] font-extrabold uppercase tracking-tight">{s.name}</p>
                      <p className="label mt-1 !text-[8px] text-stone">{s.short}</p>
                    </div>
                    <span className="label !text-[9px] text-stone tabular">{s.durationMinutes} MIN</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* reviews */}
        {reviewRows.length > 0 && (
          <div className="mt-24 border-t border-line pt-16">
            <p className="label text-stone">WHAT OWNERS SAY — VERIFIED VISITS</p>
            <div className="mt-8 grid gap-x-6 gap-y-10 lg:grid-cols-2">
              {reviewRows.map((r) => (
                <figure key={r.id} className="border-l-2 border-sage pl-6">
                  <Stars rating={r.rating} />
                  <blockquote className="serif-i mt-4 text-[clamp(1.15rem,1.7vw,1.5rem)] leading-[1.35]">
                    “{r.comment}”
                  </blockquote>
                  <figcaption className="label mt-4 !text-[8.5px] text-stone">{r.authorLabel}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        )}
      </article>
      <EmergencyBand />
      <Footer />
    </>
  );
}
