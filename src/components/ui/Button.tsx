import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-ink text-paper hover:bg-accent hover:text-ink shadow-[0_1px_0_0_rgba(0,0,0,0.05)]",
  secondary:
    "bg-card text-ink border border-line hover:border-ink/30 hover:bg-paper-alt",
  ghost: "text-ink hover:text-accent-ink",
};

export function Button({
  children,
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  return (
    <a
      className={cn(
        "group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium transition-all duration-300 ease-out active:scale-[0.98]",
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}
