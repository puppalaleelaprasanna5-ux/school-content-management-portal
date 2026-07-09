import {
  GraduationCap,
  Layers,
  FolderOpen,
  FileText,
} from "lucide-react";

import StatCard from "../../components/dashboard/StatCard";
import QuickActions from "../../components/dashboard/QuickActions";
import RecentUploads from "../../components/dashboard/RecentUploads";
import { useAuth } from "../../context/AuthContext";
import { useDashboardData } from "../../hooks/useDashboardData";

const statConfig = [
  {
    key: "classes" as const,
    label: "Classes",
    icon: GraduationCap,
    iconClassName: "bg-indigo-50 text-indigo-600",
  },
  {
    key: "grades" as const,
    label: "Grades",
    icon: Layers,
    iconClassName: "bg-violet-50 text-violet-600",
  },
  {
    key: "folders" as const,
    label: "Folders",
    icon: FolderOpen,
    iconClassName: "bg-sky-50 text-sky-600",
  },
  {
    key: "content" as const,
    label: "Content Items",
    icon: FileText,
    iconClassName: "bg-emerald-50 text-emerald-600",
  },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { stats, recentUploads, loading } = useDashboardData();
  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 lg:space-y-7">
      <header className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {getGreeting()}, {firstName}
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Dashboard overview
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500">
            Track your school content at a glance and jump into the tasks
            that need attention.
          </p>
        </div>

        <div className="mt-4 shrink-0 rounded-xl border border-slate-200/80 bg-white px-4 py-2.5 text-sm shadow-sm sm:mt-0">
          <span className="text-slate-500">Signed in as </span>
          <span className="font-medium capitalize text-slate-900">
            {user?.role?.toLowerCase() ?? "member"}
          </span>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statConfig.map(({ key, label, icon, iconClassName }) => (
          <StatCard
            key={key}
            label={label}
            value={stats[key]}
            icon={icon}
            iconClassName={iconClassName}
            loading={loading}
          />
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <QuickActions />
        </div>

        <div className="lg:col-span-3">
          <RecentUploads uploads={recentUploads} loading={loading} />
        </div>
      </section>
    </div>
  );
}
