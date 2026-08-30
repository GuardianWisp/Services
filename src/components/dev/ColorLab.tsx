"use client";

import { useEffect, useState } from "react";
import { Palette, X } from "lucide-react";

function hslToHex(h: number, s: number, l: number) {
  const a = (s / 100) * Math.min(l / 100, 1 - l / 100);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l / 100 - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(color * 255)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function paletteFromHue(h: number) {
  return {
    accent: hslToHex(h, 90, 55),
    accentInk: hslToHex(h, 70, 35),
    accentSoft: hslToHex(h, 90, 92),
    accentContrast: hslToHex(h, 40, 10),
  };
}

const VARS: Record<string, string> = {
  accent: "--color-accent",
  accentInk: "--color-accent-ink",
  accentSoft: "--color-accent-soft",
  accentContrast: "--color-accent-contrast",
};

export function ColorLab() {
  const [open, setOpen] = useState(false);
  const [hue, setHue] = useState(75);
  const [applied, setApplied] = useState(false);

  const palette = paletteFromHue(hue);

  useEffect(() => {
    if (!applied) return;
    const root = document.documentElement;
    root.style.setProperty(VARS.accent, palette.accent);
    root.style.setProperty(VARS.accentInk, palette.accentInk);
    root.style.setProperty(VARS.accentSoft, palette.accentSoft);
    root.style.setProperty(VARS.accentContrast, palette.accentContrast);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hue, applied]);

  const reset = () => {
    const root = document.documentElement;
    Object.values(VARS).forEach((v) => root.style.removeProperty(v));
    setApplied(false);
  };

  const copy = () => {
    const css = [
      `--color-accent: ${palette.accent};`,
      `--color-accent-ink: ${palette.accentInk};`,
      `--color-accent-soft: ${palette.accentSoft};`,
      `--color-accent-contrast: ${palette.accentContrast};`,
    ].join("\n");
    navigator.clipboard?.writeText(css).catch(() => {});
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 left-5 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-line bg-card text-ink shadow-lg"
        aria-label="Открыть цветовую лабораторию"
      >
        <Palette className="h-4 w-4" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-5 left-5 z-50 w-72 rounded-2xl border border-line bg-card p-4 text-ink shadow-2xl">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">Color Lab (dev only)</span>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Закрыть"
          className="text-muted hover:text-ink"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 flex gap-2">
        {Object.entries(palette).map(([key, hex]) => (
          <div
            key={key}
            className="h-10 flex-1 rounded-lg border border-line"
            style={{ background: hex }}
            title={`${key}: ${hex}`}
          />
        ))}
      </div>

      <label className="mt-4 flex flex-col gap-1 text-xs text-muted">
        Hue: {hue}°
        <input
          type="range"
          min={0}
          max={360}
          value={hue}
          onChange={(e) => {
            setHue(Number(e.target.value));
            setApplied(true);
          }}
          className="w-full accent-[var(--color-accent)]"
          style={{
            background:
              "linear-gradient(to right, red, yellow, lime, cyan, blue, magenta, red)",
            height: 6,
            borderRadius: 999,
          }}
        />
      </label>

      <div className="mt-3 flex gap-2 text-xs">
        <button
          type="button"
          onClick={copy}
          className="flex-1 rounded-lg border border-line py-2 font-medium hover:bg-paper-alt"
        >
          Скопировать CSS
        </button>
        <button
          type="button"
          onClick={reset}
          className="flex-1 rounded-lg border border-line py-2 font-medium hover:bg-paper-alt"
        >
          Сбросить
        </button>
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-muted">
        Двигай слайдер — акцент, текст, подложка и контраст пересчитаются
        живьём по всему сайту. Когда найдёшь цвет — жми &laquo;Скопировать
        CSS&raquo; и пришли мне значения, вставлю в globals.css.
      </p>
    </div>
  );
}
