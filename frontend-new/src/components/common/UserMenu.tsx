import { useNavigate } from "react-router-dom"
import {
  LogOut,
  User as UserIcon,
  Building2,
  Palette,
  Bell,
  LifeBuoy,
  ChevronDown,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { notify } from "@/lib/toast"

interface UserMenuProps {
  name: string
  email?: string
  avatarUrl?: string
  onLogout?: () => void
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

export function UserMenu({ name, email, avatarUrl, onLogout }: UserMenuProps) {
  const navigate = useNavigate()

  const itemClass = "gap-2.5 rounded-lg px-2 py-2"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="group flex items-center gap-2.5 rounded-xl p-1 pr-2.5 transition-colors outline-none hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-indigo-600/40 aria-expanded:bg-slate-100">
        <Avatar className="ring-2 ring-white shadow-sm">
          {avatarUrl && <AvatarImage src={avatarUrl} alt={name} />}
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
        className="w-64 rounded-2xl p-1.5 shadow-lg shadow-slate-900/5"
      >
        {/* Identity */}
        <DropdownMenuLabel className="flex items-center gap-3 px-2 py-2.5">
          <Avatar className="ring-2 ring-white">
            {avatarUrl && <AvatarImage src={avatarUrl} alt={name} />}
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

        <DropdownMenuItem className={itemClass} onClick={() => navigate("/profile")}>
          <UserIcon />
          My Profile
        </DropdownMenuItem>
        <DropdownMenuItem className={itemClass} onClick={() => navigate("/settings")}>
          <Building2 />
          School Settings
        </DropdownMenuItem>
        <DropdownMenuItem className={itemClass} onClick={() => navigate("/settings")}>
          <Palette />
          Appearance
        </DropdownMenuItem>
        <DropdownMenuItem className={itemClass} onClick={() => navigate("/settings")}>
          <Bell />
          Notifications
        </DropdownMenuItem>
        <DropdownMenuItem
          className={itemClass}
          onClick={() =>
            notify.info(
              "Help & Support",
              "Email support@schoolcms.app and we'll get back to you."
            )
          }
        >
          <LifeBuoy />
          Help &amp; Support
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          className={itemClass}
          onClick={onLogout}
        >
          <LogOut />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
