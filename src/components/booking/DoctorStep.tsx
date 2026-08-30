"use client";

import { ArrowRight, Check } from "lucide-react";
import { doctorsForService, type DoctorDef } from "@/data/doctors";
import { humanShort } from "@/lib/dates";
import type { DoctorNext } from "./BookingFlow";

interface Props {
  serviceId: string;
  selected: string | undefined;
  nextSlots: DoctorNext[] | null; // null = loading
  onPick: (id: string) => void;
}

export function DoctorStep({ serviceId, selected, nextSlots, onPick }: Props) {
  const docs = doctorsForService(serviceId);
  const nextOf = (id: string) => nextSlots?.find((n) => n.doctorId === id);
  const sorted = [...docs].sort((a, b) => {
    const na = nextOf(a.id);
    const nb = nextOf(b.id);
    if (!na && !nb) return 0;
    if (!na) return 1;
    if (!nb) return -1;
    return `${na.date}${na.start}`.localeCompare(`${nb.date}${nb.start}`);
  });
  const bestId = nextSlots && nextSlots.length ? sorted[0]?.id : undefined;

  return (
    <div className="max-w-3xl">
      <p className="label text-stone">STEP — CARE</p>
      <h1 className="display-3 mt-6">WHO SHOULD LOOK AFTER THEM?</h1>
      <p className="mt-4 max-w-lg text-[14.5px] leading-relaxed text-stone">
        Based on the recommended visit, these doctors fit. Availability is live —
        the nearest open slot decides the suggestion.
      </p>

      <div className="mt-10 space-y-4" role="radiogroup" aria-label="Choose a doctor">
        {nextSlots === null &&
          docs.map((d) => (
            <div key={d.id} className="flex gap-5 border border-line-soft p-4" aria-hidden>
              <div className="skeleton aspect-square w-24" />
              <div className="flex-1 space-y-3 py-2">
                <div className="skeleton h-5 w-2/3" />
                <div className="skeleton h-3 w-1/3" />
              </div>
            </div>
          ))}

        {nextSlots !== null &&
          sorted.map((d, i) => (
            <DoctorRow
              key={d.id}
              doctor={d}
              next={nextOf(d.id)}
              best={d.id === bestId}
              selected={selected === d.id}
              onPick={onPick}
              index={i}
            />
          ))}
      </div>

      {nextSlots !== null && nextSlots.length === 0 && (
        <p className="mt-6 border border-line bg-paper px-5 py-4 text-[13px] font-semibold text-stone">
          No open slots in the next two weeks for this service — call us and we
          will find a solution.{" "}
          <a href="tel:+15550134420" className="text-ink underline underline-offset-4">
            +1 (555) 013-4420
          </a>
        </p>
      )}
    </div>
  );
}

function DoctorRow({
  doctor,
  next,
  best,
  selected,
  onPick,
  index,
}: {
  doctor: DoctorDef;
  next: DoctorNext | undefined;
  best: boolean;
  selected: boolean;
  onPick: (id: string) => void;
  index: number;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={() => onPick(doctor.id)}
      className={`animate-step-in group flex w-full items-center gap-5 border p-4 text-left transition-all duration-300 sm:p-5 ${
        selected ? "border-ink bg-paper ring-2 ring-ink ring-offset-2 ring-offset-cream" : "border-line hover:border-ink/60 hover:bg-paper"
      }`}
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <span className="relative shrink-0 overflow-hidden">
        <img src={doctor.photo} alt="" loading="lazy" className="aspect-[4/4.6] w-20 object-cover sm:w-24" />
        {best && (
          <span className="absolute left-0 top-0 bg-forest px-2 py-1 text-[7.5px] font-bold tracking-[0.18em] text-cream">
            BEST MATCH
          </span>
        )}
      </span>
      <span className="flex-1">
        <span className="block text-[16px] font-extrabold uppercase tracking-tight sm:text-[18px]">{doctor.name}</span>
        <span className="label mt-1.5 block !text-[8.5px] text-stone">{doctor.specialty}</span>
        <span className="mt-3 flex items-center gap-2">
          <span className={`h-1.5 w-1.5 rounded-full ${next ? "bg-forest" : "bg-line"}`} aria-hidden />
          <span className="text-[10.5px] font-bold tracking-[0.14em] text-stone tabular">
            {next ? `NEXT AVAILABLE — ${humanShort(next.date)} · ${next.start}` : "CURRENTLY FULLY BOOKED"}
          </span>
        </span>
      </span>
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center border transition-all ${
          selected ? "border-ink bg-ink text-cream" : "border-line text-stone group-hover:border-ink group-hover:text-ink"
        }`}
        aria-hidden
      >
        {selected ? <Check size={15} strokeWidth={2.5} /> : <ArrowRight size={15} strokeWidth={1.75} />}
      </span>
    </button>
  );
}
