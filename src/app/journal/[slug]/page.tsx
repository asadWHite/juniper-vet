import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { ARTICLES, getArticle } from "@/data/articles";
import { Reveal } from "@/components/ui/Reveal";
import { FinalCta, Footer } from "@/components/site/Closing";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return { title: "Journal" };
  return { title: a.title, description: a.excerpt };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();
  const others = ARTICLES.filter((a) => a.slug !== slug).slice(0, 2);

  return (
    <>
      <article className="container-x pb-24 pt-32 lg:pt-40">
        <div className="grid grid-cols-12 gap-x-6">
          <div className="col-span-12 lg:col-span-8 lg:col-start-3">
            <Reveal>
              <Link href="/journal" className="link-arrow !text-[9.5px] text-stone">
                <ArrowLeft size={13} strokeWidth={2} aria-hidden className="-scale-x-100" /> JOURNAL
              </Link>
              <p className="label mt-8 !text-[10px] text-forest">
                {article.index} · {article.category} · {article.minutes} MIN READ
              </p>
              <h1 className="mt-6 text-[clamp(2.2rem,5.5vw,4.5rem)] font-extrabold uppercase leading-[0.98] tracking-[-0.02em]">
                {article.title}
              </h1>
            </Reveal>
          </div>
        </div>

        <Reveal variant="clip" className="mt-12">
          <img src={article.image.replace("w=1100", "w=1800")} alt={article.imageAlt} className="max-h-[70vh] w-full object-cover" />
          <p className="label mt-3 !text-[8.5px] text-stone">PHOTOGRAPHY — REAL PATIENTS, NO STOCK-STYLE STAGING</p>
        </Reveal>

        <div className="mt-16 grid grid-cols-12 gap-x-6">
          <div className="col-span-12 lg:col-span-7 lg:col-start-3">
            {article.body.map((b, i) => {
              if (b.type === "h2")
                return (
                  <h2 key={i} className="display-3 mt-14 !text-[clamp(1.5rem,2.6vw,2.2rem)]">
                    {b.text}
                  </h2>
                );
              if (b.type === "quote")
                return (
                  <blockquote key={i} className="my-12 border-y border-line py-10">
                    <p className="serif-i text-[clamp(1.5rem,2.8vw,2.2rem)] leading-[1.3] text-forest">“{b.text}”</p>
                  </blockquote>
                );
              return (
                <p key={i} className="mt-7 text-[16.5px] leading-[1.75] text-ink/85 first:mt-0">
                  {b.text}
                </p>
              );
            })}

            <div className="mt-16 flex flex-wrap items-center gap-4 border-t border-line pt-8">
              <p className="label !text-[9px] text-stone">WORRIED AFTER READING? TRUST THE INSTINCT.</p>
              <Link href="/appointment" className="btn btn-dark !px-6">
                BOOK A CHECK <ArrowUpRight size={13} strokeWidth={2} aria-hidden />
              </Link>
            </div>
          </div>
        </div>

        {/* related */}
        <div className="mt-24 grid grid-cols-12 gap-x-6 gap-y-10 border-t border-line pt-16">
          <p className="label col-span-12 text-stone">KEEP READING</p>
          {others.map((a) => (
            <Reveal key={a.slug} className="col-span-12 sm:col-span-6">
              <Link href={`/journal/${a.slug}`} className="group grid grid-cols-12 items-center gap-5" aria-label={a.title}>
                <div className="col-span-4 overflow-hidden img-zoom">
                  <img src={a.image} alt="" loading="lazy" className="aspect-square w-full object-cover" />
                </div>
                <div className="col-span-8">
                  <p className="label !text-[8.5px] text-forest">{a.category} · {a.minutes} MIN</p>
                  <h3 className="mt-2 text-[17px] font-extrabold uppercase leading-snug tracking-tight transition-colors group-hover:text-forest">
                    {a.title}
                  </h3>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </article>
      <FinalCta />
      <Footer />
    </>
  );
}
