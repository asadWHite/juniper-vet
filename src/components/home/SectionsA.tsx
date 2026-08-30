import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { IMG } from "@/data/images";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowLink, SectionHeading } from "@/components/ui/bits";

// ---------------------------------------------------------------- manifesto
export function IntroManifesto() {
  return (
    <section className="container-x grid grid-cols-12 gap-x-6 py-24 lg:py-40" aria-label="Philosophy">
      <Reveal variant="clip" className="col-span-10 col-start-2 sm:col-span-5 sm:col-start-1 lg:col-span-4">
        <img src={IMG.intro.src} alt={IMG.intro.alt} className="aspect-[4/5] w-full object-cover" loading="lazy" />
      </Reveal>

      <div className="col-span-12 mt-10 sm:col-span-7 lg:col-span-7 lg:col-start-6 lg:mt-0 lg:-ml-10">
        <Reveal>
          <p className="label text-stone">01 — WE OBSERVE FIRST</p>
        </Reveal>
        <Reveal delay={90}>
          <h2 className="display-2 relative z-10 mt-8 lg:-ml-24">
            THEY CANNOT
            <br />
            TELL US <span className="serif-i font-normal normal-case">what</span>
            <br />
            HURTS.
            <span className="serif-i mt-4 block font-normal normal-case tracking-normal text-forest">
              We learn to listen.
            </span>
          </h2>
        </Reveal>
        <Reveal delay={180} className="mt-12 grid gap-8 sm:grid-cols-2 lg:ml-0">
          <p className="text-[15px] leading-relaxed text-stone">
            An animal&rsquo;s chart is written in small things: the skipped breakfast, the
            new sleeping spot, the slower climb onto the sofa. Good veterinary
            medicine begins long before the stethoscope — it begins with attention.
          </p>
          <p className="text-[15px] leading-relaxed text-stone">
            That is why our booking starts with questions, not forms. You know the
            animal better than any database does. We translate what you have
            noticed into the right kind of visit.
          </p>
        </Reveal>
        <Reveal delay={240} className="mt-10">
          <ArrowLink href="/about">OUR PHILOSOPHY</ArrowLink>
        </Reveal>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- pillars
const PILLARS = [
  {
    i: "01",
    t: "EXAMINE",
    d: "Full nose-to-tail examinations, unhurried. The exam is the foundation — everything else follows what we find.",
    img: IMG.careExam,
  },
  {
    i: "02",
    t: "EXPLAIN",
    d: "Every finding in plain language, every option with its trade-offs, every price before a procedure. No quiet surprises.",
    img: IMG.careListen,
  },
  {
    i: "03",
    t: "FOLLOW UP",
    d: "Recovery calls, vaccine reminders, recheck plans. Care does not end at the door — it ends when the animal is well.",
    img: IMG.careHold,
  },
];

export function CarePillars() {
  return (
    <section id="care" className="border-y border-line bg-paper" aria-label="What we do">
      <div className="container-x py-24 lg:py-32">
        <SectionHeading index="02" label="CARE, EVERY DAY" right="WHAT HAPPENS AT JUNIPER" />
        <div>
          {PILLARS.map((p, idx) => (
            <Reveal key={p.i} delay={idx * 60}>
              <div
                className={`group grid grid-cols-12 items-center gap-x-6 gap-y-6 border-b border-line py-10 lg:py-14 ${
                  idx % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div className={idx % 2 === 1 ? "col-span-12 lg:col-span-7 lg:pl-16" : "col-span-12 lg:col-span-7"}>
                  <div className="flex items-baseline gap-6">
                    <span className="text-[clamp(2.4rem,5vw,4.5rem)] font-extrabold leading-none text-sage">{p.i}</span>
                    <h3 className="display-3 transition-transform duration-500 group-hover:translate-x-2">{p.t}</h3>
                  </div>
                  <p className="mt-5 max-w-md text-[15px] leading-relaxed text-stone lg:ml-[calc(clamp(2.4rem,5vw,4.5rem)+1.5rem)]">
                    {p.d}
                  </p>
                </div>
                <div className="col-span-8 col-start-3 sm:col-span-5 sm:col-start-5 lg:col-span-3 lg:col-start-9">
                  <Reveal variant="clip" className="img-zoom">
                    <img
                      src={p.img.src}
                      alt={p.img.alt}
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover"
                    />
                  </Reveal>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- categories
const CATS = [
  {
    id: "dogs",
    label: "DOGS",
    sub: "FROM FIRST VACCINES TO SENIOR YEARS",
    img: IMG.catDogs,
    span: "lg:col-span-7",
    aspect: "aspect-[4/5]",
  },
  {
    id: "cats",
    label: "CATS",
    sub: "QUIET VISITS FOR QUIET PATIENTS",
    img: IMG.catCats,
    span: "lg:col-span-5 lg:mt-24",
    aspect: "aspect-[4/5]",
  },
  {
    id: "small",
    label: "SMALL COMPANIONS",
    sub: "RABBITS · BIRDS · GUINEA PIGS · FERRETS",
    img: IMG.catSmall,
    span: "lg:col-span-12",
    aspect: "aspect-[16/7]",
  },
];

export function AnimalCategories() {
  return (
    <section className="container-x py-24 lg:py-32" aria-label="Who we treat">
      <SectionHeading index="03" label="WHO WE TREAT" right="EVERY SPECIES HAS ITS OWN MEDICINE" />
      <div className="mt-14 grid grid-cols-12 gap-x-6 gap-y-12">
        {CATS.map((c, idx) => (
          <Reveal key={c.id} delay={idx * 90} className={`col-span-12 ${c.span}`}>
            <Link href={`/appointment?species=${c.id === "small" ? "rabbit" : c.id.slice(0, -1)}`} className="group block" aria-label={`Care for ${c.label.toLowerCase()}`}>
              <div className="img-zoom relative overflow-hidden">
                <img src={c.img.src} alt={c.img.alt} loading="lazy" className={`${c.aspect} w-full object-cover`} />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent" aria-hidden />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 lg:p-8">
                  <div>
                    <h3 className="text-[clamp(1.8rem,4vw,3.4rem)] font-extrabold uppercase leading-none tracking-tight text-cream">
                      {c.label}
                    </h3>
                    <p className="label mt-2.5 !text-[9px] text-cream/75">{c.sub}</p>
                  </div>
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-cream/50 text-cream transition-all duration-500 group-hover:bg-cream group-hover:text-ink">
                    <ArrowRight size={17} strokeWidth={1.75} aria-hidden />
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
