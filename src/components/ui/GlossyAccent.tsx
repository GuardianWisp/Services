const VARIANTS = {
  blob: "M100 12c46 0 82 34 88 78 5 34-10 60-38 80 28 8 48 32 48 62 0 40-40 68-90 68s-90-28-90-68c0-30 20-54 48-62-28-20-43-46-38-80C18 46 54 12 100 12Z",
  drop: "M100 10c34 46 66 84 66 122 0 44-30 78-66 78s-66-34-66-78c0-38 32-76 66-122Z",
  twist:
    "M60 30c-24 0-40 18-40 40s18 38 40 38c-22 4-36 22-36 44 0 26 22 46 50 46s50-20 50-46c0-22-14-40-36-44 22 0 40-16 40-38s-16-40-40-40c-6 16-10 30-14 40-4-10-8-24-14-40Z",
} as const;

export function GlossyAccent({
  variant = "blob",
  from,
  to,
  className,
}: {
  variant?: keyof typeof VARIANTS;
  from: string;
  to: string;
  className?: string;
}) {
  const gradientId = `glossy-${variant}-${from.replace("#", "")}`;
  const glowId = `${gradientId}-glow`;

  return (
    <svg
      viewBox="0 0 200 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="30" y1="20" x2="170" y2="200" gradientUnits="userSpaceOnUse">
          <stop stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
        <radialGradient id={glowId} cx="0.32" cy="0.28" r="0.6">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d={VARIANTS[variant]} fill={`url(#${gradientId})`} />
      <ellipse cx="72" cy="70" rx="34" ry="22" fill={`url(#${glowId})`} />
    </svg>
  );
}
