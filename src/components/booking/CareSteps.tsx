"use client";

import { Check, MapPin, Pencil, Phone, ShieldAlert } from "lucide-react";
import type { Answers } from "@/types";
import { answerLabel, type QuestionDef } from "@/data/questionnaire";
import { getService } from "@/data/services";
import { doctorsForService } from "@/data/doctors";
import type { Recommendation } from "@/lib/recommendation";
import { clinic } from "@/data/clinic";
import { IMG } from "@/data/images";

// ---------------------------------------------------------------- summary
export function ReviewView({
  answers,
  flow,
  onEdit,
}: {
  answers: Answers;
  flow: QuestionDef[];
  onEdit: (qid: string) => void;
}) {
  const symptoms = (answers.symptoms as string[]) ?? [];
  return (
    <div className="max-w-3xl">
      <p className="label text-stone">SUMMARY — CHECK EVERYTHING</p>
      <h1 className="display-3 mt-6">ABOUT YOUR COMPANION</h1>
      <p className="mt-4 max-w-lg text-[14.5px] leading-relaxed text-stone">
        This is what we understood. Correct anything that is off — the
        recommendation on the next screen is built from exactly this.
      </p>

      <dl className="mt-10 border-t border-line">
        {flow.map((q, i) => {
          const v = answers[q.id];
          if (!v) return null;
          const display = Array.isArray(v)
            ? v.map((x) => answerLabel(q.id, x, answers)).join(" · ")
            : answerLabel(q.id, v, answers);
          return (
            <div key={q.id} className="group flex items-center gap-5 border-b border-line py-5 animate-step-in" style={{ animationDelay: `${i * 50}ms` }}>
              <span className="label w-8 shrink-0 tabular text-stone/60">{String(i + 1).padStart(2, "0")}</span>
              <dt className="label !text-[8.5px] w-28 shrink-0 text-stone sm:w-36">
                {q.id === "species" ? "COMPANION" : q.id.replace(/-/g, " ").toUpperCase()}
              </dt>
              <dd className="flex-1 text-[13.5px] font-extrabold uppercase tracking-[0.05em]">{display}</dd>
              <button
                type="button"
                onClick={() => onEdit(q.id)}
                aria-label={`Edit ${q.id}`}
                className="flex h-9 w-9 shrink-0 items-center justify-center border border-line text-stone transition-colors hover:border-ink hover:text-ink"
              >
                <Pencil size={13} strokeWidth={1.75} aria-hidden />
              </button>
            </div>
          );
        })}
        {symptoms.length > 0 && null}
      </dl>

      <p className="label mt-8 !text-[9px] text-stone">EDIT ANSWERS ABOVE — OR CONTINUE TO YOUR RECOMMENDATION →</p>
    </div>
  );
}

// ---------------------------------------------------------------- recommendation
export function RecommendView({ rec, answers }: { rec: Recommendation; answers: Answers }) {
  const service = getService(rec.serviceId);
  const docs = doctorsForService(rec.serviceId);
  const species = String(answers.species ?? "companion");
  void species;

  return (
    <div className="max-w-3xl">
      <p className="label text-forest">BASED ON WHAT YOU TOLD US</p>
      <h1 className="display-3 mt-6">{rec.headline}</h1>

      <div className="mt-7 flex flex-wrap gap-2.5">
        <span
          className={`px-3.5 py-2 text-[9.5px] font-bold tracking-[0.18em] ${
            rec.urgency === "priority"
              ? "bg-alert text-cream"
              : rec.urgency === "soon"
                ? "bg-forest text-cream"
                : "border border-line text-stone"
          }`}
        >
          {rec.urgencyLabel}
        </span>
        {service && (
          <span className="border border-line px-3.5 py-2 text-[9.5px] font-bold tracking-[0.18em] text-stone tabular">
            ABOUT {service.durationMinutes} MINUTES
          </span>
        )}
      </div>

      <div className="mt-10 grid gap-8 border-t border-line pt-10 sm:grid-cols-2">
        <div>
          <p className="label !text-[9px] text-stone">WHY THIS MAKES SENSE</p>
          <ul className="mt-5 space-y-3.5">
            {rec.reasons.map((r) => (
              <li key={r} className="flex gap-3 text-[13.5px] leading-relaxed text-ink/85">
                <Check size={15} strokeWidth={2} className="mt-0.5 shrink-0 text-forest" aria-hidden />
                {r}
              </li>
            ))}
          </ul>
          <p className="mt-6 border-l-2 border-sage pl-4 text-[12px] leading-relaxed text-stone">
            This is guidance, not a diagnosis. The doctor examines your companion
            before any conclusion is drawn.
          </p>
        </div>
        {service && (
          <div>
            <div className="img-zoom overflow-hidden">
              <img src={service.image} alt={service.imageAlt} loading="lazy" className="aspect-[16/10] w-full object-cover" />
            </div>
            <p className="mt-4 text-[16px] font-extrabold uppercase tracking-tight">{service.name}</p>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-stone">{service.short}</p>
            <p className="label mt-4 !text-[8.5px] text-stone">
              SUITABLE DOCTORS — {docs.map((d) => d.name.replace("DR. ", "DR. ")).join(" · ")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- emergency
export function EmergencyView() {
  return (
    <div className="max-w-3xl">
      <div className="border-2 border-alert/70 bg-[#f5e9e6] p-7 sm:p-10">
        <p className="flex items-center gap-3 text-alert">
          <ShieldAlert size={18} strokeWidth={1.75} aria-hidden />
          <span className="label !text-[10px]">PLEASE READ</span>
        </p>
        <h1 className="mt-5 text-[clamp(1.6rem,3.6vw,2.6rem)] font-extrabold uppercase leading-[1.05] tracking-tight text-alert">
          THIS MAY NEED PROMPT VETERINARY ATTENTION.
        </h1>
        <p className="mt-5 max-w-xl text-[14.5px] leading-relaxed text-ink/85">
          Based on what you described, your companion should be seen as soon as
          possible — faster than online booking can guarantee. Please call the
          clinic now; if we are closed, head to your nearest emergency
          veterinary service.
        </p>
        <div className="mt-8 flex flex-wrap gap-3.5">
          <a href={clinic.phoneHref} className="btn btn-dark !bg-alert !border-alert hover:!bg-ink">
            <Phone size={14} strokeWidth={2} aria-hidden /> CALL THE CLINIC — {clinic.phoneDisplay}
          </a>
          <a href={clinic.mapUrl} target="_blank" rel="noreferrer" className="btn btn-ghost !border-alert/50 !text-alert hover:!bg-alert hover:!text-cream hover:!border-alert">
            <MapPin size={14} strokeWidth={1.75} aria-hidden /> GET DIRECTIONS
          </a>
        </div>
      </div>

      <div className="mt-8 grid items-center gap-6 sm:grid-cols-[120px_1fr]">
        <img src={IMG.emergency.src} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover" />
        <div className="space-y-2.5">
          {[
            "BRING ANY PACKAGING OF WHAT THEY MAY HAVE EATEN",
            "KEEP THEM WARM, QUIET AND STILL",
            "DO NOT OFFER FOOD OR WATER ON THE WAY IF THEY ARE DISTRESSED",
          ].map((t) => (
            <p key={t} className="flex gap-3 text-[11px] font-bold uppercase tracking-[0.14em] text-stone">
              <span className="mt-1 h-1 w-1 shrink-0 bg-alert" aria-hidden />
              {t}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
