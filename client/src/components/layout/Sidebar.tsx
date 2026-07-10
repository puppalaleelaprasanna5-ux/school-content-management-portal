import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  GraduationCap,
  Layers,
  FolderOpen,
  FileText,
  Users,
  Settings,
  LogOut,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import clsx from "clsx";

import { useAuth } from "../../context/AuthContext";

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

const navSections: { title: string; items: NavItem[] }[] = [
  {
    title: "Main",
    items: [{ to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true }],
  },
  {
    title: "Academics",
    items: [
      { to: "/dashboard/classes", label: "Classes", icon: GraduationCap },
      { to: "/dashboard/grades", label: "Grades", icon: Layers },
      { to: "/dashboard/students", label: "Students", icon: Users },
    ],
  },
  {
    title: "Content",
    items: [
      { to: "/dashboard/folders", label: "Folders", icon: FolderOpen },
      { to: "/dashboard/content", label: "Content", icon: FileText },
    ],
  },
  {
    title: "System",
    items: [{ to: "/dashboard/settings", label: "Settings", icon: Settings }],
  },
];

interface SidebarProps {
  mobileOpen: boolean;
  collapsed: boolean;
  onCloseMobile: () => void;
  onToggleCollapse: () => void;
  onLogout: () => void;
}

export default function Sidebar({
  mobileOpen,
  collapsed,
  onCloseMobile,
  onToggleCollapse,
  onLogout,
}: SidebarProps) {
  const { user } = useAuth();

  const initials =
    user?.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "?";

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={clsx(
          "flex h-full flex-col border-r border-white/[0.06] bg-[#0F172A] text-slate-300",
          "relative transition-[width] duration-300 ease-in-out",
          // Mobile: fixed drawer (fixed width, slides in/out)
          "max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-50 max-md:w-[260px] max-md:shadow-2xl max-md:shadow-black/40",
          "max-md:transition-transform max-md:duration-300 max-md:ease-out",
          mobileOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full",
          // Desktop / tablet: sticky, full height, fills its grid column
          "md:sticky md:top-0 md:z-auto md:h-screen md:w-full md:translate-x-0"
        )}
      >
        {/* Ambient top glow */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-indigo-500/10 to-transparent" />

        {/* Logo / brand */}
        <div
          className={clsx(
            "relative flex h-16 shrink-0 items-center gap-2",
            collapsed ? "px-4 md:justify-center md:px-2" : "px-5"
          )}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-lg shadow-indigo-900/40">
              <GraduationCap size={22} strokeWidth={2} />
            </div>
            <div className={clsx("min-w-0 leading-tight", collapsed && "md:hidden")}>
              <p className="truncate text-sm font-bold tracking-tight text-white">School CMS</p>
              <p className="truncate text-xs text-slate-400">Content Portal</p>
            </div>
          </div>

          {/* Collapse toggle (tablet/desktop, expanded) */}
          <button
            type="button"
            onClick={onToggleCollapse}
            className={clsx(
              "ml-auto hidden rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-white/10 hover:text-white md:block",
              collapsed && "md:hidden"
            )}
            aria-label="Collapse sidebar"
          >
            <PanelLeftClose size={18} />
          </button>

          {/* Close (mobile) */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="ml-auto rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white md:hidden"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Expand toggle (collapsed) */}
        {collapsed && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="relative mx-auto mb-1 hidden rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-white/10 hover:text-white md:block"
            aria-label="Expand sidebar"
          >
            <PanelLeftOpen size={18} />
          </button>
        )}

        {/* Navigation */}
        <nav
          className={clsx(
            "relative flex-1 space-y-6 overflow-y-auto py-5",
            collapsed ? "px-3 md:px-2.5" : "px-4"
          )}
        >
          {navSections.map((section) => (
            <div key={section.title}>
              <p
                className={clsx(
                  "mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500",
                  collapsed && "md:hidden"
                )}
              >
                {section.title}
              </p>

              <ul className="space-y-1">
                {section.items.map(({ to, label, icon: Icon, end }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      end={end}
                      onClick={onCloseMobile}
                      title={label}
                      className={({ isActive }) =>
                        clsx(
                          "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                          collapsed && "md:justify-center md:px-0",
                          isActive
                            ? "bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-inset ring-white/10"
                            : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <span
                            className={clsx(
                              "absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-white/80 transition-opacity duration-200",
                              isActive && !collapsed ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <Icon
                            size={18}
                            strokeWidth={1.9}
                            className="shrink-0 transition-transform duration-200 group-hover:scale-110"
                          />
                          <span className={clsx("truncate", collapsed && "md:hidden")}>{label}</span>
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Bottom profile card */}
        <div className={clsx("relative shrink-0 p-3", collapsed && "md:px-2.5")}>
          <div
            className={clsx(
              "rounded-2xl bg-white/[0.04] ring-1 ring-white/10 backdrop-blur-sm transition-all duration-200",
              collapsed ? "p-2 md:p-2" : "p-2.5"
            )}
          >
            <div className={clsx("flex items-center gap-3", collapsed && "md:flex-col md:gap-2")}>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-xs font-semibold text-white shadow-md shadow-indigo-900/40">
                {initials}
              </div>

              <div className={clsx("min-w-0 flex-1", collapsed && "md:hidden")}>
                <p className="truncate text-sm font-semibold text-white">{user?.name ?? "User"}</p>
                <p className="truncate text-xs capitalize text-slate-400">
                  {user?.role?.toLowerCase() ?? "member"}
                </p>
              </div>

              <button
                type="button"
                onClick={onLogout}
                title="Logout"
                aria-label="Logout"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-500/15 hover:text-red-400"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
