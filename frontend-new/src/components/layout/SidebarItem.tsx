import { NavLink } from "react-router-dom"
import { type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarItemProps {
  icon: LucideIcon
  label: string
  to: string
  /** Collapsed rail mode: hide the label and center the icon. */
  collapsed?: boolean
  /** Called on click — used to close the mobile drawer after navigating. */
  onNavigate?: () => void
}

export function SidebarItem({
  icon: Icon,
  label,
  to,
  collapsed = false,
  onNavigate,
}: SidebarItemProps) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      onClick={onNavigate}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        cn(
          "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-out",
          collapsed && "justify-center px-0",
          isActive
            ? "bg-white/10 text-white"
            : "text-slate-400 hover:translate-x-0.5 hover:bg-white/5 hover:text-white"
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && !collapsed && (
            <span className="absolute top-1/2 left-0 h-5 w-1 -translate-y-1/2 rounded-r-full bg-indigo-400" />
          )}
          <Icon
            className={cn(
              "size-5 shrink-0 transition-colors duration-200",
              isActive ? "text-indigo-300" : "text-slate-400 group-hover:text-white"
            )}
          />
          {!collapsed && <span className="truncate">{label}</span>}
        </>
      )}
    </NavLink>
  )
}
