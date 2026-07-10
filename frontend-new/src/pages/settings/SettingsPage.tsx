import { useState, type ComponentType, type ReactNode } from "react"
import {
  User,
  Building2,
  ShieldCheck,
  Palette,
  Bell,
  KeyRound,
} from "lucide-react"

import { PageHeader } from "@/components/crud"
import { ProfileSection } from "@/components/settings/ProfileSection"
import { SchoolSection } from "@/components/settings/SchoolSection"
import { SecuritySection } from "@/components/settings/SecuritySection"
import { AppearanceSection } from "@/components/settings/AppearanceSection"
import { NotificationsSection } from "@/components/settings/NotificationsSection"
import { ActivationCodesSection } from "@/components/settings/ActivationCodesSection"
import { cn } from "@/lib/utils"

interface SettingsSection {
  key: string
  label: string
  description: string
  icon: ComponentType<{ className?: string }>
  render: () => ReactNode
}

const sections: SettingsSection[] = [
  {
    key: "profile",
    label: "Profile",
    description: "Your personal information",
    icon: User,
    render: () => <ProfileSection />,
  },
  {
    key: "school",
    label: "School Details",
    description: "Institution information",
    icon: Building2,
    render: () => <SchoolSection />,
  },
  {
    key: "security",
    label: "Security",
    description: "Password & sessions",
    icon: ShieldCheck,
    render: () => <SecuritySection />,
  },
  {
    key: "appearance",
    label: "Appearance",
    description: "Theme & personalization",
    icon: Palette,
    render: () => <AppearanceSection />,
  },
  {
    key: "notifications",
    label: "Notifications",
    description: "Email preferences",
    icon: Bell,
    render: () => <NotificationsSection />,
  },
  {
    key: "activation",
    label: "Activation Codes",
    description: "Onboarding codes",
    icon: KeyRound,
    render: () => <ActivationCodesSection />,
  },
]

export function SettingsPage() {
  const [active, setActive] = useState(sections[0].key)
  const current = sections.find((s) => s.key === active) ?? sections[0]

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 sm:px-6 lg:px-8">
      <PageHeader
        title="Settings"
        description="Manage your profile, school and workspace preferences."
      />

      <div className="grid gap-6 lg:grid-cols-[248px_minmax(0,1fr)]">
        {/* Section navigation */}
        <nav
          aria-label="Settings sections"
          className="flex gap-2 overflow-x-auto pb-1 lg:sticky lg:top-6 lg:flex-col lg:gap-1.5 lg:self-start lg:overflow-visible lg:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {sections.map((section) => {
            const isActive = section.key === active
            return (
              <button
                key={section.key}
                type="button"
                onClick={() => setActive(section.key)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-indigo-600/40 lg:w-full",
                  isActive
                    ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/80"
                    : "text-slate-600 hover:bg-white/70 hover:text-slate-900"
                )}
              >
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors",
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 text-slate-500 group-hover:bg-slate-200/70"
                  )}
                >
                  <section.icon className="size-[18px]" />
                </span>
                <span className="hidden min-w-0 lg:block">
                  <span className="block truncate text-sm font-medium">
                    {section.label}
                  </span>
                  <span className="block truncate text-xs text-slate-400">
                    {section.description}
                  </span>
                </span>
                <span className="text-sm font-medium whitespace-nowrap lg:hidden">
                  {section.label}
                </span>
              </button>
            )
          })}
        </nav>

        {/* Active section */}
        <div className="min-w-0">{current.render()}</div>
      </div>
    </div>
  )
}

export default SettingsPage
