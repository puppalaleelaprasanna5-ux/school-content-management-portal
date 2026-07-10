import { GraduationCap, Layers, FolderOpen, FileText, Users, TrendingUp } from "lucide-react";
import type { DashboardStats } from "../../hooks/useDashboardData";

interface QuickStatsProps {
  stats: DashboardStats;
  loading?: boolean;
}

const statConfig = [
  {
    key: "classes" as const,
    label: "Total Classes",
    icon: GraduationCap,
    iconClassName: "bg-indigo-50 text-indigo-600",
    color: "indigo",
  },
  {
    key: "grades" as const,
    label: "Total Grades",
    icon: Layers,
    iconClassName: "bg-violet-50 text-violet-600",
    color: "violet",
  },
  {
    key: "folders" as const,
    label: "Total Folders",
    icon: FolderOpen,
    iconClassName: "bg-sky-50 text-sky-600",
    color: "sky",
  },
  {
    key: "content" as const,
    label: "Total Content",
    icon: FileText,
    iconClassName: "bg-emerald-50 text-emerald-600",
    color: "emerald",
  },
  {
    key: "students" as const,
    label: "Total Students",
    icon: Users,
    iconClassName: "bg-amber-50 text-amber-600",
    color: "amber",
  },
];

export default function QuickStats({ stats, loading = false }: QuickStatsProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Quick Stats</h3>
          <p className="mt-1 text-sm text-slate-500">Overview of your school data</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
          <TrendingUp size={20} />
        </div>
      </div>

      <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
        {statConfig.map(({ key, label, icon: Icon, iconClassName }) => (
          <div
            key={key}
            className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition hover:bg-slate-50"
          >
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}>
              <Icon size={20} strokeWidth={1.75} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-slate-500">{label}</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">
                {loading ? (
                  <span className="inline-block h-6 w-8 animate-pulse rounded bg-slate-200" />
                ) : (
                  stats[key]
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
