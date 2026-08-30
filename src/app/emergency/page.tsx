import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, MapPin, Phone } from "lucide-react";
import { clinic } from "@/data/clinic";
import { IMG } from "@/data/images";
import { Reveal } from "@/components/ui/Reveal";
import { Footer } from "@/components/site/Closing";

export const metadata: Metadata = {
  title: "Emergency — urgent care information",
  description: "What counts as an emergency, when to call, and how to reach the clinic quickly.",
};

const SIGNS = [
  "DIFFICULTY BREATHING OR CHOKING",
  "SEIZURES OR COLLAPSE",
  "SUSPECTED POISONING — KEEP THE PACKAGING",
  "SERIOUS BLEEDING THAT DOESN'T STOP",
  "TRAUMA — HIT BY A CAR, BIG FALL",
  "SUDDEN SWOLLEN, HARD ABDOMEN",
  "CANNOT URINATE — STRAINING, CRYING",
  "RABBIT OR SMALL ANIMAL NOT EATING 12+ HOURS",
];

const STEPS = [
  { n: "01", t: "CALL FIRST", d: "We prepare the room and the team while you drive. Two minutes on the phone changes outcomes." },
  { n: "02", t: "TRANSPORT SAFELY", d: "Cats and small animals in carriers, injured dogs on a firm board or blanket. Keep the car cool and quiet." },
  { n: "03", t: "BRING WHAT MATTERS", d: "Packaging of anything eaten, current medication, your phone. Skip the toy box." },
];

export default function EmergencyPage() {
  return (
    <>
      <section className="container-x pb-24 pt-32 lg:pt-44">
        <div className="grid grid-cols-12 gap-x-6 gap-y-12">
          <div className="col-span-12 lg:col-span-7">
            <Reveal>
              <p className="label text-alert">URGENT CARE</p>
              <h1 className="display-1 mt-8">
                NEED URGENT
                <br />
                <span className="serif-i font-normal normal-case text-alert">help now?</span>
              </h1>
            </Reveal>
            <Reveal delay={100}>
              <p className="mt-10 max-w-lg text-[17px] leading-relaxed text-ink/85">
                If something feels seriously wrong, don't wait for an online
                slot. Call us — during opening hours we keep capacity for
                same-day urgent cases.
              </p>
              <p className="mt-4 max-w-lg text-[13.5px] leading-relaxed text-stone">
                Outside opening hours we list trusted emergency partners at
                reception and on our voicemail. We do not claim 24/7 cover we
                cannot guarantee.
              </p>
            </Reveal>
            <Reveal delay={160} className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a href={clinic.phoneHref} className="btn btn-dark !px-10 !py-5 !bg-alert !border-alert hover:!bg-ink">
                <Phone size={16} strokeWidth={2} aria-hidden /> CALL — {clinic.phoneDisplay}
              </a>
              <a href={clinic.mapUrl} target="_blank" rel="noreferrer" className="btn btn-ghost !px-10 !py-5">
                <MapPin size={16} strokeWidth={1.75} aria-hidden /> GET DIRECTIONS
              </a>
            </Reveal>
            <Reveal delay={220} className="mt-8 flex items-center gap-3 text-stone">
              <Clock size={15} strokeWidth={1.75} aria-hidden />
              <p className="text-[11px] font-bold uppercase tracking-[0.16em]">
                {clinic.hours.map((h) => `${h.days}: ${h.time}`).join("  ·  ")}
              </p>
            </Reveal>
          </div>
          <Reveal variant="clip" delay={120} className="col-span-12 lg:col-span-5">
            <img src={IMG.emergency.src} alt={IMG.emergency.alt} className="aspect-[4/4.6] w-full object-cover" />
            <p className="label mt-3 !text-[8.5px] text-stone">STAY CALM AROUND YOUR COMPANION — THEY READ YOU</p>
          </Reveal>
        </div>

        {/* signs */}
        <div className="mt-24 grid grid-cols-12 gap-x-6 gap-y-12 border-t border-line pt-16">
          <Reveal className="col-span-12 lg:col-span-4">
            <p className="label text-stone">WHEN TO CALL IMMEDIATELY</p>
            <h2 className="display-2 mt-6">RED <span className="serif-i font-normal normal-case text-alert">flags.</span></h2>
            <p className="mt-6 max-w-xs text-[14px] leading-relaxed text-stone">
              These signs should never wait for an appointment — not even ours.
            </p>
          </Reveal>
          <div className="col-span-12 lg:col-span-8">
            <ul>
              {SIGNS.map((s, i) => (
                <Reveal key={s} delay={i * 40}>
                  <li className={`flex items-center gap-5 border-line py-5 ${i === 0 ? "border-y" : "border-b"}`}>
                    <span className="label w-8 shrink-0 tabular text-alert/70">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-[14px] font-extrabold uppercase tracking-[0.06em]">{s}</span>
                  </li>
                </Reveal>
              ))}
            </ul>
            <p className="label mt-6 !text-[8.5px] leading-relaxed text-stone">
              NOT SURE? CALL ANYWAY. A TWO-MINUTE PHONE TRIAGE IS ALWAYS FREE — GUESSING IS NOT.
            </p>
          </div>
        </div>

        {/* steps */}
        <div className="mt-24 grid grid-cols-12 gap-x-6 gap-y-10">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 70} className="col-span-12 border border-line bg-paper p-8 sm:col-span-4">
              <p className="text-[clamp(2.2rem,4vw,3.4rem)] font-extrabold leading-none text-sage">{s.n}</p>
              <h3 className="mt-5 text-[17px] font-extrabold uppercase tracking-[0.08em]">{s.t}</h3>
              <p className="mt-3 text-[13.5px] leading-relaxed text-stone">{s.d}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-20">
          <div className="flex flex-col items-start gap-6 border border-dashed border-line px-8 py-10 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-[14px] font-semibold leading-relaxed text-stone">
              Not an emergency — but not nothing either? The smart booking will
              help you size it honestly.
            </p>
            <Link href="/appointment" className="btn btn-dark shrink-0">
              START WITH A FEW QUESTIONS <ArrowRight size={13} strokeWidth={2} aria-hidden />
            </Link>
          </div>
        </Reveal>
      </section>
      <Footer />
    </>
  );
}
