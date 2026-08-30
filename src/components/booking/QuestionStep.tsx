"use client";

import { Check } from "lucide-react";
import type { Answers } from "@/types";
import {
  questionOptions,
  questionTitle,
  type QOption,
  type QuestionDef,
} from "@/data/questionnaire";

interface Props {
  question: QuestionDef;
  answers: Answers;
  index: number;
  total: number;
  onAnswer: (q: QuestionDef, value: string | string[], opts?: { auto?: boolean }) => void;
}

export function QuestionStep({ question, answers, index, total, onAnswer }: Props) {
  const options = questionOptions(question, answers);
  const value = answers[question.id];

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <p className="label text-stone">{question.eyebrow}</p>
        <p className="label !text-[9px] text-stone/70 tabular">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>
      </div>
      <h1 className="display-3 mt-6 max-w-2xl">{questionTitle(question, answers)}</h1>
      {question.hint && <p className="label mt-4 !text-[9px] text-stone">{question.hint}</p>}

      {question.kind === "visual" && (
        <div
          role="radiogroup"
          aria-label={questionTitle(question, answers)}
          className={`mt-10 grid gap-3 ${
            options.length > 4 ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" : "grid-cols-2 lg:grid-cols-4"
          }`}
        >
          {options.map((o, i) => {
            const on = value === o.id;
            return (
              <button
                key={o.id}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => onAnswer(question, o.id, { auto: true })}
                className={`group relative overflow-hidden border text-left transition-all duration-400 ${
                  on ? "border-ink ring-2 ring-ink ring-offset-2 ring-offset-cream" : "border-line hover:border-ink"
                } ${i === 0 ? "animate-step-in" : "animate-step-in"}`}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {o.image && (
                  <img
                    src={o.image}
                    alt=""
                    loading="lazy"
                    className={`aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                      options.length > 4 ? "!aspect-[4/4.6]" : ""
                    }`}
                  />
                )}
                <span className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-ink/65 to-transparent p-3.5 pt-8">
                  <span>
                    <span className="block text-[13px] font-extrabold uppercase tracking-[0.12em] text-cream">
                      {o.label}
                    </span>
                    {o.sub && (
                      <span className="mt-1 block text-[8.5px] font-bold tracking-[0.18em] text-cream/70">{o.sub}</span>
                    )}
                  </span>
                  {on && (
                    <span className="flex h-6 w-6 items-center justify-center bg-cream text-ink">
                      <Check size={13} strokeWidth={2.5} aria-hidden />
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {question.kind === "list" && (
        <div role="radiogroup" aria-label={questionTitle(question, answers)} className="mt-10 max-w-2xl">
          {options.map((o, i) => {
            const on = value === o.id;
            const danger = o.tone === "danger";
            return (
              <button
                key={o.id}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => onAnswer(question, o.id, { auto: true })}
                className={`animate-step-in group flex w-full items-center gap-5 border-b px-1 py-4.5 text-left transition-all duration-300 ${
                  danger
                    ? on
                      ? "border-alert/50 bg-[#f5e9e6]"
                      : "border-line hover:bg-[#f5e9e6]/60"
                    : on
                      ? "border-ink bg-paper"
                      : "border-line hover:bg-paper"
                }`}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <span className={`label w-7 shrink-0 tabular ${on ? "text-ink" : "text-stone/50"}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 py-1">
                  <span
                    className={`block text-[14.5px] font-extrabold uppercase tracking-[0.06em] ${
                      danger ? "text-alert" : "text-ink"
                    }`}
                  >
                    {o.label}
                  </span>
                  {o.sub && (
                    <span className="mt-1 block text-[10px] font-bold tracking-[0.16em] text-stone">{o.sub}</span>
                  )}
                </span>
                <span
                  className={`mr-3 flex h-6 w-6 shrink-0 items-center justify-center border transition-all ${
                    on
                      ? danger
                        ? "border-alert bg-alert text-cream"
                        : "border-ink bg-ink text-cream"
                      : "border-line text-transparent group-hover:border-ink/40"
                  }`}
                  aria-hidden
                >
                  <Check size={13} strokeWidth={2.5} />
                </span>
              </button>
            );
          })}
        </div>
      )}

      {question.kind === "multi" && <MultiPicker question={question} options={options} value={value} onAnswer={onAnswer} />}
    </div>
  );
}

function MultiPicker({
  question,
  options,
  value,
  onAnswer,
}: {
  question: QuestionDef;
  options: QOption[];
  value: string | string[] | undefined;
  onAnswer: Props["onAnswer"];
}) {
  const selected = new Set(Array.isArray(value) ? value : value ? [value] : []);
  const toggle = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onAnswer(question, [...next]);
  };
  return (
    <>
      <div className="mt-10 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2">
        {options.map((o, i) => {
          const on = selected.has(o.id);
          return (
            <button
              key={o.id}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(o.id)}
              className={`animate-step-in flex items-center gap-4 border px-5 py-4 text-left transition-all duration-300 ${
                on ? "border-ink bg-ink text-cream" : "border-line bg-transparent hover:border-ink"
              }`}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center border ${
                  on ? "border-cream/60 bg-cream text-ink" : "border-line text-transparent"
                }`}
                aria-hidden
              >
                <Check size={11} strokeWidth={3} />
              </span>
              <span>
                <span className="block text-[12.5px] font-extrabold uppercase tracking-[0.1em]">{o.label}</span>
                {o.sub && (
                  <span className={`mt-0.5 block text-[9px] font-bold tracking-[0.16em] ${on ? "text-cream/60" : "text-stone"}`}>
                    {o.sub}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
      <p className="label mt-6 !text-[9px] text-stone tabular" aria-live="polite">
        {selected.size === 0 ? "SELECT ALL THAT APPLY — OR PRESS CONTINUE TO SKIP" : `${selected.size} SELECTED — PRESS CONTINUE`}
      </p>
    </>
  );
}
