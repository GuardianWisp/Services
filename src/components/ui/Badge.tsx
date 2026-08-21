import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-line bg-card/80 px-4 py-1.5 text-sm text-muted backdrop-blur-sm",
        className,
      )}
    >
      {children}
    </span>
  );
}
