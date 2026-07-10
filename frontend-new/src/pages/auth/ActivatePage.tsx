import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { ArrowLeft, TriangleAlert } from "lucide-react"

import { AuthLayout } from "@/components/auth/AuthLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/auth/PasswordInput"
import { useAuth } from "@/context/AuthContext"
import { getErrorMessage } from "@/lib/api/client"

interface ActivateFormValues {
  schoolName: string
  adminName: string
  email: string
  password: string
  activationCode: string
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function ActivatePage() {
  const { activate } = useAuth()
  const navigate = useNavigate()
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ActivateFormValues>({
    mode: "onTouched",
    defaultValues: {
      schoolName: "",
      adminName: "",
      email: "",
      password: "",
      activationCode: "",
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null)
    try {
      await activate(values)
      navigate("/", { replace: true })
    } catch (err) {
      setFormError(getErrorMessage(err, "Activation failed."))
    }
  })

  return (
    <AuthLayout>
      <div className="rounded-3xl border border-white/60 bg-white/70 p-8 shadow-xl shadow-slate-950/5 backdrop-blur-xl sm:p-10">
        <div className="mb-8 space-y-1.5">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            Activate your school
          </h2>
          <p className="text-sm text-slate-500">
            Enter your activation code to set up your admin account.
          </p>
        </div>

        <form onSubmit={onSubmit} noValidate className="space-y-4">
          {formError && (
            <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-700">
              <TriangleAlert className="mt-0.5 size-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="activationCode">Activation code</Label>
            <Input
              id="activationCode"
              placeholder="SCHOOL-2026-ABC123"
              aria-invalid={!!errors.activationCode}
              className="h-11 rounded-xl font-mono"
              {...register("activationCode", {
                required: "Activation code is required",
              })}
            />
            {errors.activationCode && (
              <p className="text-xs font-medium text-destructive">
                {errors.activationCode.message}
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="schoolName">School name</Label>
              <Input
                id="schoolName"
                placeholder="ABC School"
                aria-invalid={!!errors.schoolName}
                className="h-11 rounded-xl"
                {...register("schoolName", { required: "School name is required" })}
              />
              {errors.schoolName && (
                <p className="text-xs font-medium text-destructive">
                  {errors.schoolName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminName">Your name</Label>
              <Input
                id="adminName"
                placeholder="Jane Doe"
                aria-invalid={!!errors.adminName}
                className="h-11 rounded-xl"
                {...register("adminName", { required: "Your name is required" })}
              />
              {errors.adminName && (
                <p className="text-xs font-medium text-destructive">
                  {errors.adminName.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="activate-email">Email</Label>
            <Input
              id="activate-email"
              type="email"
              placeholder="you@school.edu"
              aria-invalid={!!errors.email}
              className="h-11 rounded-xl"
              {...register("email", {
                required: "Email is required",
                pattern: { value: EMAIL_PATTERN, message: "Enter a valid email" },
              })}
            />
            {errors.email && (
              <p className="text-xs font-medium text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="activate-password">Password</Label>
            <PasswordInput
              id="activate-password"
              autoComplete="new-password"
              placeholder="Create a password"
              aria-invalid={!!errors.password}
              className="h-11 rounded-xl"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "At least 6 characters" },
              })}
            />
            {errors.password && (
              <p className="text-xs font-medium text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-11 w-full rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
          >
            {isSubmitting ? "Activating..." : "Activate account"}
          </Button>
        </form>

        <Link
          to="/login"
          className="mt-6 flex items-center justify-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
        >
          <ArrowLeft className="size-4" />
          Back to sign in
        </Link>
      </div>
    </AuthLayout>
  )
}

export default ActivatePage
