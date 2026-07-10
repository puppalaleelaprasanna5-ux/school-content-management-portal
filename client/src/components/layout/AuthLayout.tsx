import type { ReactNode } from "react";
import { GraduationCap, ShieldCheck, BookOpen, Users } from "lucide-react";

interface Props {
  children: ReactNode;
}

const features = [
  { icon: ShieldCheck, label: "Secure authentication", desc: "Enterprise-grade access control" },
  { icon: BookOpen, label: "Centralized content", desc: "All learning material in one place" },
  { icon: Users, label: "Role-based access", desc: "Admins, staff and students" },
];

export default function AuthLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* LEFT — animated gradient panel */}
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-700 animate-gradient-pan lg:flex lg:flex-col lg:justify-between p-12 xl:p-16 text-white">
          {/* Decorative floating orbs */}
          <div className="animate-float-slow absolute -right-24 top-10 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <div className="animate-float-slow absolute -left-16 bottom-0 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl [animation-delay:2s]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_45%)]" />

          {/* Brand */}
          <div className="relative flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md ring-1 ring-white/20">
              <GraduationCap size={24} />
            </div>
            <span className="text-lg font-bold tracking-tight">School CMS</span>
          </div>

          {/* Headline */}
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

        {/* RIGHT — login card */}
        <div className="flex items-center justify-center px-6 py-12 sm:px-12">
          <div className="w-full max-w-md animate-fade-up">{children}</div>
        </div>
      </div>
    </div>
  );
}
