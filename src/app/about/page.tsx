import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { clinic } from "@/data/clinic";
import { IMG } from "@/data/images";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowLink } from "@/components/ui/bits";
import { EmergencyBand, FinalCta, Footer } from "@/components/site/Closing";

export const metadata: Metadata = {
  title: "About — the practice",
  description: "Why Juniper begins with observation instead of forms. The story, the space and the standards of the clinic.",
};

const MILESTONES = [
  { y: "2012", t: "OPENED AS A ONE-ROOM PRACTICE", d: "Two chairs, one stethoscope, a somewhat irrational belief that vet visits could feel calm." },
  { y: "2016", t: "THE SECOND ROOM WAS A WAITING ROOM", d: "We separated dogs from cats on purpose. Stress went down, diagnoses went up." },
  { y: "2020", t: "OBSERVATION BECAME PROTOCOL", d: "Every intake now starts with what the owner noticed — before any form asks for a name." },
  { y: "TODAY", t: "FOUR DOCTORS, ONE METHOD", d: "Small team on purpose. Everyone knows every patient by name, temperament and treat preference." },
];

const VALUES = [
  { n: "01", t: "LISTEN FIRST", d: "The owner's observation is the first diagnostic instrument. We write it down before we touch the animal." },
  { n: "02", t: "PLAIN LANGUAGE", d: "No jargon without translation. You should leave understanding exactly what we understood." },
  { n: "03", t: "FEAR-FREE HANDLING", d: "Slow approaches, floor-level exams, treat budgets. Cooperation over restraint, whenever medically possible." },
  { n: "04", t: "NO QUIET SURPRISES", d: "Options and prices before procedures. Consent is a conversation, not a signature." },
];

export default function AboutPage() {
  return (
    <>
      <section className="container-x pb-24 pt-32 lg:pt-44">
        {/* header */}
        <div className="grid grid-cols-12 gap-x-6">
          <Reveal className="col-span-12 lg:col-span-9">
            <p className="label text-stone">ABOUT — {clinic.established}</p>
            <h1 className="display-1 mt-8">
              BUILT AROUND
              <br />
              THE <span className="serif-i font-normal normal-case text-forest">quiet</span> ONES.
            </h1>
          </Reveal>
          <Reveal delay={120} className="col-span-12 mt-10 max-w-md lg:col-span-3 lg:mt-32">
            <p className="text-[15px] leading-relaxed text-stone">
              {clinic.name} is a small companion-animal practice with one
              insistence: understanding comes before everything — before the
              form, before the exam table, and long before the invoice.
            </p>
          </Reveal>
        </div>

        {/* images */}
        <div className="mt-20 grid grid-cols-12 items-start gap-x-6">
          <Reveal variant="clip" className="col-span-12 sm:col-span-7">
            <img src={IMG.aboutSpace.src} alt={IMG.aboutSpace.alt} className="aspect-[16/10] w-full object-cover" />
            <p className="label mt-3 !text-[8.5px] text-stone">THE MAIN EXAM ROOM — NATURAL LIGHT ON PURPOSE</p>
          </Reveal>
          <Reveal variant="clip" delay={120} className="col-span-8 col-start-3 sm:col-span-4 sm:col-start-9 sm:mt-24">
            <img src={IMG.careHold.src} alt={IMG.careHold.alt} loading="lazy" className="aspect-[4/5] w-full object-cover" />
            <p className="label mt-3 !text-[8.5px] text-stone">FLOOR-LEVEL EXAM FOR A RABBIT PATIENT</p>
          </Reveal>
        </div>

        {/* timeline */}
        <div className="mt-28 border-t border-line">
          <Reveal className="grid grid-cols-12 gap-x-6 py-12">
            <p className="label col-span-12 text-stone lg:col-span-3">HOW WE GOT HERE</p>
            <p className="serif-i col-span-12 mt-4 max-w-2xl text-[clamp(1.5rem,2.6vw,2.2rem)] leading-[1.3] lg:col-span-9 lg:mt-0">
              “We grew slowly on purpose. Every room was added only when the
              medicine asked for it — never because the business did.”
            </p>
          </Reveal>
          {MILESTONES.map((m, i) => (
            <Reveal key={m.y} delay={i * 60}>
              <div className="grid grid-cols-12 items-baseline gap-x-6 gap-y-3 border-t border-line py-8">
                <p className="col-span-4 text-[clamp(1.8rem,4vw,3.4rem)] font-extrabold leading-none text-sage sm:col-span-2">{m.y}</p>
                <p className="col-span-12 text-[15px] font-extrabold uppercase tracking-[0.08em] sm:col-span-4">{m.t}</p>
                <p className="col-span-12 max-w-xl text-[14px] leading-relaxed text-stone sm:col-span-6">{m.d}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* values */}
        <div className="mt-28 grid grid-cols-12 gap-x-6 gap-y-12">
          <Reveal className="col-span-12 lg:col-span-4">
            <p className="label text-stone">FOUR RULES ON THE WALL</p>
            <h2 className="display-2 mt-6">
              HOUSE
              <br />
              <span className="serif-i font-normal normal-case text-forest">standards.</span>
            </h2>
            <p className="mt-6 max-w-xs text-[14.5px] leading-relaxed text-stone">
              Printed above the treatment table. New doctors sign them — after
              the practical exam, before the first patient.
            </p>
            <ArrowLink href="/doctors" className="mt-8">MEET WHO SIGNS</ArrowLink>
          </Reveal>
          <div className="col-span-12 lg:col-span-8">
            {VALUES.map((v, i) => (
              <Reveal key={v.n} delay={i * 60}>
                <div className={`grid grid-cols-12 gap-x-6 gap-y-2 border-line py-8 ${i === 0 ? "border-y" : "border-b"}`}>
                  <p className="col-span-2 text-[clamp(1.6rem,3vw,2.6rem)] font-extrabold leading-none text-sage">{v.n}</p>
                  <p className="col-span-10 text-[17px] font-extrabold uppercase tracking-[0.06em] sm:col-span-4">{v.t}</p>
                  <p className="col-span-12 max-w-lg text-[14px] leading-relaxed text-stone sm:col-span-6">{v.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* cta band */}
        <Reveal className="mt-28">
          <div className="grid grid-cols-12 items-center gap-6 bg-forest px-8 py-14 text-cream lg:px-16">
            <div className="col-span-12 lg:col-span-8">
              <p className="label !text-[9px] text-cream/50">SOUND LIKE YOUR KIND OF VET?</p>
              <p className="mt-5 text-[clamp(1.7rem,3.6vw,3rem)] font-extrabold uppercase leading-[1.02] tracking-tight">
                START BY TELLING US ABOUT
                <span className="serif-i font-normal normal-case"> your companion.</span>
              </p>
            </div>
            <div className="col-span-12 lg:col-span-4 lg:text-right">
              <Link href="/appointment" className="btn bg-cream text-ink border-cream hover:bg-transparent hover:text-cream">
                BOOK A VISIT <ArrowRight size={13} strokeWidth={2} aria-hidden />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
      <EmergencyBand />
      <FinalCta />
      <Footer />
    </>
  );
}
