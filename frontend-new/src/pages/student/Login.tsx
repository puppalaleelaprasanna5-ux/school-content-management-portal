import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { GraduationCap, TriangleAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/auth/PasswordInput"
import { authApi } from "@/lib/api/services"
import { STUDENT_TOKEN_KEY, getErrorMessage } from "@/lib/api/client"

interface StudentLoginValues {
  email: string
  password: string
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Student Login page.
 *
 * Calls the existing backend (`POST /api/auth/login` via `authApi.login`).
 * Only accounts with `role === "STUDENT"` are allowed through — anyone else
 * is shown a message and is not signed in.
 */
export function StudentLogin() {
  const navigate = useNavigate()
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<StudentLoginValues>({
    mode: "onTouched",
    defaultValues: { email: "", password: "" },
  })

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null)
    try {
      const { token, user } = await authApi.login(values.email, values.password)

      if (user.role !== "STUDENT") {
        setFormError("This application is only for students.")
        return
      }

      // Persist under the student-only slot so it can't collide with an
      // admin session that may also be open in this browser.
      localStorage.setItem(STUDENT_TOKEN_KEY, token)
      navigate("/student/dashboard", { replace: true })
    } catch (err) {
      setFormError(getErrorMessage(err, "Invalid email or password."))
    }
  })

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="mb-8 flex flex-col items-center text-center">
          {/* School logo placeholder */}
          <div className="flex size-16 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 ring-1 ring-white/10">
            <GraduationCap className="size-8" />
          </div>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">
            Student Portal
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Sign in to access your learning content.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
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
                inputMode="email"
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
              <Label htmlFor="password">Password</Label>
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

            {/* Login */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 w-full rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
            >
              {isSubmitting ? "Signing in..." : "Login"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default StudentLogin
