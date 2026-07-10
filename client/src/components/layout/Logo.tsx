import { GraduationCap } from "lucide-react";
import clsx from "clsx";

interface LogoProps {
  dark?: boolean;
}

export default function Logo({ dark = false }: LogoProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-lg shadow-indigo-900/30">
        <GraduationCap size={22} strokeWidth={2} />
      </div>

      <div className="min-w-0">
        <h1
          className={clsx(
            "truncate text-sm font-bold tracking-tight",
            dark ? "text-white" : "text-slate-900"
          )}
        >
          School CMS
        </h1>
        <p
          className={clsx(
            "truncate text-xs",
            dark ? "text-slate-400" : "text-slate-500"
          )}
        >
          Content Portal
        </p>
      </div>
    </div>
  );
}
