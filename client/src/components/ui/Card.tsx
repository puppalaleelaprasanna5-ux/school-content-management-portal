import type { ReactNode } from "react";
import clsx from "clsx";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({
  children,
  className,
}: CardProps) {
  return (
    <div
      className={clsx(
        "rounded-[32px]",
        "bg-white",
        "border border-slate-200",
        "shadow-[0_20px_60px_rgba(15,23,42,0.08)]",
        "p-10",
        className
      )}
    >
      {children}
    </div>
  );
}