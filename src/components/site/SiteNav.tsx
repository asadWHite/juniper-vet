"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, PawPrint, User, X } from "lucide-react";
import { clinic } from "@/data/clinic";
import { IMG } from "@/data/images";

const LINKS = [
  { href: "/about", label: "ABOUT" },
  { href: "/#care", label: "CARE" },
  { href: "/doctors", label: "DOCTORS" },
  { href: "/account/pets", label: "PETS" },
  { href: "/journal", label: "JOURNAL" },
  { href: "/gallery", label: "GALLERY" },
  { href: "/#contact", label: "CONTACT" },
];

export function SiteNav({ loggedIn }: { loggedIn: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          scrolled ? "bg-cream/95 backdrop-blur-sm" : "bg-transparent"
        }`}
      >
        <div className="border-b border-line">
          <div className="container-x grid h-16 grid-cols-12 items-center gap-4 lg:h-[72px]">
            <Link href="/" className="col-span-6 flex items-center gap-2.5 lg:col-span-3" aria-label={clinic.name}>
              <PawPrint size={19} strokeWidth={2} className="text-forest" aria-hidden />
              <span className="text-[15px] font-extrabold tracking-[0.14em]">
                {clinic.brand}
                <span className="text-forest">{clinic.suffix}</span>
              </span>
            </Link>

            <nav className="col-span-6 hidden items-center justify-center gap-7 lg:flex" aria-label="Primary">
              {LINKS.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="text-[10.5px] font-bold tracking-[0.2em] text-ink/70 transition-colors hover:text-ink"
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <div className="col-span-6 flex items-center justify-end gap-2.5 lg:col-span-3">
              <Link
                href={loggedIn ? "/account" : "/login"}
                aria-label={loggedIn ? "Account" : "Sign in"}
                className="hidden h-11 w-11 items-center justify-center border border-line transition-colors hover:border-ink sm:flex"
              >
                <User size={16} strokeWidth={1.75} aria-hidden />
              </Link>
              <Link href="/appointment" className="btn btn-dark !px-5 !py-3 !text-[10px]">
                BOOK A VISIT
              </Link>
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Open menu"
                aria-expanded={open}
                className="flex h-11 w-11 items-center justify-center border border-line transition-colors hover:border-ink lg:hidden"
              >
                <Menu size={17} strokeWidth={1.75} aria-hidden />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={`fixed inset-0 z-[60] flex flex-col bg-forest text-cream transition-[opacity,visibility] duration-500 ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div className="container-x flex h-16 items-center justify-between border-b border-cream/15">
          <span className="flex items-center gap-2.5">
            <PawPrint size={19} strokeWidth={2} aria-hidden />
            <span className="text-[15px] font-extrabold tracking-[0.14em]">
              {clinic.brand}
              {clinic.suffix}
            </span>
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="flex h-11 w-11 items-center justify-center border border-cream/25 transition-colors hover:bg-cream hover:text-ink"
          >
            <X size={17} strokeWidth={1.75} aria-hidden />
          </button>
        </div>

        <nav className="container-x flex flex-1 flex-col justify-center gap-1 py-8" aria-label="Mobile">
          {[...LINKS, { href: "/emergency", label: "EMERGENCY" }, { href: loggedIn ? "/account" : "/login", label: "ACCOUNT" }].map(
            (l, i) => (
              <Link
                key={l.label}
                href={l.href}
                className={`group flex items-baseline gap-4 border-b border-cream/10 py-3 transition-all duration-500 ${
                  open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
                style={{ transitionDelay: `${80 + i * 45}ms` }}
              >
                <span className="label text-cream/40">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[clamp(1.7rem,7vw,2.6rem)] font-extrabold uppercase leading-none tracking-tight transition-transform duration-500 group-hover:translate-x-2">
                  {l.label}
                </span>
                <ArrowUpRight size={20} strokeWidth={1.5} className="ml-auto self-center text-cream/40" aria-hidden />
              </Link>
            )
          )}
        </nav>

        <div className={`border-t border-cream/15 transition-opacity duration-700 ${open ? "opacity-100" : "opacity-0"}`}>
          <div className="container-x grid grid-cols-12 items-center gap-4 py-5">
            <img src={IMG.emergency.src} alt="" className="col-span-3 h-16 w-full object-cover sm:col-span-2" />
            <div className="col-span-9 sm:col-span-6">
              <p className="label text-cream/50">URGENT CARE LINE</p>
              <a href={clinic.phoneHref} className="mt-1 block text-lg font-extrabold tracking-tight">
                {clinic.phoneDisplay}
              </a>
            </div>
            <Link href="/appointment" className="btn btn-light col-span-12 !py-3.5 sm:col-span-4">
              BOOK A VISIT
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
