import type { LucideIcon } from "lucide-react";
import clsx from "clsx";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  iconClassName?: string;
  loading?: boolean;
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  iconClassName = "bg-indigo-50 text-indigo-600",
  loading = false,
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {label}
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            {loading ? (
              <span className="inline-block h-8 w-12 animate-pulse rounded-lg bg-slate-100" />
            ) : (
              value
            )}
          </p>
        </div>

        <div
          className={clsx(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
            iconClassName
          )}
        >
          <Icon size={20} strokeWidth={1.75} />
        </div>
      </div>
    </div>
  );
}
