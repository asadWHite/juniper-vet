"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ArrowUpRight, Clock } from "lucide-react";
import { SERVICES } from "@/data/services";
import { doctorsForService } from "@/data/doctors";

export function ServicesExplorer() {
  const [activeId, setActiveId] = useState(SERVICES[0].id);
  const active = SERVICES.find((s) => s.id === activeId) ?? SERVICES[0];
  const docs = doctorsForService(active.id);

  return (
    <div className="mt-14 grid grid-cols-12 gap-x-6">
      {/* selector */}
      <div className="col-span-12 lg:col-span-5" role="tablist" aria-label="Services">
        {SERVICES.map((s) => {
          const on = s.id === activeId;
          return (
            <button
              key={s.id}
              role="tab"
              aria-selected={on}
              onClick={() => setActiveId(s.id)}
              className={`group flex w-full items-baseline gap-5 border-b border-line py-5 text-left transition-colors lg:py-6 ${
                on ? "text-ink" : "text-stone hover:text-ink"
              }`}
            >
              <span className={`label ${on ? "text-forest" : "text-stone/60"}`}>{s.index}</span>
              <span className="flex-1">
                <span className={`block text-[clamp(1.3rem,2.4vw,2rem)] font-extrabold uppercase leading-tight tracking-tight transition-transform duration-500 ${on ? "translate-x-1" : ""}`}>
                  {s.name}
                </span>
                <span className="mt-1 block text-[12.5px] font-medium tracking-wide">{s.short}</span>
              </span>
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center border transition-all duration-400 ${
                  on ? "border-ink bg-ink text-cream" : "border-line text-stone group-hover:border-ink group-hover:text-ink"
                }`}
              >
                <ArrowUpRight size={15} strokeWidth={1.75} aria-hidden />
              </span>
            </button>
          );
        })}
      </div>

      {/* panel */}
      <div className="col-span-12 mt-10 lg:col-span-7 lg:mt-0 lg:pl-10" role="tabpanel" aria-live="polite">
        <div key={active.id} className="animate-step-in">
          <div className="relative overflow-hidden">
            <img
              src={active.image}
              alt={active.imageAlt}
              className="aspect-[16/9] w-full animate-scale-in object-cover"
              loading="lazy"
            />
            <div className="absolute bottom-4 left-4 flex gap-2">
              <span className="flex items-center gap-1.5 border border-cream/40 bg-ink/40 px-3 py-2 backdrop-blur-[2px]">
                <Clock size={12} strokeWidth={1.75} className="text-cream" aria-hidden />
                <span className="label !text-[9px] text-cream tabular">{active.durationMinutes} MIN</span>
              </span>
              <span className="border border-cream/40 bg-ink/40 px-3 py-2 backdrop-blur-[2px]">
                <span className="label !text-[9px] text-cream">{active.priceLabel}</span>
              </span>
            </div>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <div>
              <p className="label text-stone">{active.index} — {active.name}</p>
              <p className="mt-4 text-[15px] leading-relaxed text-ink/80">{active.description}</p>
              <Link href={`/appointment?service=${active.id}`} className="link-arrow mt-7">
                START WITH THIS SERVICE <ArrowRight size={15} strokeWidth={1.75} aria-hidden />
              </Link>
            </div>
            <div className="border-l border-line pl-8">
              <p className="label text-stone">HOW TO PREPARE</p>
              <ul className="mt-4 space-y-2.5">
                {active.preparation.map((p) => (
                  <li key={p} className="flex gap-3 text-[12.5px] font-semibold tracking-wide text-ink/75">
                    <span className="mt-[7px] h-1 w-1 shrink-0 bg-forest" aria-hidden />
                    {p}
                  </li>
                ))}
              </ul>
              <p className="label mt-7 text-stone">USUALLY WITH</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {docs.map((d) => (
                  <Link
                    key={d.id}
                    href={`/doctors/${d.id}`}
                    className="border border-line px-3.5 py-2 text-[10.5px] font-bold tracking-[0.14em] transition-colors hover:border-ink hover:bg-ink hover:text-cream"
                  >
                    {d.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
