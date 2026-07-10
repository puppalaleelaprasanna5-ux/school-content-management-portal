import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  GraduationCap,
  ShieldCheck,
  BookOpen,
  Users,
  Eye,
  EyeOff,
  KeyRound,
  ArrowRight,
} from "lucide-react";

import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";

const features = [
  {
    icon: ShieldCheck,
    label: "Secure authentication",
    desc: "Enterprise-grade access control",
  },
  {
    icon: BookOpen,
    label: "Centralized content",
    desc: "All learning material in one place",
  },
  {
    icon: Users,
    label: "Role-based access",
    desc: "Admins, staff and students",
  },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("admin@school.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  // NOTE: auth logic unchanged — this simply calls the existing useAuth().login.
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      await login(email, password);

      if (remember) {
        localStorage.setItem("rememberEmail", email);
      } else {
        localStorage.removeItem("rememberEmail");
      }

      toast.success("Login Successful");

      navigate("/dashboard");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error?.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* LEFT — gradient / brand / features / illustration */}
        <div className="animate-gradient-pan relative hidden overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-700 p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16">
          {/* Abstract illustration: floating orbs + grid */}
          <div className="animate-float-slow absolute -right-24 top-10 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <div className="animate-float-slow absolute -left-16 bottom-0 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl [animation-delay:2s]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_45%)]" />
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
              backgroundSize: "56px 56px",
            }}
          />

          {/* Brand */}
          <div className="relative flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20 backdrop-blur-md">
              <GraduationCap size={24} />
            </div>
            <span className="text-lg font-bold tracking-tight">School CMS</span>
          </div>

          {/* Headline + features */}
          <div className="relative max-w-md">
            <h1 className="text-4xl font-bold leading-[1.15] tracking-tight xl:text-5xl">
              The modern portal for school content.
            </h1>
            <p className="mt-5 text-base leading-relaxed text-indigo-100">
              Securely manage classes, grades, folders and learning material for
              administrators, teachers and students — all from one place.
            </p>

            <div className="mt-10 space-y-4">
              {features.map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15 backdrop-blur-sm">
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{label}</p>
                    <p className="text-sm text-indigo-200">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="relative text-sm text-indigo-200">
            © {new Date().getFullYear()} School CMS. All rights reserved.
          </p>
        </div>

        {/* RIGHT — glass login card */}
        <div className="relative flex items-center justify-center overflow-hidden px-6 py-12 sm:px-12">
          {/* Soft ambient blobs so the glass card reads on light backgrounds */}
          <div className="pointer-events-none absolute -right-10 top-10 h-64 w-64 rounded-full bg-indigo-200/40 blur-3xl" />
          <div className="pointer-events-none absolute -left-10 bottom-10 h-64 w-64 rounded-full bg-blue-200/40 blur-3xl" />

          <div className="animate-fade-up relative w-full max-w-md">
            <div className="rounded-3xl border border-white/60 bg-white/70 p-8 shadow-2xl shadow-slate-300/40 backdrop-blur-xl sm:p-10">
              {/* Brand mark */}
              <div className="mb-8 flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-lg shadow-indigo-500/30">
                  <GraduationCap size={28} />
                </div>
                <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-900">
                  Welcome back
                </h2>
                <p className="mt-1.5 text-sm text-slate-500">
                  Sign in to continue to your dashboard
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Email address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@school.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>

                {/* Password */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-slate-700"
                    >
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        toast("Contact your administrator to reset your password.", {
                          icon: "🔑",
                        })
                      }
                      className="text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-700"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      className="pr-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-indigo-600"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Remember me */}
                <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-slate-600">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0"
                  />
                  Remember me
                </label>

                <Button loading={loading} type="submit" size="lg" className="w-full">
                  Sign in
                  {!loading && <ArrowRight size={18} />}
                </Button>
              </form>

              {/* Activation code link */}
              <div className="mt-6 flex items-center justify-center gap-2 border-t border-slate-200/70 pt-6 text-sm text-slate-500">
                <KeyRound size={15} className="text-slate-400" />
                <span>Have an activation code?</span>
                <Link
                  to="/activate"
                  className="font-semibold text-indigo-600 transition-colors hover:text-indigo-700"
                >
                  Activate school
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
