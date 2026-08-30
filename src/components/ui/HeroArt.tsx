export function HeroArt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 460"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="blobA" x1="60" y1="40" x2="340" y2="260" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ff8fc0" />
          <stop offset="1" stopColor="#ff2e86" />
        </linearGradient>
        <linearGradient id="blobB" x1="120" y1="220" x2="300" y2="440" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffd166" />
          <stop offset="1" stopColor="#ff8a3d" />
        </linearGradient>
        <radialGradient id="glow" cx="0.35" cy="0.3" r="0.7">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* placeholder hero illustration — swap for the real render/PNG later */}
      <path
        d="M200 30c60 0 110 45 118 104 6 46-14 82-52 108 40 10 70 44 70 90 0 62-56 108-126 108S84 394 84 332c0-46 30-80 70-90-38-26-58-62-52-108C110 75 140 30 200 30Z"
        fill="url(#blobA)"
      />
      <ellipse cx="150" cy="120" rx="70" ry="46" fill="url(#glow)" />

      <path
        d="M200 250c26 0 46 21 46 47s-20 47-46 47-46-21-46-47 20-47 46-47Z"
        fill="url(#blobB)"
      />
      <ellipse cx="182" cy="278" rx="18" ry="12" fill="url(#glow)" />

      <path
        d="M188 340c4 40 4 70-2 96"
        stroke="#ff2e86"
        strokeWidth="18"
        strokeLinecap="round"
      />
    </svg>
  );
}
