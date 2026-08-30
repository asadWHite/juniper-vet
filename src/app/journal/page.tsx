import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ARTICLES } from "@/data/articles";
import { Reveal } from "@/components/ui/Reveal";
import { FinalCta, Footer } from "@/components/site/Closing";

export const metadata: Metadata = {
  title: "Journal — notes on animal care",
  description: "Honest writing about dogs, cats, nutrition, preventive care, vaccination and behaviour — from the clinic team.",
};

export default function JournalPage() {
  const [featured, ...rest] = ARTICLES;
  return (
    <>
      <section className="container-x pb-24 pt-32 lg:pt-44">
        <Reveal>
          <p className="label text-stone">THE JOURNAL</p>
          <h1 className="display-1 mt-8">
            NOTES ON
            <br />
            <span className="serif-i font-normal normal-case text-forest">animal</span> CARE.
          </h1>
        </Reveal>

        {/* featured */}
        <Reveal delay={100} className="mt-16">
          <Link href={`/journal/${featured.slug}`} className="group grid grid-cols-12 items-end gap-6 border-y border-line py-10" aria-label={featured.title}>
            <div className="col-span-12 lg:col-span-7">
              <div className="img-zoom overflow-hidden">
                <img src={featured.image} alt={featured.imageAlt} className="aspect-[16/9] w-full object-cover" />
              </div>
            </div>
            <div className="col-span-12 lg:col-span-5">
              <p className="label !text-[9.5px] text-forest">
                {featured.index} · {featured.category} · {featured.minutes} MIN READ
              </p>
              <h2 className="mt-4 text-[clamp(1.8rem,3.4vw,3rem)] font-extrabold uppercase leading-[1.02] tracking-tight transition-colors group-hover:text-forest">
                {featured.title}
              </h2>
              <p className="mt-4 max-w-md text-[14.5px] leading-relaxed text-stone">{featured.excerpt}</p>
              <span className="link-arrow mt-6">READ <ArrowUpRight size={14} strokeWidth={1.75} aria-hidden /></span>
            </div>
          </Link>
        </Reveal>

        {/* rest */}
        <div className="mt-4 grid grid-cols-12 gap-x-6 gap-y-14">
          {rest.map((a, i) => (
            <Reveal key={a.slug} delay={(i % 3) * 70} className={`col-span-12 sm:col-span-6 lg:col-span-4 ${i % 3 === 1 ? "lg:mt-12" : ""}`}>
              <Link href={`/journal/${a.slug}`} className="group block" aria-label={a.title}>
                <div className="img-zoom overflow-hidden">
                  <img src={a.image} alt={a.imageAlt} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                </div>
                <p className="label mt-5 !text-[9px] text-forest">
                  {a.index} · {a.category} · {a.minutes} MIN
                </p>
                <h3 className="mt-3 text-[clamp(1.2rem,1.8vw,1.5rem)] font-extrabold uppercase leading-tight tracking-tight transition-colors group-hover:text-forest">
                  {a.title}
                </h3>
                <p className="mt-3 text-[13.5px] leading-relaxed text-stone">{a.excerpt}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
      <FinalCta />
      <Footer />
    </>
  );
}
