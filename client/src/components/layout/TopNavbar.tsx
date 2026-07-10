import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, ChevronRight, LogOut, Settings, ChevronDown } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import NotificationBell from "./NotificationBell";
import GlobalSearch from "./GlobalSearch";

interface TopNavbarProps {
  onOpenMobileSidebar: () => void;
  onLogout: () => void;
  title?: string;
}

export default function TopNavbar({
  onOpenMobileSidebar,
  onLogout,
  title = "Dashboard",
}: TopNavbarProps) {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const initials =
    user?.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "?";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isDashboardRoot = title === "Dashboard";

  return (
    <header className="sticky top-0 z-30 shrink-0 border-b border-slate-200/70 bg-white/80 shadow-sm shadow-slate-200/40 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70">
      <div className="flex h-16 items-center gap-3 px-4 sm:gap-5 sm:px-6 lg:px-8">
        {/* Left — mobile toggle + breadcrumb / page title */}
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className="rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 md:hidden"
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>

          <div className="min-w-0">
            <nav
              aria-label="Breadcrumb"
              className="hidden items-center gap-1.5 text-xs font-medium text-slate-400 sm:flex"
            >
              <Link to="/dashboard" className="transition-colors hover:text-slate-600">
                Dashboard
              </Link>
              {!isDashboardRoot && (
                <>
                  <ChevronRight size={12} className="text-slate-300" />
                  <span className="text-slate-600">{title}</span>
                </>
              )}
            </nav>
            <h1 className="truncate text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
              {title}
            </h1>
          </div>
        </div>

        {/* Center — search */}
        <div className="hidden flex-1 justify-center px-4 lg:flex">
          <div className="w-full max-w-[440px]">
            <GlobalSearch />
          </div>
        </div>

        {/* Right — notifications + avatar / profile dropdown */}
        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
          <NotificationBell />

          <div className="mx-1 hidden h-6 w-px bg-slate-200 sm:block" />

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 rounded-2xl p-1 pr-1.5 transition-colors hover:bg-slate-100 sm:pr-2.5"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-label="Open profile menu"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-xs font-semibold text-white shadow-sm shadow-indigo-600/20">
                {initials}
              </div>
              <div className="hidden min-w-0 text-left sm:block">
                <p className="truncate text-sm font-semibold leading-tight text-slate-900">
                  {user?.name ?? "User"}
                </p>
                <p className="truncate text-xs capitalize leading-tight text-slate-500">
                  {user?.role?.toLowerCase() ?? "member"}
                </p>
              </div>
              <ChevronDown
                size={16}
                className={`hidden text-slate-400 transition-transform duration-200 sm:block ${
                  menuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full z-50 mt-2 w-60 origin-top-right overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-xl shadow-slate-300/40 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="border-b border-slate-100 px-4 py-3">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {user?.name ?? "User"}
                  </p>
                  <p className="truncate text-xs text-slate-500">{user?.email ?? ""}</p>
                </div>
                <div className="p-1.5">
                  <Link
                    to="/dashboard/settings"
                    onClick={() => setMenuOpen(false)}
                    role="menuitem"
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                  >
                    <Settings size={16} />
                    Settings
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onLogout();
                    }}
                    role="menuitem"
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
