import { useForm } from "react-hook-form"

import { SettingsCard, Field } from "@/components/settings/SettingsCard"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { notify } from "@/lib/toast"
import { mockProfile, type ProfileData } from "@/lib/mock/settings"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function ProfileSection() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileData>({ defaultValues: mockProfile })

  const onSubmit = handleSubmit((values) => {
    reset(values)
    notify.success("Profile updated", "Your changes have been saved.")
  })

  return (
    <form onSubmit={onSubmit}>
      <SettingsCard
        title="Profile"
        description="Manage your personal information and how others see you."
        footer={
          <>
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-xl"
              onClick={() => reset(mockProfile)}
              disabled={!isDirty}
            >
              Reset
            </Button>
            <Button
              type="submit"
              className="h-10 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
              disabled={!isDirty}
            >
              Save changes
            </Button>
          </>
        }
      >
        <div className="space-y-6">
          {/* Avatar row */}
          <div className="flex items-center gap-4">
            <Avatar size="lg">
              <AvatarFallback className="bg-indigo-50 text-sm font-semibold text-indigo-600">
                PL
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" size="sm" className="rounded-lg">
                Change photo
              </Button>
              <Button type="button" variant="ghost" size="sm" className="rounded-lg text-slate-500">
                Remove
              </Button>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="First name" htmlFor="firstName" error={errors.firstName?.message}>
              <Input
                id="firstName"
                className="h-10 rounded-xl"
                {...register("firstName", { required: "First name is required" })}
              />
            </Field>
            <Field label="Last name" htmlFor="lastName" error={errors.lastName?.message}>
              <Input
                id="lastName"
                className="h-10 rounded-xl"
                {...register("lastName", { required: "Last name is required" })}
              />
            </Field>
            <Field label="Email" htmlFor="email" error={errors.email?.message}>
              <Input
                id="email"
                type="email"
                className="h-10 rounded-xl"
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: EMAIL_PATTERN, message: "Enter a valid email" },
                })}
              />
            </Field>
            <Field label="Phone" htmlFor="phone">
              <Input id="phone" className="h-10 rounded-xl" {...register("phone")} />
            </Field>
            <Field label="Role" htmlFor="role" hint="Contact an owner to change your role." className="sm:col-span-2">
              <Input id="role" disabled className="h-10 rounded-xl" {...register("role")} />
            </Field>
            <Field label="Bio" htmlFor="bio" className="sm:col-span-2">
              <textarea
                id="bio"
                rows={3}
                className="w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                {...register("bio")}
              />
            </Field>
          </div>
        </div>
      </SettingsCard>
    </form>
  )
}
