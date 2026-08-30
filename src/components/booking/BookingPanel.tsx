"use client";

import type { Answers } from "@/types";
import { answerLabel } from "@/data/questionnaire";
import { getService } from "@/data/services";
import { getDoctor } from "@/data/doctors";
import type { Recommendation } from "@/lib/recommendation";
import { humanShort } from "@/lib/dates";
import type { Stage } from "./BookingFlow";

interface Props {
  answers: Answers;
  rec: Recommendation | null;
  sel: { doctorId?: string; date?: string; startTime?: string };
  stage: Stage;
}

const SPECIES_IMG: Record<string, string> = {
  dog: "https://images.pexels.com/photos/9470781/pexels-photo-9470781.jpeg?auto=compress&cs=tinysrgb&w=800",
  cat: "https://images.pexels.com/photos/34802423/pexels-photo-34802423.jpeg?auto=compress&cs=tinysrgb&w=800",
  rabbit: "https://images.pexels.com/photos/13460159/pexels-photo-13460159.jpeg?auto=compress&cs=tinysrgb&w=800",
  bird: "https://images.pexels.com/photos/34595530/pexels-photo-34595530.jpeg?auto=compress&cs=tinysrgb&w=800",
  other: "https://images.pexels.com/photos/17376946/pexels-photo-17376946.jpeg?auto=compress&cs=tinysrgb&w=800",
};

function Row({ k, v }: { k: string; v?: string }) {
  if (!v) return null;
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line-soft py-3">
      <span className="label !text-[8.5px] shrink-0 text-stone">{k}</span>
      <span className="text-right text-[12.5px] font-bold uppercase tracking-wide">{v}</span>
    </div>
  );
}

export function BookingPanel({ answers, rec, sel, stage }: Props) {
  const species = (answers.species as string) ?? "dog";
  const img = SPECIES_IMG[species] ?? SPECIES_IMG.other;
  const symptoms = (answers.symptoms as string[]) ?? [];
  const service = rec ? getService(rec.serviceId) : undefined;
  const doctor = sel.doctorId ? getDoctor(sel.doctorId) : undefined;

  return (
    <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
      <div className="relative h-[38%] min-h-[220px] shrink-0 overflow-hidden">
        <img key={img} src={img} alt="Your companion" className="h-full w-full animate-scale-in object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/35 to-transparent" aria-hidden />
        <p className="label absolute bottom-4 left-6 !text-[9px] text-cream/90">
          YOUR COMPANION{species ? ` — ${species.toUpperCase()}` : ""}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-7 no-scrollbar">
        <p className="label !text-[9px] text-stone">ABOUT YOUR COMPANION — LIVE SUMMARY</p>
        <div className="mt-4">
          <Row k="SPECIES" v={answers.species ? String(answers.species).toUpperCase() : undefined} />
          <Row k="AGE" v={answers.age ? answerLabel("age", String(answers.age), answers) : undefined} />
          <Row k="MAIN CONCERN" v={answers.reason ? answerLabel("reason", String(answers.reason), answers) : undefined} />
          <Row
            k="NOTICED"
            v={
              symptoms.length
                ? symptoms
                    .slice(0, 2)
                    .map((s) => answerLabel("symptoms", s, answers))
                    .join(" · ") + (symptoms.length > 2 ? ` +${symptoms.length - 2}` : "")
                : undefined
            }
          />
          <Row k="DURATION" v={answers.duration ? answerLabel("duration", String(answers.duration), answers) : undefined} />
          <Row
            k="CONDITION"
            v={answers.severity ? answerLabel("severity", String(answers.severity), answers) : undefined}
          />
        </div>

        {rec && (stage === "doctor" || stage === "date" || stage === "time" || stage === "details") && (
          <>
            <p className="label mt-8 !text-[9px] text-forest">RECOMMENDED VISIT</p>
            <div className="mt-4">
              <Row k="SERVICE" v={service?.name} />
              <Row k="DURATION" v={service ? `${service.durationMinutes} MIN` : undefined} />
              <Row k="DOCTOR" v={doctor?.name} />
              <Row k="DATE" v={sel.date ? humanShort(sel.date) : undefined} />
              <Row k="TIME" v={sel.startTime} />
            </div>
          </>
        )}

        {stage === "q" && (
          <p className="mt-8 text-[12px] leading-relaxed text-stone">
            Your answers shape the next questions — we only ask what is relevant
            for your companion and your concern.
          </p>
        )}
      </div>
    </div>
  );
}
