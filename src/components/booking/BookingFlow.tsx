"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Answers, DayVm, PetVm, SessionUser, SlotVm } from "@/types";
import { getQuestionFlow, type QuestionDef } from "@/data/questionnaire";
import { recommend, type Recommendation } from "@/lib/recommendation";
import { getService } from "@/data/services";
import { getDoctor } from "@/data/doctors";
import { BookingProgress } from "./BookingProgress";
import { BookingPanel } from "./BookingPanel";
import { QuestionStep } from "./QuestionStep";
import { EmergencyView, RecommendView, ReviewView } from "./CareSteps";
import { DoctorStep } from "./DoctorStep";
import { DateStep, TimeStep } from "./DateTimeSteps";
import { DetailsStep } from "./DetailsStep";
import { DoneStep } from "./DoneStep";

export type Stage =
  | "intro"
  | "q"
  | "review"
  | "recommend"
  | "doctor"
  | "date"
  | "time"
  | "details"
  | "done";

const SERVICE_REASON: Record<string, string> = {
  vaccination: "vaccination",
  dental: "dental",
  dermatology: "skin",
};

export interface DoctorNext {
  doctorId: string;
  date: string;
  start: string;
}

interface Props {
  user: SessionUser | null;
  pets: PetVm[];
  initial: { species?: string; service?: string; doctor?: string };
}

export interface DoneAppointment {
  id: string;
  petName: string;
  serviceName: string;
  doctorName: string;
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  status: string;
}

