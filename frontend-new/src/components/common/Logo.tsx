import { GraduationCap } from "lucide-react"
import { cn } from "@/lib/utils"

interface LogoProps {
  /** When true, only the icon mark is shown (for the collapsed sidebar). */
  collapsed?: boolean
  className?: string
}

export function Logo({ collapsed = false, className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 ring-1 ring-white/10">
        <GraduationCap className="size-[22px]" />
      </div>
      {!collapsed && (
        <div className="flex flex-col leading-tight">
          <span className="text-[15px] font-semibold tracking-tight text-white">
            School CMS
          </span>
          <span className="text-xs font-medium text-slate-400">Content Portal</span>
        </div>
      )}
    </div>
  )
}
