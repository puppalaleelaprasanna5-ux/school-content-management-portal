import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import clsx from "clsx";

interface CardProps {
  children?: ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "bordered";
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;

  // Optional structured slots
  title?: string;
  description?: string;
  icon?: LucideIcon;
  /** Custom header node — overrides title/icon/description when provided. */
  header?: ReactNode;
  /** Right-aligned header content (e.g. a button or badge). */
  actions?: ReactNode;
  footer?: ReactNode;
}

const variants = {
  default: "bg-white ring-1 ring-slate-200/70 shadow-sm shadow-slate-200/40",
  elevated: "bg-white ring-1 ring-slate-200/70 shadow-lg shadow-slate-200/50",
  bordered: "bg-white ring-1 ring-slate-300",
};

const bodyPad = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

const sectionX = {
  none: "px-0",
  sm: "px-4",
  md: "px-6",
  lg: "px-8",
};

export default function Card({
  children,
  className,
  variant = "default",
  padding = "md",
  hover = false,
  title,
  description,
  icon: Icon,
  header,
  actions,
  footer,
}: CardProps) {
  const base = clsx(
    "rounded-2xl transition-all duration-200",
    variants[variant],
    hover && "hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/60",
    className
  );

  const hasHeader = Boolean(header || title || Icon || description || actions);
  const structured = hasHeader || Boolean(footer);

  // Simple mode — backward compatible: padding applies to the whole card.
  if (!structured) {
    return <div className={clsx(base, bodyPad[padding])}>{children}</div>;
  }

  // Structured mode — header / body / footer slots.
  return (
    <div className={clsx(base, "overflow-hidden")}>
      {hasHeader && (
        <div
          className={clsx(
            "flex items-center gap-3 border-b border-slate-100 py-4",
            sectionX[padding]
          )}
        >
          {header ?? (
            <>
              {Icon && (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-sm">
                  <Icon size={18} strokeWidth={2} />
                </div>
              )}
              <div className="min-w-0 flex-1">
                {title && (
                  <h3 className="truncate text-base font-semibold text-slate-900">{title}</h3>
                )}
                {description && (
                  <p className="truncate text-sm text-slate-500">{description}</p>
                )}
              </div>
              {actions && <div className="shrink-0">{actions}</div>}
            </>
          )}
        </div>
      )}

      {children != null && <div className={bodyPad[padding]}>{children}</div>}

      {footer && (
        <div
          className={clsx(
            "flex items-center gap-3 border-t border-slate-100 py-4",
            sectionX[padding]
          )}
        >
          {footer}
        </div>
      )}
    </div>
  );
}
