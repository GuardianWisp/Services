import type { SVGProps } from "react";

export function TelegramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M21.05 3.64 2.87 10.7c-1.24.5-1.23 1.2-.23 1.5l4.66 1.46 1.8 5.53c.22.6.38.83.78.83.4 0 .58-.18.8-.4.13-.13 1.02-1 2.03-1.98l4.22 3.12c.78.43 1.34.2 1.53-.72l2.77-13.08c.28-1.15-.44-1.67-1.18-1.34Zm-11.9 9.6 8.32-5.24c.4-.25.77-.11.47.16l-6.98 6.3-.28 3.06-1.53-4.28Z" />
    </svg>
  );
}
