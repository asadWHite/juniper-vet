import Link from "next/link";
import { ArrowRight, ArrowUpRight, MapPin, Phone } from "lucide-react";
import { clinic } from "@/data/clinic";
import { IMG } from "@/data/images";
import { Reveal } from "@/components/ui/Reveal";

export function EmergencyBand() {
  return (
    <section className="bg-ink text-cream" aria-label="Emergency">
      <div className="container-x grid grid-cols-12 items-center gap-6 py-14 lg:py-20">
        <Reveal className="col-span-12 lg:col-span-6">
          <p className="label text-cream/50">EMERGENCY</p>
          <h2 className="display-3 mt-4">
            NEED URGENT
            <br />
            <span className="serif-i font-normal normal-case">care right now?</span>
          </h2>
        </Reveal>
        <Reveal delay={120} className="col-span-12 flex flex-col gap-4 sm:flex-row lg:col-span-6 lg:justify-end">
          <a href={clinic.phoneHref} className="btn btn-light">
            <Phone size={14} strokeWidth={1.75} aria-hidden />
            CALL THE CLINIC
          </a>
          <Link href="/emergency" className="btn border-cream/25 text-cream hover:bg-cream hover:text-ink">
            EMERGENCY INFO
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-forest text-cream" aria-label="Book a visit">
      <div className="container-x relative z-10 grid grid-cols-12 py-24 lg:min-h-[80vh] lg:items-center lg:py-32">
        <div className="col-span-12 lg:col-span-7">
          <Reveal>
            <p className="label text-cream/50">{clinic.tagline}</p>
          </Reveal>
          <Reveal delay={90}>
            <h2 className="mt-6 text-[clamp(2.8rem,9vw,8rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.03em]">
              FOR EVERY
              <br />
              <span className="serif-i font-normal normal-case tracking-normal">little</span> LIFE.
            </h2>
          </Reveal>
          <Reveal delay={180} className="mt-10 flex flex-wrap items-center gap-6">
            <Link href="/appointment" className="btn bg-cream text-ink border-cream hover:bg-transparent hover:text-cream">
              BOOK A VISIT <ArrowRight size={14} strokeWidth={2} aria-hidden />
            </Link>
            <a href={clinic.phoneHref} className="link-arrow text-cream">
              {clinic.phoneDisplay} <ArrowUpRight size={15} strokeWidth={1.75} aria-hidden />
            </a>
          </Reveal>
        </div>
      </div>
      <Reveal
        variant="clip"
        className="pointer-events-none absolute bottom-0 right-0 top-auto hidden aspect-[4/5] w-[38vw] max-w-[560px] lg:block"
      >
        <img
          src={IMG.finalCta.src}
          alt={IMG.finalCta.alt}
          className="h-full w-full object-cover opacity-90"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest/50 via-transparent to-forest/20" aria-hidden />
      </Reveal>
      <img
        src={IMG.finalCta.src}
        alt={IMG.finalCta.alt}
        className="mt-12 h-64 w-full object-cover lg:hidden"
        loading="lazy"
      />
    </section>
  );
}

export function Footer() {
  return (
    <footer id="contact" className="border-t border-line bg-cream" aria-label="Footer">
      <div className="container-x grid grid-cols-12 gap-x-6 gap-y-12 py-16 lg:py-24">
        <div className="col-span-12 lg:col-span-5">
          <p className="text-[clamp(2rem,4vw,3.2rem)] font-extrabold uppercase leading-none tracking-tight">
            {clinic.brand}
            <span className="text-forest">{clinic.suffix}</span>
          </p>
          <p className="label mt-3 text-stone">{clinic.name}</p>
          <p className="mt-8 max-w-sm text-[15px] leading-relaxed text-stone">
            {clinic.tagline} A calm, modern practice for dogs, cats and every small companion in between.
          </p>
        </div>

        <nav className="col-span-6 sm:col-span-4 lg:col-span-2" aria-label="Site">
          <p className="label text-stone">VISIT</p>
          <ul className="mt-5 space-y-3 text-[13px] font-semibold tracking-wide">
            {[
              ["ABOUT", "/about"],
              ["DOCTORS", "/doctors"],
              ["JOURNAL", "/journal"],
              ["GALLERY", "/gallery"],
              ["EMERGENCY", "/emergency"],
            ].map(([label, href]) => (
              <li key={label}>
                <Link href={href} className="text-ink/75 transition-colors hover:text-ink">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="col-span-6 sm:col-span-4 lg:col-span-2" aria-label="Account">
          <p className="label text-stone">YOURS</p>
          <ul className="mt-5 space-y-3 text-[13px] font-semibold tracking-wide">
            {[
              ["BOOK A VISIT", "/appointment"],
              ["ACCOUNT", "/account"],
              ["MY PETS", "/account/pets"],
              ["APPOINTMENTS", "/account/appointments"],
              ["SAVED DOCTORS", "/account/favorites"],
            ].map(([label, href]) => (
              <li key={label}>
                <Link href={href} className="text-ink/75 transition-colors hover:text-ink">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="col-span-12 sm:col-span-4 lg:col-span-3">
          <p className="label text-stone">HOURS</p>
          <table className="mt-5 w-full text-[13px] font-semibold">
            <tbody>
              {clinic.hours.map((h) => (
                <tr key={h.days} className="border-b border-line-soft">
                  <td className="py-2.5 pr-4 text-ink/75">{h.days}</td>
                  <td className="py-2.5 text-right tabular">{h.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-6 space-y-2 text-[13px] font-semibold text-ink/75">
            <a href={clinic.phoneHref} className="flex items-center gap-2.5 transition-colors hover:text-ink">
              <Phone size={13} strokeWidth={1.75} aria-hidden /> {clinic.phoneDisplay}
            </a>
            <a
              href={clinic.mapUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2.5 transition-colors hover:text-ink"
            >
              <MapPin size={13} strokeWidth={1.75} aria-hidden /> {clinic.address.line1}, {clinic.address.line2}
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-x flex flex-col justify-between gap-2 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-stone sm:flex-row">
          <span>© {new Date().getFullYear()} {clinic.name} — {clinic.established}</span>
          <span className="max-w-xl sm:text-right">{clinic.demoNote}</span>
        </div>
      </div>
    </footer>
  );
}
