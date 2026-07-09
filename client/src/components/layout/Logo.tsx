import { GraduationCap } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="rounded-2xl bg-indigo-600 p-3 text-white shadow-lg">
        <GraduationCap size={26} />
      </div>

      <div>
        <h1 className="text-lg font-bold text-slate-900">
          School CMS
        </h1>

        <p className="text-sm text-slate-500">
          Content Management Portal
        </p>
      </div>
    </div>
  );
}