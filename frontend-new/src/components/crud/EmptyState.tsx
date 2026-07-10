import { type ComponentType, type ReactNode } from "react"
import { Inbox } from "lucide-react"

import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon?: ComponentType<{ className?: string }>
  title?: string
  description?: string
  /** Optional call-to-action, e.g. an Add button. */
  action?: ReactNode
  className?: string
}

export function EmptyState({
  icon: Icon = Inbox,
  title = "Nothing here yet",
  description = "There are no records to display.",
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 px-6 py-16 text-center",
        className
      )}
    >
      <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100 text-slate-400 ring-1 ring-slate-200/70">
        <Icon className="size-7" />
      </div>
      <div className="space-y-1.5">
        <p className="text-[15px] font-semibold text-slate-900">{title}</p>
        <p className="mx-auto max-w-xs text-sm leading-relaxed text-slate-500">
          {description}
        </p>
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  )
}
