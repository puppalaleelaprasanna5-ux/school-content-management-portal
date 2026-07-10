import { AuthLayout } from "@/components/auth/AuthLayout"
import { LoginForm } from "@/components/auth/LoginForm"

export function LoginPage() {
  return (
    <AuthLayout>
      {/* Floating glass card */}
      <div className="rounded-3xl border border-white/60 bg-white/70 p-8 shadow-xl shadow-slate-950/5 backdrop-blur-xl sm:p-10">
        <div className="mb-8 space-y-1.5">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            Welcome back
          </h2>
          <p className="text-sm text-slate-500">
            Sign in to your School CMS account to continue.
          </p>
        </div>
        <LoginForm />
      </div>
    </AuthLayout>
  )
}

export default LoginPage
