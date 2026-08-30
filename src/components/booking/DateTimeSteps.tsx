"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { DayVm, SlotVm } from "@/types";
import { DAY_STATUS_LABEL, SLOT_STATUS_LABEL } from "@/lib/availability";
import { periodOf } from "@/lib/dates";

// ---------------------------------------------------------------- date
export function DateStep({
  days,
  selected,
  onPick,
}: {
  days: DayVm[] | null;
  selected: string | undefined;
  onPick: (d: string) => void;
}) {
  const [window_, setWindow] = useState(0);

  return (
    <div className="max-w-3xl">
      <p className="label text-stone">STEP — TIME</p>
      <h1 className="display-3 mt-6">WHICH DAY WORKS?</h1>
      <p className="mt-4 max-w-lg text-[14.5px] leading-relaxed text-stone">
        Fourteen days of real availability. Days marked full are genuinely full —
        nothing here is decorative.
      </p>

      <div className="mt-10 flex items-center justify-between">
        <p className="label !text-[9px] text-stone">WEEK {window_ + 1} OF 2</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setWindow(0)}
            disabled={window_ === 0}
            aria-label="Previous week"
            className="flex h-10 w-10 items-center justify-center border border-line transition-colors hover:border-ink disabled:opacity-30"
          >
            <ChevronLeft size={15} strokeWidth={1.75} aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => setWindow(1)}
            disabled={window_ === 1}
            aria-label="Next week"
            className="flex h-10 w-10 items-center justify-center border border-line transition-colors hover:border-ink disabled:opacity-30"
          >
            <ChevronRight size={15} strokeWidth={1.75} aria-hidden />
          </button>
        </div>
      </div>

      {days === null ? (
        <div className="mt-4 grid grid-cols-7 gap-2" aria-hidden>
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="skeleton h-24" />
          ))}
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-7" role="radiogroup" aria-label="Choose a day">
          {days.slice(window_ * 7, window_ * 7 + 7).map((d, i) => {
            const on = d.date === selected;
            const disabled = d.status === "past" || d.status === "unavailable" || d.status === "full";
            return (
              <button
                key={d.date}
                type="button"
                role="radio"
                aria-checked={on}
                disabled={disabled}
                onClick={() => onPick(d.date)}
                className={`animate-step-in flex flex-col items-start gap-1 border p-3.5 text-left transition-all duration-300 ${
                  on
                    ? "border-ink bg-ink text-cream"
                    : disabled
                      ? "cursor-not-allowed border-line-soft text-stone/50"
                      : "border-line hover:border-ink hover:bg-paper"
                }`}
                style={{ animationDelay: `${i * 45}ms` }}
              >
                <span className={`text-[9px] font-bold tracking-[0.2em] ${on ? "text-cream/60" : "text-stone"}`}>
                  {d.weekday}
                </span>
                <span className="text-[24px] font-extrabold leading-none tabular">{d.dayNum}</span>
                <span
                  className={`mt-1 text-[8px] font-bold tracking-[0.16em] ${
                    on ? "text-cream/70" : d.status === "limited" ? "text-forest" : "text-stone/70"
                  } ${d.status === "full" ? "strike" : ""}`}
                >
                  {DAY_STATUS_LABEL[d.status]}
                </span>
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
        {(["available", "limited", "full", "unavailable"] as const).map((s) => (
          <span key={s} className="flex items-center gap-2 text-[9px] font-bold tracking-[0.16em] text-stone">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                s === "available" ? "bg-forest" : s === "limited" ? "bg-moss" : "bg-line"
              }`}
              aria-hidden
            />
            {DAY_STATUS_LABEL[s]}
          </span>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- time
export function TimeStep({
  slots,
  failed,
  selected,
  onPick,
  onRetry,
}: {
  slots: SlotVm[] | null;
  failed: boolean;
  selected: string | undefined;
  onPick: (t: string) => void;
  onRetry: () => void;
}) {
  if (failed) {
    return (
      <div className="max-w-3xl">
        <h1 className="display-3 mt-6">TIMES COULDN'T LOAD</h1>
        <p className="mt-4 text-[14.5px] text-stone">The connection hiccuped — nothing is lost.</p>
        <button type="button" onClick={onRetry} className="btn btn-ghost mt-8">
          TRY AGAIN
        </button>
      </div>
    );
  }

  const groups: Record<string, SlotVm[]> = { MORNING: [], AFTERNOON: [], EVENING: [] };
  for (const s of slots ?? []) groups[periodOf(s.start)].push(s);

  return (
    <div className="max-w-3xl">
      <p className="label text-stone">STEP — TIME</p>
      <h1 className="display-3 mt-6">PICK A TIME.</h1>
      <p className="mt-4 max-w-lg text-[14.5px] leading-relaxed text-stone">
        Crossed-out times are already booked. The full visit duration always fits
        before closing — the system checks for you.
      </p>

      {slots === null ? (
        <div className="mt-10 grid grid-cols-3 gap-2 sm:grid-cols-5" aria-hidden>
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="skeleton h-12" />
          ))}
        </div>
      ) : (
        <div className="mt-10 space-y-8">
          {Object.entries(groups).map(([label, list]) =>
            list.length === 0 ? null : (
              <div key={label}>
                <p className="label !text-[9px] text-stone">{label}</p>
                <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5" role="radiogroup" aria-label={`${label} times`}>
                  {list.map((s) => {
                    const on = s.start === selected;
                    const free = s.state === "available";
                    return (
                      <button
                        key={s.start}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        disabled={!free}
                        onClick={() => onPick(s.start)}
                        aria-label={`${s.start} — ${SLOT_STATUS_LABEL[s.state]}`}
                        className={`flex h-12 items-center justify-center border text-[13px] font-bold tabular transition-all duration-300 ${
                          on
                            ? "border-ink bg-ink text-cream"
                            : free
                              ? "border-line hover:border-ink hover:bg-paper"
                              : "cursor-not-allowed border-line-soft"
                        }`}
                        title={SLOT_STATUS_LABEL[s.state]}
                      >
                        <span className={s.state === "booked" ? "strike" : s.state !== "available" ? "text-stone/50" : ""}>
                          {s.start}
                        </span>
                        {s.state === "booked" && <span className="sr-only">(booked)</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )
          )}
          {slots.length === 0 && (
            <p className="border border-line bg-paper px-5 py-4 text-[13px] font-semibold text-stone">
              No times left on this day — please choose another date.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
