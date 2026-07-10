import { useForm } from "react-hook-form"

import { SettingsCard, Field } from "@/components/settings/SettingsCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { notify } from "@/lib/toast"
import { mockSchool, type SchoolData } from "@/lib/mock/settings"

export function SchoolSection() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<SchoolData>({ defaultValues: mockSchool })

  const onSubmit = handleSubmit((values) => {
    reset(values)
    notify.success("School information updated")
  })

  return (
    <form onSubmit={onSubmit}>
      <SettingsCard
        title="School details"
        description="Details about your institution shown across the portal."
        footer={
          <Button
            type="submit"
            className="h-10 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
            disabled={!isDirty}
          >
            Save changes
          </Button>
        }
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="School name"
            htmlFor="name"
            error={errors.name?.message}
            className="sm:col-span-2"
          >
            <Input
              id="name"
              className="h-10 rounded-xl"
              {...register("name", { required: "School name is required" })}
            />
          </Field>
          <Field label="School code" htmlFor="code" hint="Used for activation codes.">
            <Input id="code" className="h-10 rounded-xl" {...register("code")} />
          </Field>
          <Field label="Timezone" htmlFor="timezone">
            <Input id="timezone" className="h-10 rounded-xl" {...register("timezone")} />
          </Field>
          <Field label="Contact email" htmlFor="school-email">
            <Input
              id="school-email"
              type="email"
              className="h-10 rounded-xl"
              {...register("email")}
            />
          </Field>
          <Field label="Phone" htmlFor="school-phone">
            <Input id="school-phone" className="h-10 rounded-xl" {...register("phone")} />
          </Field>
          <Field label="Website" htmlFor="website" className="sm:col-span-2">
            <Input id="website" className="h-10 rounded-xl" {...register("website")} />
          </Field>
          <Field label="Address" htmlFor="address" className="sm:col-span-2">
            <Input id="address" className="h-10 rounded-xl" {...register("address")} />
          </Field>
        </div>
      </SettingsCard>
    </form>
  )
}
