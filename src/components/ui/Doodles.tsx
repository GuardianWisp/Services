export function HeartDoodle({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 54"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M30 50C10 36 2 25 2 15 2 6 9 1 17 3c6 1.5 10 6 13 11 3-5 7-9.5 13-11 8-2 15 3 15 12 0 10-8 21-28 35Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Precomputed (not derived from Math.cos/sin at render time — those can
// differ by a float ULP between server and client and trip up hydration).
const BURST_LINES = [
  { x1: 54, y1: 40, x2: 74, y2: 40 },
  { x1: 51.33, y1: 48.23, x2: 67.51, y2: 59.98 },
  { x1: 44.33, y1: 53.31, x2: 50.51, y2: 72.34 },
  { x1: 35.67, y1: 53.31, x2: 29.49, y2: 72.34 },
  { x1: 28.67, y1: 48.23, x2: 12.49, y2: 59.98 },
  { x1: 26, y1: 40, x2: 6, y2: 40 },
  { x1: 28.67, y1: 31.77, x2: 12.49, y2: 20.02 },
  { x1: 35.67, y1: 26.69, x2: 29.49, y2: 7.66 },
  { x1: 44.33, y1: 26.69, x2: 50.51, y2: 7.66 },
  { x1: 51.33, y1: 31.77, x2: 67.51, y2: 20.02 },
];

export function BurstDoodle({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {BURST_LINES.map((line, i) => (
        <line
          key={i}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

export function SwirlDoodle({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M4 30c8-18 24-26 38-18 11 6.5 12 20 2 26-8 5-17 0-16-9 1-9 13-15 24-13 16 3 26 17 24 33"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