export function BookingFlow({ user, pets, initial }: Props) {
  const [answers, setAnswers] = useState<Answers>(() => {
    const a: Answers = {};
    if (initial.species) a.species = initial.species;
    if (initial.service && SERVICE_REASON[initial.service]) {
      a.reason = SERVICE_REASON[initial.service];
    }
    return a;
  });
  const [stage, setStage] = useState<Stage>(initial.species || initial.service ? "q" : "intro");
  const [qIndex, setQIndex] = useState(() => {
    const a: Answers = {};
    if (initial.species) a.species = initial.species;
    if (initial.service && SERVICE_REASON[initial.service]) a.reason = SERVICE_REASON[initial.service];
    if (!Object.keys(a).length) return 0;
    // resume at the first unanswered question in the adaptive flow
    const f = getQuestionFlow(a);
    const idx = f.findIndex((q) => a[q.id] === undefined);
    return idx >= 0 ? idx : 0;
  });
  const [returnToReview, setReturnToReview] = useState(false);
  const [sel, setSel] = useState<{ doctorId?: string; date?: string; startTime?: string }>({
    doctorId: initial.doctor,
  });
  const [nextSlots, setNextSlots] = useState<DoctorNext[] | null>(null);
  const [days, setDays] = useState<DayVm[] | null>(null);
  const [slots, setSlots] = useState<SlotVm[] | null>(null);
  const [slotsError, setSlotsError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<DoneAppointment | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flow = useMemo(() => getQuestionFlow(answers), [answers]);
  const showRec = useMemo(
    () => ["review", "recommend", "doctor", "date", "time", "details", "done"].includes(stage),
    [stage]
  );
  const rec: Recommendation | null = useMemo(
    () => (showRec ? recommend(answers) : null),
    [answers, showRec]
  );

  const question: QuestionDef | null = stage === "q" ? flow[Math.min(qIndex, flow.length - 1)] ?? null : null;

  // ---- network -------------------------------------------------------------
  useEffect(() => {
    if (stage !== "doctor" || !rec) return;
    let dead = false;
    setNextSlots(null);
    fetch(`/api/availability?kind=next&service=${rec.serviceId}`)
      .then((r) => r.json())
      .then((d) => !dead && setNextSlots(d.next ?? []))
      .catch(() => !dead && setNextSlots([]));
    return () => {
      dead = true;
    };
  }, [stage, rec]);

  const serviceId = rec?.serviceId;

  useEffect(() => {
    if ((stage !== "date" && stage !== "time") || !sel.doctorId || !serviceId) return;
    let dead = false;
    setDays(null);
    fetch(`/api/availability?kind=days&doctor=${sel.doctorId}&service=${serviceId}`)
      .then((r) => r.json())
      .then((d) => !dead && setDays(d.days ?? []))
      .catch(() => !dead && setDays([]));
    return () => {
      dead = true;
    };
  }, [stage, sel.doctorId, serviceId]);

  const loadSlots = useCallback(() => {
    if (!sel.doctorId || !sel.date || !serviceId) return;
    setSlots(null);
    setSlotsError(false);
    fetch(`/api/availability?kind=slots&doctor=${sel.doctorId}&service=${serviceId}&date=${sel.date}`)
      .then((r) => r.json())
      .then((d) => setSlots(d.slots ?? []))
      .catch(() => setSlotsError(true));
  }, [sel.doctorId, sel.date, serviceId]);

  useEffect(() => {
    if (stage !== "time" || !sel.date) return;
    loadSlots();
  }, [stage, sel.date, loadSlots]);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  // ---- transitions ---------------------------------------------------------
  const goQuestionForward = useCallback(
    (newAnswers: Answers, fromId: string) => {
      if (returnToReview) {
        setReturnToReview(false);
        setStage("review");
        return;
      }
      const nf = getQuestionFlow(newAnswers);
      const pos = nf.findIndex((q) => q.id === fromId);
      if (pos >= 0 && pos + 1 < nf.length) {
        setQIndex(pos + 1);
      } else {
        setStage("review");
      }
    },
    [returnToReview]
  );

  const answer = useCallback(
    (q: QuestionDef, value: string | string[], opts?: { auto?: boolean }) => {
      setError(null);
      const newAnswers = { ...answers, [q.id]: value };
      setAnswers(newAnswers);
      if (opts?.auto) {
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => goQuestionForward(newAnswers, q.id), 320);
      }
    },
    [answers, goQuestionForward]
  );

  const back = useCallback(() => {
    setError(null);
    if (stage === "q") {
      if (qIndex > 0) setQIndex(qIndex - 1);
      else setStage("intro");
    } else if (stage === "review") {
      setQIndex(Math.max(flow.length - 1, 0));
      setStage("q");
    } else if (stage === "recommend") setStage("review");
    else if (stage === "doctor") setStage("recommend");
    else if (stage === "date") setStage("doctor");
    else if (stage === "time") setStage("date");
    else if (stage === "details") setStage("time");
  }, [stage, qIndex, flow.length]);

  const canContinue = useMemo(() => {
    switch (stage) {
      case "intro":
        return true;
      case "q": {
        if (!question) return false;
        const v = answers[question.id];
        if (question.kind === "multi") return true;
        return !!v;
      }
      case "review":
      case "recommend":
        return rec ? !rec.emergency : false;
      case "doctor":
        return !!sel.doctorId;
      case "date":
        return !!sel.date;
      case "time":
        return !!sel.startTime;
      case "details":
        return true;
      default:
        return false;
    }
  }, [stage, question, answers, rec, sel]);

  const next = useCallback(() => {
    if (!canContinue) return;
    setError(null);
    if (stage === "intro") {
      setStage("q");
      setQIndex(0);
    } else if (stage === "q" && question) {
      goQuestionForward(answers, question.id);
    } else if (stage === "review") setStage("recommend");
    else if (stage === "recommend") setStage("doctor");
    else if (stage === "doctor") setStage("date");
    else if (stage === "date") setStage("time");
    else if (stage === "time") setStage("details");
  }, [stage, canContinue, question, goQuestionForward, answers]);

  const editQuestion = useCallback(
    (qid: string) => {
      const idx = flow.findIndex((q) => q.id === qid);
      if (idx < 0) return;
      setReturnToReview(true);
      setQIndex(idx);
      setStage("q");
    },
    [flow]
  );

  const pickDoctor = useCallback((id: string) => {
    setSel((s) => ({ ...s, doctorId: id, date: undefined, startTime: undefined }));
  }, []);

  const pickDate = useCallback((d: string) => {
    setSel((s) => ({ ...s, date: d, startTime: undefined }));
  }, []);

  const pickTime = useCallback((t: string) => {
    setSel((s) => ({ ...s, startTime: t }));
  }, []);

  // ---- submit --------------------------------------------------------------
  const submit = useCallback(
    async (payload: {
      petName: string;
      breed: string;
      petId: string | null;
      name: string;
      email: string;
      phone: string;
      notes: string;
    }) => {
      if (!rec || !sel.doctorId || !sel.date || !sel.startTime) return;
      setSubmitting(true);
      setError(null);
      try {
        const res = await fetch("/api/appointments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            doctorId: sel.doctorId,
            serviceId: rec.serviceId,
            date: sel.date,
            startTime: sel.startTime,
            pet: {
              petId: payload.petId,
              name: payload.petName,
              species: answers.species,
              breed: payload.breed,
            },
            contact: { name: payload.name, email: payload.email, phone: payload.phone },
            notes: payload.notes,
            questionnaire: answers,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          if (res.status === 409) {
            setError(data?.error?.message ?? "This time was just booked. Please choose another one.");
            setSel((s) => ({ ...s, startTime: undefined }));
            setStage("time");
            loadSlots();
          } else {
            setError(data?.error?.message ?? "Something went wrong. Please try again.");
          }
          return;
        }
        setDone(data.appointment);
        setStage("done");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch {
        setError("The connection dropped. Please try once more.");
      } finally {
        setSubmitting(false);
      }
    },
    [rec, sel, answers, loadSlots]
  );

  // ---- phase for progress ---------------------------------------------------
  const phase = useMemo(() => {
    if (stage === "q" && question) {
      return question.phase === "companion" ? 1 : question.phase === "concern" ? 2 : 3;
    }
    switch (stage) {
      case "review":
      case "recommend":
      case "doctor":
        return 4;
      case "date":
      case "time":
        return 5;
      case "details":
      case "done":
        return 6;
      default:
        return 0;
    }
  }, [stage, question]);

  const jumpToPhase = useCallback(
    (p: number) => {
      if (p >= phase) return;
      setError(null);
      if (p <= 3) {
        const idx = flow.findIndex((q) =>
          p === 1 ? q.phase === "companion" : p === 2 ? q.phase === "concern" : q.phase === "context"
        );
        if (idx >= 0) {
          setQIndex(idx);
          setStage("q");
        }
      } else if (p === 4) setStage("review");
      else if (p === 5 && sel.doctorId) setStage("date");
    },
    [phase, flow, sel.doctorId]
  );

  const showChrome = stage !== "intro" && stage !== "done";

  return (
    <div className="grid min-h-[100svh] grid-cols-12">
      {/* left: conversation */}
      <div className="col-span-12 flex flex-col lg:col-span-7 xl:col-span-8">
        {showChrome && (
          <div className="border-b border-line">
            <div className="px-5 pt-24 sm:px-10 lg:px-14 lg:pt-28">
              <BookingProgress phase={phase} onJump={jumpToPhase} />
            </div>
          </div>
        )}

        <div className={`flex flex-1 flex-col px-5 pb-32 sm:px-10 lg:px-14 ${showChrome ? "pt-10 lg:pt-14" : ""} lg:pb-16`}>
          <div key={`${stage}-${qIndex}`} className="flex-1 animate-step-in">
            {stage === "intro" && <IntroView onStart={next} />}
            {stage === "q" && question && (
              <QuestionStep
                question={question}
                answers={answers}
                index={qIndex}
                total={flow.length}
                onAnswer={answer}
              />
            )}
            {stage === "review" && (
              <ReviewView answers={answers} flow={flow} onEdit={editQuestion} />
            )}
            {stage === "recommend" && rec && !rec.emergency && <RecommendView rec={rec} answers={answers} />}
            {stage === "recommend" && rec && rec.emergency && <EmergencyView />}
            {stage === "doctor" && rec && (
              <DoctorStep
                serviceId={rec.serviceId}
                selected={sel.doctorId}
                nextSlots={nextSlots}
                onPick={pickDoctor}
              />
            )}
            {stage === "date" && <DateStep days={days} selected={sel.date} onPick={pickDate} />}
            {stage === "time" && (
              <TimeStep
                slots={slots}
                failed={slotsError}
                selected={sel.startTime}
                onPick={pickTime}
                onRetry={loadSlots}
              />
            )}
            {stage === "details" && rec && sel.doctorId && sel.date && sel.startTime && (
              <DetailsStep
                user={user}
                pets={pets}
                answers={answers}
                selection={{
                  service: rec.serviceLabel,
                  doctor: getDoctor(sel.doctorId)?.name ?? "",
                  date: sel.date,
                  time: sel.startTime,
                  duration: getService(rec.serviceId)?.durationMinutes ?? 30,
                }}
                submitting={submitting}
                onSubmit={submit}
              />
            )}
            {stage === "done" && done && <DoneAppointmentView done={done} user={user} />}
          </div>

          {error && (
            <p role="alert" className="mt-8 max-w-xl border border-alert/40 bg-[#f5e9e6] px-4 py-3 text-[13px] font-semibold text-alert">
              {error}
            </p>
          )}
        </div>

        {/* bottom bar */}
        {showChrome && (
          <div className="sticky bottom-0 z-20 border-t border-line bg-cream">
            <div className="flex items-center justify-between px-5 py-4 sm:px-10 lg:px-14">
              <button
                type="button"
                onClick={back}
                className="flex items-center gap-2 text-[10.5px] font-bold tracking-[0.2em] text-stone transition-colors hover:text-ink"
              >
                <ArrowLeft size={14} strokeWidth={2} aria-hidden /> BACK
              </button>
              {stage !== "details" && (
                <button type="button" onClick={next} disabled={!canContinue} className="btn btn-dark !px-8">
                  CONTINUE <ArrowRight size={13} strokeWidth={2.25} aria-hidden />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* right: live summary */}
      {stage !== "intro" && stage !== "done" && (
        <aside className="col-span-5 hidden border-l border-line lg:block xl:col-span-4" aria-label="Your visit so far">
          <BookingPanel answers={answers} rec={rec} sel={sel} stage={stage} />
        </aside>
      )}
    </div>
  );
}

// ---------------------------------------------------------------- intro
function IntroView({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex min-h-[100svh] flex-col justify-center py-28">
      <p className="label text-stone">SMART BOOKING — NO ACCOUNT NEEDED</p>
      <h1 className="display-2 mt-8 max-w-3xl">
        HOW CAN WE
        <br />
        <span className="serif-i font-normal normal-case text-forest">help?</span>
      </h1>
      <p className="mt-8 max-w-md text-[15px] leading-relaxed text-stone">
        Tell us a little about your companion — who they are, what you have
        noticed, how urgent it feels. We will guide you to the right kind of
        care, a suitable doctor and a real time slot.
      </p>
      <div className="mt-10 flex flex-wrap items-center gap-6">
        <button type="button" onClick={onStart} className="btn btn-dark !px-10">
          START <ArrowRight size={14} strokeWidth={2} aria-hidden />
        </button>
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-stone">
          ABOUT 60 SECONDS · 5–10 QUESTIONS
        </p>
      </div>
    </div>
  );
}

// thin wrapper keeps DoneStep's imported name tidy
function DoneAppointmentView({ done, user }: { done: DoneAppointment; user: SessionUser | null }) {
  return <DoneStep done={done} user={user} />;
}
