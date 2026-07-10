import { HardDrive, Users, Activity } from "lucide-react";
import clsx from "clsx";

interface ProgressCardProps {
  label: string;
  value: string;
  progress: number;
  icon: React.ComponentType<{ size?: number }>;
  iconClassName: string;
  colorClassName: string;
}

function ProgressCard({ label, value, progress, icon: Icon, iconClassName, colorClassName }: ProgressCardProps) {
  if (!Icon) return null;
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">{value}</p>
        </div>
        <div className={clsx("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", iconClassName)}>
          <Icon size={20} />
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Progress</span>
          <span className={clsx("font-medium", colorClassName)}>{progress}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className={clsx("h-full rounded-full transition-all duration-500", colorClassName)}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default function ProgressCards() {
  const cards = [
    {
      label: "Storage Used",
      value: "45.2 GB",
      progress: 45,
      icon: HardDrive,
      iconClassName: "bg-indigo-50 text-indigo-600",
      colorClassName: "bg-indigo-500 text-indigo-600",
    },
    {
      label: "Active Users",
      value: "128",
      progress: 78,
      icon: Users,
      iconClassName: "bg-emerald-50 text-emerald-600",
      colorClassName: "bg-emerald-500 text-emerald-600",
    },
    {
      label: "Recent Activity",
      value: "89%",
      progress: 89,
      icon: Activity,
      iconClassName: "bg-violet-50 text-violet-600",
      colorClassName: "bg-violet-500 text-violet-600",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, index) => (
        <ProgressCard key={index} {...card} />
      ))}
    </div>
  );
}
