import type { ReactNode } from "react";
import {
  GraduationCap,
  ShieldCheck,
  BookOpen,
  Users,
} from "lucide-react";

interface Props {
  children: ReactNode;
}

export default function AuthLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* LEFT PANEL */}

        <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-indigo-700 via-indigo-600 to-purple-700 px-20 py-16 text-white">

          <div className="max-w-xl">

            <div className="mb-10 flex h-24 w-24 items-center justify-center rounded-3xl bg-white/15 backdrop-blur-md">
              <GraduationCap size={48} />
            </div>

            <h1 className="text-6xl font-extrabold leading-tight">
              School Content
              <br />
              Management Portal
            </h1>

            <p className="mt-8 text-xl leading-9 text-indigo-100">
              A modern platform for administrators,
              teachers and students to securely manage
              educational content from one place.
            </p>

            <div className="mt-14 space-y-7">

              <div className="flex items-center gap-4">
                <ShieldCheck size={28} />
                <span className="text-lg">
                  Secure Authentication
                </span>
              </div>

              <div className="flex items-center gap-4">
                <BookOpen size={28} />
                <span className="text-lg">
                  Centralized Learning Content
                </span>
              </div>

              <div className="flex items-center gap-4">
                <Users size={28} />
                <span className="text-lg">
                  Role Based Access
                </span>
              </div>

            </div>

          </div>

        </div>

        {/* RIGHT PANEL */}

        <div className="flex items-center justify-center px-10 py-12">
          <div className="w-full max-w-lg">
            {children}
          </div>
        </div>

      </div>
    </div>
  );
}