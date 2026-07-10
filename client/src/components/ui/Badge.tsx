import type { ReactNode } from "react";
import clsx from "clsx";

export type BadgeTone = "indigo" | "blue" | "emerald" | "amber" | "red" | "slate";
export type BadgeVariant =
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral";
export type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps {
  children: ReactNode;
  /** Semantic variant. Maps to a tone. */
  variant?: BadgeVariant;
  /** Direct color tone (takes precedence over variant). */
  tone?: BadgeTone;
  size?: BadgeSize;
  dot?: boolean;
  className?: string;
}

const variantToTone: Record<BadgeVariant, BadgeTone> = {
  primary: "indigo",
  success: "emerald",
  warning: "amber",
  danger: "red",
  info: "blue",
  neutral: "slate",
};

const tones: Record<BadgeTone, string> = {
  indigo: "bg-indigo-50 text-indigo-700 ring-indigo-100",
  blue: "bg-blue-50 text-blue-700 ring-blue-100",
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  amber: "bg-amber-50 text-amber-700 ring-amber-100",
  red: "bg-red-50 text-red-700 ring-red-100",
  slate: "bg-slate-100 text-slate-600 ring-slate-200",
};

const dotTones: Record<BadgeTone, string> = {
  indigo: "bg-indigo-500",
  blue: "bg-blue-500",
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  red: "bg-red-500",
  slate: "bg-slate-400",
};

const sizes: Record<BadgeSize, string> = {
  sm: "gap-1 px-2 py-0.5 text-[11px]",
  md: "gap-1.5 px-2.5 py-0.5 text-xs",
  lg: "gap-1.5 px-3 py-1 text-sm",
};

const dotSizes: Record<BadgeSize, string> = {
  sm: "h-1 w-1",
  md: "h-1.5 w-1.5",
  lg: "h-2 w-2",
};

export default function Badge({
  children,
  variant,
  tone,
  size = "md",
  dot = false,
  className,
}: BadgeProps) {
  const resolvedTone: BadgeTone = tone ?? (variant ? variantToTone[variant] : "slate");

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full font-medium ring-1 ring-inset",
        tones[resolvedTone],
        sizes[size],
        className
      )}
    >
      {dot && (
        <span className={clsx("rounded-full", dotTones[resolvedTone], dotSizes[size])} />
      )}
      {children}
    </span>
  );
}
