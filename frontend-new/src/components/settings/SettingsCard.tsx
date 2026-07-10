import { type ReactNode } from "react"

import { cn } from "@/lib/utils"

interface SettingsCardProps {
  title: string
  description?: string
  children: ReactNode
  /** Optional footer, typically a right-aligned Save button. */
  footer?: ReactNode
  className?: string
}

/**
 * Reusable settings card: header (title + description), body and an
 * optional muted footer bar. Shared by every settings section.
 */
export function SettingsCard({
  title,
  description,
  children,
  footer,
  className,
}: SettingsCardProps) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm",
        className
      )}
    >
      <header className="border-b border-slate-100 px-6 py-5">
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        )}
      </header>
      <div className="px-6 py-6">{children}</div>
      {footer && (
        <footer className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4">
          {footer}
        </footer>
      )}
    </section>
  )
}

/** Two-column responsive field wrapper used inside settings forms. */
export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
  className,
}: {
  label: string
  htmlFor?: string
  hint?: string
  error?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className="text-sm font-medium text-slate-700"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-xs font-medium text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-xs text-slate-400">{hint}</p>
      ) : null}
    </div>
  )
}
