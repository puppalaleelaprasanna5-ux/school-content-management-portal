import { Menu, Bell, Search } from "lucide-react";

import { useAuth } from "../../context/AuthContext";

interface TopNavbarProps {
  onOpenMobileSidebar: () => void;
  title?: string;
}

export default function TopNavbar({
  onOpenMobileSidebar,
  title = "Dashboard",
}: TopNavbarProps) {
  const { user } = useAuth();

  const initials = user?.name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 shrink-0 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm">
      <div className="flex h-14 items-center gap-3 px-4 sm:gap-4 sm:px-5 lg:px-6">
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className="rounded-xl p-2 text-slate-600 transition hover:bg-slate-100 md:hidden"
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>

          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold tracking-tight text-slate-900">
              {title}
            </h1>
            <p className="hidden truncate text-xs text-slate-500 sm:block">
              School Content Management Portal
            </p>
          </div>
        </div>

        <div className="hidden min-w-0 flex-1 justify-center px-4 lg:flex">
          <div className="relative w-full max-w-sm xl:max-w-md">
            <Search
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              placeholder="Search content, folders..."
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 transition focus:border-indigo-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
              readOnly
              aria-label="Search"
            />
          </div>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-2.5">
          <button
            type="button"
            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100"
            aria-label="Notifications"
          >
            <Bell size={18} />
          </button>

          <div className="flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white px-2.5 py-1.5 shadow-sm sm:gap-3 sm:px-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-xs font-semibold text-indigo-700">
              {initials ?? "?"}
            </div>
            <div className="hidden min-w-0 sm:block">
              <p className="truncate text-sm font-medium leading-tight text-slate-900">
                {user?.name ?? "User"}
              </p>
              <p className="truncate text-xs capitalize text-slate-500">
                {user?.role?.toLowerCase() ?? "member"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
