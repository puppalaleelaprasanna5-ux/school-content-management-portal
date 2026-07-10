import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

import { AuthLayout } from "@/components/auth/AuthLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ForgotPasswordValues {
  email: string
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    mode: "onTouched",
    defaultValues: { email: "" },
  })

  // UI only — no backend.
  const onSubmit = handleSubmit((values) => {
    void values
  })

  return (
    <AuthLayout>
      <div className="rounded-3xl border border-white/60 bg-white/70 p-8 shadow-xl shadow-slate-950/5 backdrop-blur-xl sm:p-10">
        <div className="mb-8 space-y-1.5">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            Reset your password
          </h2>
          <p className="text-sm text-slate-500">
            Enter the email linked to your account and we&apos;ll send you a
            reset link.
          </p>
        </div>

        <form onSubmit={onSubmit} noValidate className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="reset-email">Email</Label>
            <Input
              id="reset-email"
              type="email"
              autoComplete="email"
              placeholder="you@school.edu"
              aria-invalid={!!errors.email}
              className="h-11 rounded-xl"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: EMAIL_PATTERN,
                  message: "Enter a valid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-xs font-medium text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-11 w-full rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Send reset link
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

export default ForgotPassword
