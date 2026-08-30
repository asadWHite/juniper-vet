import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { doctors, reviews } from "@/db/schema";
import { ensureSeed } from "@/lib/seed";
import { GALLERY } from "@/data/gallery";
import { ARTICLES } from "@/data/articles";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowLink, SectionHeading, Stars } from "@/components/ui/bits";

// ---------------------------------------------------------------- gallery strip
export function GalleryStrip() {
  const items = GALLERY.filter((_, i) => [0, 2, 4, 9, 11, 13, 16, 18, 5, 19].includes(i));
  return (
    <section className="border-y border-line bg-paper" aria-label="Gallery preview">
      <div className="py-24 lg:py-28">
        <div className="container-x">
          <SectionHeading index="08" label="LIFE AT THE CLINIC" right={<ArrowLink href="/gallery">FULL GALLERY</ArrowLink>} />
        </div>
        <Reveal delay={120} className="mt-12">
          <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 lg:px-[max(calc((100vw-1440px)/2+64px),64px)]" role="list">
            {items.map((g, i) => (
              <Link
                key={g.src + i}
                href="/gallery"
                role="listitem"
                className="img-zoom group w-[62vw] shrink-0 snap-start overflow-hidden sm:w-[320px] lg:w-[360px]"
                aria-label={g.alt}
              >
                <img
                  src={g.src}
                  alt={g.alt}
                  loading="lazy"
                  className={`${i % 3 === 1 ? "aspect-[4/5]" : "aspect-[4/3]"} w-full object-cover`}
                />
                <span className="label mt-3 block !text-[8.5px] text-stone transition-colors group-hover:text-ink">
                  {g.category} — {String(i + 1).padStart(2, "0")}
                </span>
              </Link>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- reviews
export async function ReviewsHome() {
  let rows: { rating: number; comment: string; authorLabel: string; doctorName: string }[] = [];
  try {
    await ensureSeed();
    rows = await db
      .select({
        rating: reviews.rating,
        comment: reviews.comment,
        authorLabel: reviews.authorLabel,
        doctorName: doctors.name,
      })
      .from(reviews)
      .innerJoin(doctors, eq(reviews.doctorId, doctors.id))
      .where(eq(reviews.approved, true))
      .orderBy(desc(reviews.createdAt))
      .limit(4);
  } catch {
    /* renders nothing without DB */
  }
  if (!rows.length) return null;

  return (
    <section className="container-x py-24 lg:py-32" aria-label="Reviews">
      <SectionHeading index="09" label="WHAT OWNERS TELL US" right="SAMPLE CONTENT — MODERATED REVIEWS FROM COMPLETED VISITS" />
      <div className="mt-6">
        {rows.map((r, i) => (
          <Reveal key={i} delay={i * 70}>
            <figure className={`grid grid-cols-12 gap-x-6 gap-y-5 border-b border-line py-12 ${i === 0 ? "border-t mt-8" : ""}`}>
              <div className="col-span-12 flex items-baseline gap-5 lg:col-span-2">
                <span className="text-[clamp(2rem,3.4vw,3.2rem)] font-extrabold leading-none text-sage">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Stars rating={r.rating} />
              </div>
              <blockquote className="col-span-12 lg:col-span-7">
                <p className="serif-i text-[clamp(1.35rem,2.6vw,2.1rem)] leading-[1.25] text-ink">“{r.comment}”</p>
              </blockquote>
              <figcaption className="col-span-12 lg:col-span-3 lg:text-right">
                <p className="text-[12px] font-extrabold uppercase tracking-[0.12em]">{r.authorLabel}</p>
                <p className="label mt-2 !text-[9px] text-stone">TREATED BY {r.doctorName}</p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-10">
        <p className="max-w-xl text-[11px] font-semibold uppercase tracking-[0.14em] text-stone">
          {clinic_note}
        </p>
      </Reveal>
    </section>
  );
}

const clinic_note =
  "Reviews can only be left after a completed appointment and appear once approved by the clinic.";

// ---------------------------------------------------------------- journal
export function JournalHome() {
  const [featured, ...rest] = ARTICLES;
  return (
    <section className="container-x pb-24 lg:pb-32" aria-label="Journal">
      <SectionHeading index="10" label="THE JOURNAL" right={<ArrowLink href="/journal">ALL ARTICLES</ArrowLink>} />
      <div className="mt-14 grid grid-cols-12 gap-x-6 gap-y-12">
        <Reveal className="col-span-12 lg:col-span-7">
          <Link href={`/journal/${featured.slug}`} className="group block" aria-label={featured.title}>
            <div className="img-zoom overflow-hidden">
              <img src={featured.image} alt={featured.imageAlt} loading="lazy" className="aspect-[16/10] w-full object-cover" />
            </div>
            <p className="label mt-6 !text-[9.5px] text-forest">{featured.index} · {featured.category} · {featured.minutes} MIN READ</p>
            <h3 className="mt-3 max-w-xl text-[clamp(1.5rem,2.6vw,2.3rem)] font-extrabold uppercase leading-[1.05] tracking-tight transition-colors group-hover:text-forest">
              {featured.title}
            </h3>
            <p className="mt-3 max-w-lg text-[14.5px] leading-relaxed text-stone">{featured.excerpt}</p>
          </Link>
        </Reveal>
        <div className="col-span-12 lg:col-span-5">
          {rest.slice(0, 3).map((a, i) => (
            <Reveal key={a.slug} delay={i * 80}>
              <Link
                href={`/journal/${a.slug}`}
                className={`group grid grid-cols-12 items-center gap-5 py-6 ${i === 0 ? "border-y border-line" : "border-b border-line"}`}
                aria-label={a.title}
              >
                <img src={a.image} alt="" loading="lazy" className="col-span-3 aspect-square w-full object-cover" />
                <div className="col-span-8">
                  <p className="label !text-[8.5px] text-forest">{a.category} · {a.minutes} MIN</p>
                  <h4 className="mt-2 text-[15.5px] font-extrabold uppercase leading-snug tracking-tight transition-colors group-hover:text-forest">
                    {a.title}
                  </h4>
                </div>
                <ArrowUpRight size={16} strokeWidth={1.5} className="col-span-1 justify-self-end text-stone transition-all duration-400 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" aria-hidden />
              </Link>
            </Reveal>
          ))}
          <Reveal delay={260} className="pt-8">
            <p className="serif-i max-w-sm text-[clamp(1.15rem,1.8vw,1.5rem)] leading-snug text-ink/80">
              “Small, honest notes on living well with animals — written by the team, not by a content farm.”
            </p>
          </Reveal>
        </div>
      </div>
      <Reveal className="mt-14 flex justify-center">
        <Link href="/journal" className="btn btn-ghost">
          READ THE JOURNAL <ArrowRight size={14} strokeWidth={2} aria-hidden />
        </Link>
      </Reveal>
    </section>
  );
}
