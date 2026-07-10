import { useState } from "react"
import { Sun, Moon, Monitor, Check } from "lucide-react"

import { SettingsCard } from "@/components/settings/SettingsCard"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { notify } from "@/lib/toast"

type ThemeOption = "light" | "dark" | "system"

const themes: { value: ThemeOption; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
]

const accents = [
  { value: "indigo", className: "bg-indigo-600" },
  { value: "violet", className: "bg-violet-600" },
  { value: "blue", className: "bg-blue-600" },
  { value: "emerald", className: "bg-emerald-600" },
  { value: "rose", className: "bg-rose-600" },
]

export function AppearanceSection() {
  const [theme, setTheme] = useState<ThemeOption>("light")
  const [accent, setAccent] = useState("indigo")
  const [compact, setCompact] = useState(false)

  return (
    <SettingsCard
      title="Appearance"
      description="Personalize how the portal looks on your device."
      footer={
        <Button
          type="button"
          onClick={() => notify.success("Appearance updated")}
          className="h-10 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
        >
          Save changes
        </Button>
      }
    >
      <div className="space-y-8">
        {/* Theme */}
        <div>
          <p className="text-sm font-medium text-slate-700">Theme</p>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {themes.map((option) => {
              const active = theme === option.value
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTheme(option.value)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border p-4 text-left transition-all",
                    active
                      ? "border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  )}
                >
                  <span
                    className={cn(
                      "flex size-9 items-center justify-center rounded-lg",
                      active ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"
                    )}
                  >
                    <option.icon className="size-4" />
                  </span>
                  <span className="text-sm font-medium text-slate-900">
                    {option.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Accent color */}
        <div>
          <p className="text-sm font-medium text-slate-700">Accent color</p>
          <div className="mt-3 flex items-center gap-3">
            {accents.map((option) => {
              const active = accent === option.value
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setAccent(option.value)}
                  aria-label={option.value}
                  className={cn(
                    "flex size-9 items-center justify-center rounded-full text-white transition-transform hover:scale-105",
                    option.className,
                    active && "ring-2 ring-slate-900 ring-offset-2"
                  )}
                >
                  {active && <Check className="size-4" />}
                </button>
              )
            })}
          </div>
        </div>

        {/* Compact mode */}
        <div className="flex items-center justify-between gap-6 rounded-xl border border-slate-200 p-4">
          <div>
            <p className="text-sm font-medium text-slate-900">Compact mode</p>
            <p className="mt-0.5 text-sm text-slate-500">
              Reduce spacing to fit more content on screen.
            </p>
          </div>
          <Switch checked={compact} onCheckedChange={setCompact} />
        </div>
      </div>
    </SettingsCard>
  )
}
