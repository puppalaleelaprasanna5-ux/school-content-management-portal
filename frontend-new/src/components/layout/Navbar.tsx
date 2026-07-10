import { useNavigate } from "react-router-dom"
import {
  Bell,
  Menu,
  User as UserIcon,
  Settings,
  LifeBuoy,
  LogOut,
  ChevronDown,
} from "lucide-react"
import { SearchBox } from "@/components/common/SearchBox"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/context/AuthContext"
import { notify } from "@/lib/toast"

interface NavbarProps {
  /** Opens the mobile sidebar drawer (only visible below `lg`). */
  onMenuClick?: () => void
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

export function Navbar({ onMenuClick }: NavbarProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const name = user?.name ?? "Account"
  const email = user?.email

  const handleLogout = () => {
    logout()
    navigate("/login", { replace: true })
  }

  const menuItemClass = "gap-2.5 rounded-lg px-2 py-2"

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-slate-200/80 bg-white/80 px-4 shadow-sm shadow-slate-900/[0.03] backdrop-blur-md lg:gap-4 lg:px-6">
      {/* Mobile drawer toggle */}
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open navigation"
        className="inline-flex size-10 items-center justify-center rounded-xl text-slate-600 transition-colors outline-none hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-indigo-600/40 lg:hidden"
      >
        <Menu className="size-5" />
      </button>

      {/* Search */}
      <div className="flex flex-1 items-center">
        <SearchBox
          className="max-w-2xl"
          placeholder="Search folders, content, subjects..."
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Notifications"
            className="relative inline-flex size-10 items-center justify-center rounded-xl text-slate-500 transition-colors outline-none hover:bg-slate-100 hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-indigo-600/40 aria-expanded:bg-slate-100 aria-expanded:text-slate-700"
          >
            <Bell className="size-[19px]" />
            <span className="absolute top-2.5 right-2.5 size-2.5 rounded-full bg-indigo-500 ring-2 ring-white" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={10}
            className="w-80 overflow-hidden rounded-2xl p-0 shadow-lg shadow-slate-900/5"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <p className="text-sm font-semibold text-slate-900">Notifications</p>
              <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600">
                New
              </span>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 px-4 py-10 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-slate-100">
                <Bell className="size-5 text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-900">
                You&apos;re all caught up
              </p>
              <p className="text-xs text-slate-500">
                No new notifications right now.
              </p>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="mx-1.5 hidden h-7 w-px bg-slate-200 sm:block" />

        {/* User / profile menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="group flex items-center gap-2.5 rounded-xl p-1 pr-2.5 transition-colors outline-none hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-indigo-600/40 aria-expanded:bg-slate-100">
            <Avatar className="ring-2 ring-white shadow-sm">
              <AvatarFallback className="bg-indigo-100 text-xs font-semibold text-indigo-700">
                {getInitials(name)}
              </AvatarFallback>
            </Avatar>
            <span className="hidden text-left sm:block">
              <span className="block text-sm leading-tight font-semibold text-slate-900">
                {name}
              </span>
              {email && (
                <span className="block max-w-[160px] truncate text-xs leading-tight text-slate-500">
                  {email}
                </span>
              )}
            </span>
            <ChevronDown className="hidden size-4 text-slate-400 transition-transform duration-200 group-aria-expanded:rotate-180 sm:block" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            sideOffset={10}
            className="w-60 rounded-2xl p-1.5 shadow-lg shadow-slate-900/5"
          >
            <DropdownMenuLabel className="flex items-center gap-3 px-2 py-2.5">
              <Avatar className="ring-2 ring-white">
                <AvatarFallback className="bg-indigo-100 text-xs font-semibold text-indigo-700">
                  {getInitials(name)}
                </AvatarFallback>
              </Avatar>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-slate-900">
                  {name}
                </span>
                {email && (
                  <span className="block truncate text-xs font-normal text-slate-500">
                    {email}
                  </span>
                )}
              </span>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className={menuItemClass}
              onClick={() => navigate("/profile")}
            >
              <UserIcon />
              My Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              className={menuItemClass}
              onClick={() => navigate("/settings")}
            >
              <Settings />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              className={menuItemClass}
              onClick={() => navigate("/settings")}
            >
              <Bell />
              Notifications
            </DropdownMenuItem>
            <DropdownMenuItem
              className={menuItemClass}
              onClick={() =>
                notify.info(
                  "Help & Support",
                  "Email support@schoolcms.app and we'll get back to you."
                )
              }
            >
              <LifeBuoy />
              Help
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              variant="destructive"
              className={menuItemClass}
              onClick={handleLogout}
            >
              <LogOut />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
