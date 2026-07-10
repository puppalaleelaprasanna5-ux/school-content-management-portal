import { useState } from "react"
import { useForm } from "react-hook-form"
import { Monitor } from "lucide-react"

import { SettingsCard, Field } from "@/components/settings/SettingsCard"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { PasswordInput } from "@/components/auth/PasswordInput"
import { cn } from "@/lib/utils"
import { notify } from "@/lib/toast"
import { mockSessions, type SessionInfo } from "@/lib/mock/settings"

interface PasswordFormValues {
  current: string
  next: string
  confirm: string
}

export function SecuritySection() {
  const [twoFactor, setTwoFactor] = useState(false)
  const [sessions, setSessions] = useState<SessionInfo[]>(mockSessions)

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<PasswordFormValues>({
    defaultValues: { current: "", next: "", confirm: "" },
  })

  const onSubmit = handleSubmit(() => {
    reset({ current: "", next: "", confirm: "" })
    notify.success("Password updated")
  })

  const signOut = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id))
    notify.success("Session signed out")
  }

  return (
    <div className="space-y-6">
      {/* Password */}
      <form onSubmit={onSubmit}>
        <SettingsCard
          title="Password"
          description="Update your password. Use at least 8 characters."
          footer={
            <Button
              type="submit"
              className="h-10 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Update password
            </Button>
          }
        >
          <div className="grid gap-5 sm:max-w-md">
            <Field label="Current password" htmlFor="current" error={errors.current?.message}>
              <PasswordInput
                id="current"
                autoComplete="current-password"
                className="h-10 rounded-xl"
                {...register("current", { required: "Current password is required" })}
              />
            </Field>
            <Field label="New password" htmlFor="next" error={errors.next?.message}>
              <PasswordInput
                id="next"
                autoComplete="new-password"
                className="h-10 rounded-xl"
                {...register("next", {
                  required: "New password is required",
                  minLength: { value: 8, message: "Must be at least 8 characters" },
                })}
              />
            </Field>
            <Field label="Confirm new password" htmlFor="confirm" error={errors.confirm?.message}>
              <PasswordInput
                id="confirm"
                autoComplete="new-password"
                className="h-10 rounded-xl"
                {...register("confirm", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === getValues("next") || "Passwords do not match",
                })}
              />
            </Field>
          </div>
        </SettingsCard>
      </form>

      {/* Two-factor */}
      <SettingsCard
        title="Two-factor authentication"
        description="Add an extra layer of security to your account."
      >
        <div className="flex items-center justify-between gap-6">
          <div>
            <p className="text-sm font-medium text-slate-900">
              Authenticator app
            </p>
            <p className="mt-0.5 text-sm text-slate-500">
              Use an authenticator app to generate one-time codes.
            </p>
          </div>
          <Switch
            checked={twoFactor}
            onCheckedChange={(checked) => {
              setTwoFactor(checked)
              notify.success(
                checked ? "Two-factor enabled" : "Two-factor disabled"
              )
            }}
          />
        </div>
      </SettingsCard>

      {/* Sessions */}
      <SettingsCard
        title="Active sessions"
        description="Devices currently signed in to your account."
      >
        <ul className="divide-y divide-slate-100">
          {sessions.map((session) => (
            <li
              key={session.id}
              className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                  <Monitor className="size-5" />
                </span>
                <div>
                  <p className="flex items-center gap-2 text-sm font-medium text-slate-900">
                    {session.device}
                    {session.current && (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                        This device
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {session.location} · {session.lastActive}
                  </p>
                </div>
              </div>
              {!session.current && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-lg"
                  onClick={() => signOut(session.id)}
                >
                  Sign out
                </Button>
              )}
            </li>
          ))}
        </ul>
      </SettingsCard>

      {/* Danger zone */}
      <section
        className={cn(
          "overflow-hidden rounded-2xl border border-rose-200 bg-white shadow-sm"
        )}
      >
        <div className="border-b border-rose-100 px-6 py-5">
          <h3 className="text-base font-semibold text-rose-700">Danger zone</h3>
          <p className="mt-1 text-sm text-slate-500">
            Irreversible and destructive actions.
          </p>
        </div>
        <div className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-900">Delete account</p>
            <p className="mt-0.5 text-sm text-slate-500">
              Permanently remove your account and all associated data.
            </p>
          </div>
          <Button
            type="button"
            onClick={() => notify.error("Account deletion is disabled in the demo")}
            className="h-10 shrink-0 rounded-xl bg-rose-600 text-white hover:bg-rose-700"
          >
            Delete account
          </Button>
        </div>
      </section>
    </div>
  )
}
