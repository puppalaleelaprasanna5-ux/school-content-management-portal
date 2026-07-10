import { type ReactNode } from "react"

import { cn } from "@/lib/utils"

interface ToolbarProps {
  /** Left cluster — typically SearchBar + Filters. */
  children: ReactNode
  /** Right cluster — typically the primary Add button. */
  actions?: ReactNode
  className?: string
}

export function Toolbar({ children, actions, className }: ToolbarProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between",
        className
      )}
    >
      <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
        {children}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}
