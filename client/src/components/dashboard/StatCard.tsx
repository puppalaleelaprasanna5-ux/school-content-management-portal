import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import clsx from "clsx";

type Trend = "up" | "down" | "neutral";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  subtitle?: string;
  /** Tailwind gradient stops for the icon badge, e.g. "from-indigo-500 to-blue-600". */
  gradient?: string;
  /** Trend text, e.g. "+12%". */
  change?: string;
  trend?: Trend;
  loading?: boolean;
}

const trendStyles: Record<Trend, { className: string; icon: LucideIcon }> = {
  up: { className: "bg-emerald-50 text-emerald-600", icon: TrendingUp },
  down: { className: "bg-red-50 text-red-600", icon: TrendingDown },
  neutral: { className: "bg-slate-100 text-slate-500", icon: Minus },
};

export default function StatCard({
  label,
  value,
  icon: Icon,
  subtitle,
  gradient = "from-indigo-500 to-indigo-600",
  change,
  trend,
  loading = false,
}: StatCardProps) {
  // Default to "up" when a change is provided without an explicit trend.
  const resolvedTrend: Trend = trend ?? "up";
  const { className: trendClass, icon: TrendIcon } = trendStyles[resolvedTrend];

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm shadow-slate-200/40 ring-1 ring-slate-200/70 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/60">
      {/* Gradient accent wash */}
      <div
        className={clsx(
          "pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br opacity-10 blur-2xl transition-opacity duration-200 group-hover:opacity-20",
          gradient
        )}
      />

      <div className="relative flex items-center justify-between">
        <div
          className={clsx(
            "flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm",
            gradient
          )}
        >
          <Icon size={20} strokeWidth={2} />
        </div>

        {change && (
          <span
            className={clsx(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
              trendClass
            )}
          >
            <TrendIcon size={12} />
            {change}
          </span>
        )}
      </div>

      <div className="relative mt-4">
        {loading ? (
          <div className="h-8 w-20 animate-pulse rounded bg-slate-200" />
        ) : (
          <p className="text-3xl font-bold tracking-tight text-slate-900">{value}</p>
        )}
        <p className="mt-1 text-sm font-medium text-slate-600">{label}</p>
        {subtitle && <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>}
      </div>
    </div>
  );
}
