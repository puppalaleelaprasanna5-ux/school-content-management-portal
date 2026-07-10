import { Link, useNavigate } from "react-router-dom"
import { ChevronsLeft, Settings, LogOut } from "lucide-react"

import { Logo } from "@/components/common/Logo"
import { SidebarItem } from "@/components/layout/SidebarItem"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { navigation } from "@/lib/navigation"
import { useAuth } from "@/context/AuthContext"
import { cn } from "@/lib/utils"

interface SidebarProps {
  collapsed?: boolean
  /** Toggle the collapsed rail. When omitted the toggle button is hidden. */
  onToggle?: () => void
  /** Show/hide the collapse toggle (hidden inside the mobile drawer). */
  showToggle?: boolean
  /** Forwarded to each item — closes the mobile drawer on navigation. */
  onNavigate?: () => void
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export function Sidebar({
  collapsed = false,
  onToggle,
  showToggle = true,
  onNavigate,
}: SidebarProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const name = user?.name ?? "Account"
  const email = user?.email ?? ""

  const handleLogout = () => {
    logout()
    onNavigate?.()
    navigate("/login", { replace: true })
  }

  return (
    <div className="flex h-full flex-col bg-slate-950 text-slate-100">
      {/* Brand */}
      <div
        className={cn(
          "flex h-[68px] shrink-0 items-center border-b border-slate-800/70 px-5",
          collapsed && "justify-center px-0"
        )}
      >
        <Logo collapsed={collapsed} />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-7 overflow-y-auto px-3 py-6">
        {navigation.map((section, index) => (
          <div key={section.title ?? index} className="space-y-1.5">
            {section.title && !collapsed && (
              <p className="px-3 pb-1 text-[11px] font-semibold tracking-[0.12em] text-slate-500 uppercase">
                {section.title}
              </p>
            )}
            {section.items.map((item) => (
              <SidebarItem
                key={item.to}
                {...item}
                collapsed={collapsed}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      {showToggle && onToggle && (
        <div className="shrink-0 px-3 pb-1">
          <button
            type="button"
            onClick={onToggle}
            title={collapsed ? "Expand" : "Collapse"}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-400 transition-all duration-200 outline-none hover:bg-white/5 hover:text-white focus-visible:ring-2 focus-visible:ring-indigo-500/40",
              collapsed && "justify-center px-0"
            )}
          >
            <ChevronsLeft
              className={cn(
                "size-5 shrink-0 transition-transform duration-300",
                collapsed && "rotate-180"
              )}
            />
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      )}

      {/* Sticky profile section — pinned to the bottom */}
      <div className="shrink-0 border-t border-slate-800/70 p-3">
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <Link to="/settings" onClick={onNavigate} title={name}>
              <Avatar size="sm">
                <AvatarFallback className="bg-indigo-500/20 text-xs font-semibold text-indigo-200">
                  {getInitials(name)}
                </AvatarFallback>
              </Avatar>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              title="Log out"
              className="inline-flex size-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-rose-500/10 hover:text-rose-300"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        ) : (
          <div className="rounded-2xl bg-white/5 p-2.5">
            <div className="flex items-center gap-3 px-1">
              <Avatar>
                <AvatarFallback className="bg-indigo-500/20 text-sm font-semibold text-indigo-200">
                  {getInitials(name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">{name}</p>
                {email && (
                  <p className="truncate text-xs text-slate-400">{email}</p>
                )}
              </div>
            </div>

            <div className="mt-2.5 grid grid-cols-2 gap-2">
              <Link
                to="/settings"
                onClick={onNavigate}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-white/5 px-3 py-2 text-xs font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
              >
                <Settings className="size-4" />
                Settings
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-white/5 px-3 py-2 text-xs font-medium text-slate-300 transition-colors hover:bg-rose-500/10 hover:text-rose-300"
              >
                <LogOut className="size-4" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
