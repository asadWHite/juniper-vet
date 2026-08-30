"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowRight, ArrowDown } from "lucide-react";
import { clinic } from "@/data/clinic";
import { IMG } from "@/data/images";

const line = "block overflow-hidden";
const inner = "block animate-hero-line will-change-transform";

export function HeroHome() {
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = imgRef.current;
        if (!el) return;
        const y = Math.min(window.scrollY, window.innerHeight);
        el.style.transform = `translateY(${y * 0.12}px)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="relative overflow-hidden border-b border-line" aria-label="Intro">
      {/* image — right ~55%, behind text */}
      <div className="absolute inset-y-0 right-0 hidden w-[54%] lg:block" aria-hidden={false}>
        <div ref={imgRef} className="h-[108%] w-full will-change-transform">
          <div className="h-full w-full animate-hero-img">
            <img
              src={IMG.hero.src}
              alt={IMG.hero.alt}
              className="h-full w-full object-cover"
              fetchPriority="high"
            />
          </div>
        </div>
        {/* soft edge so overlapping type stays readable */}
        <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-cream via-cream/55 to-transparent" aria-hidden />
        <div className="absolute bottom-6 right-6 border border-cream/40 bg-ink/35 px-4 py-2.5 backdrop-blur-[2px]">
          <p className="label !text-[9px] text-cream/90">PATIENT 2041 — MJÖLK, GOLDEN RETRIEVER</p>
        </div>
      </div>

      <div className="container-x relative z-10 flex min-h-[100svh] flex-col">
        <div className="grid flex-1 grid-cols-12 items-center pt-24 lg:pt-0">
          <div className="col-span-12 lg:col-span-9">
            <p className="label animate-fade-in text-stone [animation-delay:150ms]">
              VETERINARY CARE — {clinic.established} · DOGS · CATS · SMALL COMPANIONS
            </p>

            <h1 className="display-1 mt-6 text-ink">
              <span className={line}>
                <span className={`${inner} [animation-delay:250ms]`}>CARE FOR</span>
              </span>
              <span className={line}>
                <span className={`${inner} [animation-delay:380ms]`}>EVERY</span>
              </span>
              <span className={line}>
                <span className={`${inner} [animation-delay:510ms]`}>
                  <span className="serif-i font-normal normal-case tracking-[-0.02em] text-forest">little</span> LIFE.
                </span>
              </span>
            </h1>

            <p className="mt-8 max-w-md animate-fade-in text-[15px] leading-relaxed text-stone [animation-delay:700ms]">
              They cannot tell us what hurts. So we built a practice — and a booking
              process — that starts by listening. Tell us about your companion, and we
              will guide you to the right care.
            </p>

            <div className="mt-10 flex animate-fade-in flex-wrap items-center gap-4 [animation-delay:840ms]">
              <Link href="/appointment" className="btn btn-dark">
                BOOK A VISIT <ArrowRight size={14} strokeWidth={2} aria-hidden />
              </Link>
              <Link href="/doctors" className="btn btn-ghost">
                MEET THE TEAM
              </Link>
            </div>
          </div>
        </div>

        {/* mobile image */}
        <div className="relative -mx-5 mb-6 block lg:hidden">
          <div className="animate-hero-img">
            <img src={IMG.hero.src} alt={IMG.hero.alt} className="h-[46vh] w-full object-cover" fetchPriority="high" />
          </div>
          <div className="absolute bottom-3 left-3 border border-cream/40 bg-ink/35 px-3 py-2 backdrop-blur-[2px]">
            <p className="label !text-[8.5px] text-cream/90">PATIENT 2041 — MJÖLK, GOLDEN RETRIEVER</p>
          </div>
        </div>

        {/* metadata strip */}
        <div className="grid animate-fade-in grid-cols-2 gap-px border-t border-line bg-line [animation-delay:1000ms] sm:grid-cols-4">
          {[
            ["OPEN", "MON — SAT"],
            ["URGENT LINE", clinic.phoneDisplay],
            ["ADDRESS", clinic.address.line1],
            ["NEXT STEP", "TELL US ABOUT YOUR COMPANION"],
          ].map(([k, v]) => (
            <div key={k} className="bg-cream px-4 py-4">
              <p className="label !text-[9px] text-stone">{k}</p>
              <p className="mt-1.5 truncate text-[12px] font-bold tracking-wide">{v}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-24 right-5 hidden animate-fade-in items-center gap-2 [animation-delay:1200ms] lg:flex" aria-hidden>
        <span className="label rotate-90 text-stone">SCROLL</span>
        <ArrowDown size={13} strokeWidth={1.5} className="mt-9 -ml-4 text-stone" />
      </div>
    </section>
  );
}
