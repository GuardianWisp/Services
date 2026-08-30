"use client";

import { useId, useState, type ReactNode } from "react";
import { Sparkles } from "lucide-react";

interface BeforeAfterSliderProps {
  icon: ReactNode;
  label: string;
  before: string;
  after: string;
}

export function BeforeAfterSlider({
  icon,
  label,
  before,
  after,
}: BeforeAfterSliderProps) {
  const [value, setValue] = useState(52);
  const sliderId = useId();

  return (
    <div className="w-full">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-line bg-paper-alt">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[linear-gradient(160deg,#e4e1da,#f2f0ec_55%,#dedad2)] grayscale dark:bg-[linear-gradient(160deg,#232228,#2b2a30_55%,#1c1b20)]">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/70 text-neutral-500 backdrop-blur-sm dark:bg-black/30 dark:text-neutral-400">
            {icon}
          </div>
          <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-neutral-600 backdrop-blur-sm dark:bg-black/30 dark:text-neutral-300">
            До
          </span>
        </div>

        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 overflow-hidden bg-[linear-gradient(160deg,#fff4ee,#ffffff_55%,var(--color-accent-soft))] dark:bg-[linear-gradient(160deg,#1a191e,#141317_55%,var(--color-accent-soft))]"
          style={{ clipPath: `inset(0 0 0 ${value}%)` }}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-contrast shadow-[0_10px_24px_-8px_color-mix(in_srgb,var(--color-accent)_50%,transparent)]">
            {icon}
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1 text-xs font-medium text-paper">
            <Sparkles className="h-3 w-3" />
            После
          </span>
        </div>

        <div
          className="pointer-events-none absolute inset-y-0 w-px bg-ink/70"
          style={{ left: `${value}%` }}
        >
          <div className="absolute top-1/2 left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-ink text-paper shadow-lg">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M8 6 3 12l5 6M16 6l5 6-5 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <label htmlFor={sliderId} className="sr-only">
          Сравнить до и после для примера «{label}»
        </label>
        <input
          id={sliderId}
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-ew-resize appearance-none bg-transparent opacity-0"
        />
      </div>

      <div className="mt-4 flex flex-col gap-0.5 px-1 text-sm">
        <span className="font-medium text-ink">{label}</span>
        <span className="text-muted">{value < 50 ? before : after}</span>
      </div>
    </div>
  );
}
