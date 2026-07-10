import { GraduationCap, Layers, Users, FileText, Upload, TrendingUp } from "lucide-react";
import clsx from "clsx";

interface AnalyticsCardProps {
  label: string;
  value: string | number;
  change?: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  gradient: string;
}

function AnalyticsCard({ label, value, change, icon: Icon, gradient }: AnalyticsCardProps) {
  if (!Icon) return null;
  return (
    <div className="group rounded-2xl bg-white p-5 shadow-sm shadow-slate-200/40 ring-1 ring-slate-200/70 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/60">
      <div className="flex items-center justify-between">
        <div
          className={clsx(
            "flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm",
            gradient
          )}
        >
          <Icon size={20} strokeWidth={2} />
        </div>
        {change && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600">
            <TrendingUp size={12} />
            {change}
          </span>
        )}
      </div>
      <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
      <p className="mt-1 text-sm font-medium text-slate-500">{label}</p>
    </div>
  );
}

interface AnalyticsCardsProps {
  stats?: {
    classes: number;
    grades: number;
    students: number;
    content: number;
    uploads: number;
  };
  loading?: boolean;
}

export default function AnalyticsCards({ stats, loading }: AnalyticsCardsProps) {
  const cards = [
    {
      label: "Total Classes",
      value: stats?.classes ?? 0,
      change: "+12%",
      icon: GraduationCap,
      gradient: "from-indigo-500 to-indigo-600",
    },
    {
      label: "Total Grades",
      value: stats?.grades ?? 0,
      change: "+5%",
      icon: Layers,
      gradient: "from-blue-500 to-blue-600",
    },
    {
      label: "Students",
      value: stats?.students ?? 0,
      change: "+18%",
      icon: Users,
      gradient: "from-emerald-500 to-emerald-600",
    },
    {
      label: "Content Items",
      value: stats?.content ?? 0,
      change: "+24%",
      icon: FileText,
      gradient: "from-amber-500 to-amber-600",
    },
    {
      label: "Total Uploads",
      value: stats?.uploads ?? 0,
      change: "+32%",
      icon: Upload,
      gradient: "from-indigo-500 to-blue-600",
    },
  ];

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/70">
            <div className="h-11 w-11 animate-pulse rounded-xl bg-slate-200" />
            <div className="mt-4 h-8 w-16 animate-pulse rounded bg-slate-200" />
            <div className="mt-2 h-3 w-24 animate-pulse rounded bg-slate-200" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {cards.map((card, index) => (
        <AnalyticsCard key={index} {...card} />
      ))}
    </div>
  );
}
