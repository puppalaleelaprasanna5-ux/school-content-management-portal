import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { KeyRound, TriangleAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/auth/PasswordInput"
import { RememberMe } from "@/components/auth/RememberMe"
import { useAuth } from "@/context/AuthContext"
import { getErrorMessage } from "@/lib/api/client"

interface LoginFormValues {
  email: string
  password: string
  remember: boolean
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function LoginForm() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    mode: "onTouched",
    defaultValues: { email: "", password: "", remember: false },
  })

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null)
    try {
      await login(values.email, values.password)
      const from = (location.state as { from?: string } | null)?.from ?? "/"
      navigate(from, { replace: true })
    } catch (err) {
      setFormError(getErrorMessage(err, "Invalid email or password."))
    }
  })

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {formError && (
        <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-700">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
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

      {/* Password */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link
            to="/forgot-password"
            className="text-xs font-medium text-indigo-600 transition-colors hover:text-indigo-700"
          >
            Forgot password?
          </Link>
        </div>
        <PasswordInput
          id="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          aria-invalid={!!errors.password}
          className="h-11 rounded-xl"
          {...register("password", {
            required: "Password is required",
          })}
        />
        {errors.password && (
          <p className="text-xs font-medium text-destructive">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Remember me */}
      <div className="flex items-center justify-between">
        <Controller
          control={control}
          name="remember"
          render={({ field }) => (
            <RememberMe
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-11 w-full rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </Button>

      {/* Activation code */}
      <p className="flex items-center justify-center gap-1.5 text-sm text-slate-500">
        <KeyRound className="size-4" />
        Have an activation code?
        <Link
          to="/activate"
          className="font-medium text-indigo-600 transition-colors hover:text-indigo-700"
        >
          Activate account
        </Link>
      </p>

      {/* Student portal */}
      <p className="border-t border-slate-100 pt-4 text-center text-sm text-slate-500">
        Are you a student?{" "}
        <Link
          to="/student/login"
          className="font-medium text-indigo-600 transition-colors hover:text-indigo-700"
        >
          Student Login
        </Link>
      </p>
    </form>
  )
}
