"use client";

const PHASES = [
  { n: "01", label: "COMPANION" },
  { n: "02", label: "CONCERN" },
  { n: "03", label: "CONTEXT" },
  { n: "04", label: "CARE" },
  { n: "05", label: "TIME" },
  { n: "06", label: "CONFIRM" },
];

export function BookingProgress({ phase, onJump }: { phase: number; onJump: (p: number) => void }) {
  return (
    <nav aria-label="Booking progress" className="pb-5">
      <ol className="flex items-end gap-4 overflow-x-auto no-scrollbar sm:gap-6">
        {PHASES.map((p, i) => {
          const num = i + 1;
          const state = num < phase ? "done" : num === phase ? "current" : "todo";
          return (
            <li key={p.n} className="shrink-0">
              <button
                type="button"
                onClick={() => onJump(num)}
                disabled={state !== "done"}
                aria-current={state === "current" ? "step" : undefined}
                className={`group flex flex-col items-start gap-1.5 pb-2 text-left transition-colors ${
                  state === "done" ? "cursor-pointer" : "cursor-default"
                }`}
              >
                <span
                  className={`text-[18px] font-extrabold leading-none tabular transition-colors ${
                    state === "current" ? "text-ink" : state === "done" ? "text-forest" : "text-ink/25"
                  }`}
                >
                  {p.n}
                </span>
                <span
                  className={`text-[8.5px] font-bold tracking-[0.2em] transition-colors ${
                    state === "current" ? "text-ink" : state === "done" ? "text-forest" : "text-ink/25"
                  }`}
                >
                  {p.label}
                </span>
                <span
                  className={`h-px w-full origin-left bg-current transition-transform duration-500 ${
                    state === "todo" ? "scale-x-0" : "scale-x-100"
                  } ${state === "current" ? "text-ink" : "text-forest"}`}
                  aria-hidden
                />
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
