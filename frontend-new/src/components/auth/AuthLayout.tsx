import { type ReactNode } from "react"
import { GraduationCap, BookOpen, ShieldCheck, Zap } from "lucide-react"

interface Feature {
  icon: typeof BookOpen
  title: string
  description: string
}

const features: Feature[] = [
  {
    icon: BookOpen,
    title: "Unified content library",
    description: "Organize folders, subjects and lessons in one place.",
  },
  {
    icon: ShieldCheck,
    title: "Role-based access",
    description: "Give teachers and admins exactly the access they need.",
  },
  {
    icon: Zap,
    title: "Fast by default",
    description: "Publish and update material in just a few clicks.",
  },
]

interface AuthLayoutProps {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      {/* LEFT — branding + animated gradient */}
      <aside className="relative hidden w-1/2 overflow-hidden bg-slate-950 lg:flex xl:w-[55%]">
        {/* Animated aurora blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="auth-aurora-1 absolute -top-24 -left-24 size-[28rem] rounded-full bg-indigo-600/40 blur-3xl" />
          <div className="auth-aurora-2 absolute top-1/3 -right-16 size-[24rem] rounded-full bg-violet-600/30 blur-3xl" />
          <div className="auth-aurora-3 absolute -bottom-24 left-1/4 size-[26rem] rounded-full bg-blue-600/30 blur-3xl" />
        </div>
        {/* Subtle grid overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage:
              "radial-gradient(ellipse at center, black 40%, transparent 75%)",
          }}
        />

        <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-14">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
              <GraduationCap className="size-6" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-base font-semibold text-white">
                School CMS
              </span>
              <span className="text-xs text-slate-400">Content Portal</span>
            </div>
          </div>

          {/* Headline + description */}
          <div className="max-w-lg">
            <h1 className="text-4xl font-semibold tracking-tight text-white xl:text-5xl">
              Everything your school teaches, in one calm place.
            </h1>
            <p className="mt-5 text-base leading-relaxed text-slate-300">
              Manage curriculum, classes and learning materials with a portal
              built for teachers and administrators.
            </p>
          </div>

          {/* Three feature cards */}
          <div className="grid gap-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-colors hover:bg-white/10"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
                  <feature.icon className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {feature.title}
                  </p>
                  <p className="mt-0.5 text-sm text-slate-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* RIGHT — floating card slot */}
      <main className="relative flex w-full flex-1 items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  )
}
