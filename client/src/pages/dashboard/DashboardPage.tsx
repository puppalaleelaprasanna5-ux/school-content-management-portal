import { Link } from "react-router-dom";
import {
  Upload,
  GraduationCap,
  HardDrive,
  FileText,
  FolderOpen,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import Card from "../../components/ui/Card";
import AnalyticsCards from "../../components/dashboard/AnalyticsCards";
import AnalyticsCharts from "../../components/dashboard/AnalyticsCharts";
import RecentActivity from "../../components/dashboard/RecentActivity";
import QuickActions from "../../components/dashboard/QuickActions";
import RecentUploads from "../../components/dashboard/RecentUploads";
import { useAuth } from "../../context/AuthContext";
import { useDashboardData, type DashboardStats } from "../../hooks/useDashboardData";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

/** Storage / library overview built entirely from real API stats — no fabricated values. */
function StorageCard({ stats, loading }: { stats: DashboardStats; loading: boolean }) {
  const rows: { label: string; value: number; icon: LucideIcon; bar: string }[] = [
    { label: "Content items", value: stats.content, icon: FileText, bar: "from-indigo-500 to-blue-600" },
    { label: "Folders", value: stats.folders, icon: FolderOpen, bar: "from-blue-500 to-blue-600" },
    { label: "Students", value: stats.students, icon: Users, bar: "from-emerald-500 to-emerald-600" },
  ];
  const max = Math.max(1, ...rows.map((r) => r.value));

  return (
    <Card padding="md" hover className="flex h-full flex-col">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white">
          <HardDrive size={18} />
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-900">Storage</h3>
          <p className="text-sm text-slate-500">Library at a glance</p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {rows.map(({ label, value, icon: Icon, bar }) => (
          <div key={label}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-slate-600">
                <Icon size={14} className="text-slate-400" />
                {label}
              </span>
              <span className="font-semibold text-slate-900">
                {loading ? "—" : value}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${bar} transition-all duration-500`}
                style={{ width: loading ? "0%" : `${(value / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { stats, recentUploads, loading } = useDashboardData();
  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      {/* Welcome section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-600 to-blue-700 p-6 text-white shadow-xl shadow-indigo-600/20 sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 right-24 h-56 w-56 rounded-full bg-blue-400/20 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-indigo-100">
              {getGreeting()}, {firstName}
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Welcome back to your dashboard
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-indigo-100">
              Track your school content at a glance and jump into the tasks that
              need your attention.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/dashboard/content"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-indigo-700 shadow-sm transition-all duration-200 hover:bg-indigo-50 active:scale-[0.97]"
            >
              <Upload size={18} />
              Upload Content
            </Link>
            <Link
              to="/dashboard/classes"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-white/15 px-4 text-sm font-semibold text-white ring-1 ring-inset ring-white/25 backdrop-blur-sm transition-all duration-200 hover:bg-white/25 active:scale-[0.97]"
            >
              <GraduationCap size={18} />
              Manage Classes
            </Link>
          </div>
        </div>
      </section>

      {/* Analytics cards (5) */}
      <AnalyticsCards
        stats={{
          classes: stats.classes,
          grades: stats.grades,
          students: stats.students || 0,
          content: stats.content,
          uploads: stats.content || 0,
        }}
        loading={loading}
      />

      {/* Two-column grid */}
      <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
        {/* LEFT — charts + recent uploads */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div>
            <h2 className="mb-4 text-lg font-semibold tracking-tight text-slate-900">
              Analytics
            </h2>
            <AnalyticsCharts />
          </div>

          <RecentUploads uploads={recentUploads} loading={loading} />
        </div>

        {/* RIGHT — quick actions + recent activity + storage */}
        <div className="flex flex-col gap-6">
          <QuickActions />
          <RecentActivity />
          <StorageCard stats={stats} loading={loading} />
        </div>
      </div>
    </div>
  );
}
