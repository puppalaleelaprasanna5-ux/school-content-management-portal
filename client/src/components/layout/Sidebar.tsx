import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  GraduationCap,
  Layers,
  FolderOpen,
  FileText,
  LogOut,
  X,
  PanelLeftOpen,
} from "lucide-react";
import clsx from "clsx";

import Logo from "./Logo";
import Button from "../ui/Button";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/dashboard/classes", label: "Classes", icon: GraduationCap },
  { to: "/dashboard/grades", label: "Grades", icon: Layers },
  { to: "/dashboard/folders", label: "Folders", icon: FolderOpen },
  { to: "/dashboard/content", label: "Content", icon: FileText },
];

interface SidebarProps {
  mobileOpen: boolean;
  tabletExpanded: boolean;
  onCloseMobile: () => void;
  onToggleTabletExpand: () => void;
  onLogout: () => void;
}

export default function Sidebar({
  mobileOpen,
  tabletExpanded,
  onCloseMobile,
  onToggleTabletExpand,
  onLogout,
}: SidebarProps) {
  const { user } = useAuth();

  const initials = user?.name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const showLabels =
    tabletExpanded ? true : "max-md:inline md:max-lg:hidden lg:inline";

  const isIconRail = !tabletExpanded;

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-40 bg-slate-900/50 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {tabletExpanded && (
        <button
          type="button"
          aria-label="Close expanded sidebar"
          className="fixed inset-0 z-40 hidden bg-slate-900/40 md:block lg:hidden"
          onClick={onToggleTabletExpand}
        />
      )}

      <aside
        className={clsx(
          "flex h-full flex-col border-r border-slate-200/80 bg-white",
          "max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-50 max-md:w-[280px] max-md:transition-transform max-md:duration-300 max-md:ease-out max-md:shadow-xl",
          mobileOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full",
          "md:sticky md:top-0 md:z-auto md:h-screen md:translate-x-0 md:shadow-none",
          tabletExpanded
            ? "md:fixed md:z-50 md:w-[280px] md:shadow-xl lg:static lg:w-auto lg:shadow-none"
            : "md:w-full"
        )}
      >
        <div className="relative flex h-14 shrink-0 items-center border-b border-slate-100 px-3 lg:px-4 xl:px-5">
          <div
            className={clsx(
              "min-w-0 flex-1",
              isIconRail ? "max-md:block md:max-lg:hidden lg:block" : "block"
            )}
          >
            <Logo />
          </div>

          {isIconRail && (
            <div className="pointer-events-none absolute inset-0 hidden items-center justify-center md:max-lg:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
                <GraduationCap size={18} />
              </div>
            </div>
          )}

          <div className="relative z-10 ml-auto flex items-center">
            <button
              type="button"
              onClick={onCloseMobile}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 md:hidden"
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>

            <button
              type="button"
              onClick={onToggleTabletExpand}
              className="hidden rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 md:max-lg:block"
              aria-label={tabletExpanded ? "Collapse sidebar" : "Expand sidebar"}
            >
              {tabletExpanded ? <X size={18} /> : <PanelLeftOpen size={18} />}
            </button>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 lg:px-4 lg:py-5">
          <p
            className={clsx(
              "mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400",
              isIconRail ? "max-md:block md:max-lg:hidden lg:block" : "block"
            )}
          >
            Menu
          </p>

          <ul className="space-y-1">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  onClick={() => {
                    onCloseMobile();
                    if (tabletExpanded) onToggleTabletExpand();
                  }}
                  title={label}
                  className={({ isActive }) =>
                    clsx(
                      "flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-medium transition-colors",
                      isIconRail && "md:max-lg:justify-center md:max-lg:px-2 lg:px-3 lg:py-2.5",
                      isActive
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    )
                  }
                >
                  <Icon size={18} className="shrink-0" strokeWidth={1.75} />
                  <span className={clsx(typeof showLabels === "string" ? showLabels : "inline")}>
                    {label}
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div
          className={clsx(
            "shrink-0 border-t border-slate-100 p-3 lg:p-4",
            isIconRail && "md:max-lg:px-2"
          )}
        >
          <div
            className={clsx(
              "mb-3 rounded-xl border border-slate-100 bg-slate-50 p-2.5 lg:p-3",
              isIconRail && "md:max-lg:flex md:max-lg:justify-center md:max-lg:p-2"
            )}
          >
            <div
              className={clsx(
                "flex items-center gap-3",
                isIconRail && "md:max-lg:justify-center"
              )}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-xs font-semibold text-indigo-700 lg:h-10 lg:w-10">
                {initials ?? "?"}
              </div>

              <div
                className={clsx(
                  "min-w-0 flex-1",
                  isIconRail ? "max-md:block md:max-lg:hidden lg:block" : "block"
                )}
              >
                <p className="truncate text-sm font-semibold text-slate-900">
                  {user?.name ?? "User"}
                </p>
                <p className="truncate text-xs text-slate-500">
                  {user?.email ?? ""}
                </p>
                <span className="mt-1 inline-block rounded-md bg-indigo-100 px-2 py-0.5 text-xs font-medium capitalize text-indigo-700">
                  {user?.role ?? "member"}
                </span>
              </div>
            </div>
          </div>

          <Button
            type="button"
            onClick={onLogout}
            title="Logout"
            className={clsx(
              "!h-9 gap-2 border border-slate-200 !bg-white !from-white !to-white text-sm font-medium !text-slate-700 shadow-sm hover:!-translate-y-0 hover:bg-slate-50 hover:shadow-sm lg:!h-10",
              isIconRail ? "max-md:!w-full md:max-lg:!w-9 md:max-lg:!px-0 lg:!w-full" : "!w-full"
            )}
          >
            <LogOut size={16} />
            <span
              className={clsx(
                isIconRail ? "max-md:inline md:max-lg:hidden lg:inline" : "inline"
              )}
            >
              Logout
            </span>
          </Button>
        </div>
      </aside>
    </>
  );
}
