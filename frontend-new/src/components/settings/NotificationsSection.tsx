import { useState } from "react"

import { SettingsCard } from "@/components/settings/SettingsCard"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { notify } from "@/lib/toast"
import { mockNotificationPrefs } from "@/lib/mock/settings"

export function NotificationsSection() {
  const [prefs, setPrefs] = useState(mockNotificationPrefs)

  const toggle = (key: string, enabled: boolean) => {
    setPrefs((prev) =>
      prev.map((p) => (p.key === key ? { ...p, enabled } : p))
    )
  }

  return (
    <SettingsCard
      title="Notifications"
      description="Choose what updates you want to receive by email."
      footer={
        <Button
          type="button"
          onClick={() => notify.success("Notification preferences saved")}
          className="h-10 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
        >
          Save preferences
        </Button>
      }
    >
      <ul className="divide-y divide-slate-100">
        {prefs.map((pref) => (
          <li
            key={pref.key}
            className="flex items-center justify-between gap-6 py-4 first:pt-0 last:pb-0"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-900">{pref.title}</p>
              <p className="mt-0.5 text-sm text-slate-500">{pref.description}</p>
            </div>
            <Switch
              checked={pref.enabled}
              onCheckedChange={(checked) => toggle(pref.key, checked)}
            />
          </li>
        ))}
      </ul>
    </SettingsCard>
  )
}
