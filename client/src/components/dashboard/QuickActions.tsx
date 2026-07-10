import { Link } from "react-router-dom";
import {
  GraduationCap,
  Layers,
  FolderPlus,
  Upload,
  ArrowUpRight,
} from "lucide-react";
import clsx from "clsx";

const actions = [
  {
    to: "/dashboard/classes",
    label: "Manage Classes",
    description: "Create and organize class sections",
    icon: GraduationCap,
    iconClassName: "bg-indigo-50 text-indigo-600",
  },
  {
    to: "/dashboard/grades",
    label: "Manage Grades",
    description: "Set up grade levels for your school",
    icon: Layers,
    iconClassName: "bg-violet-50 text-violet-600",
  },
  {
    to: "/dashboard/folders",
    label: "Create Folder",
    description: "Structure content into folders",
    icon: FolderPlus,
    iconClassName: "bg-sky-50 text-sky-600",
  },
  {
    to: "/dashboard/content",
    label: "Upload Content",
    description: "Add PDFs, videos, or text lessons",
    icon: Upload,
    iconClassName: "bg-emerald-50 text-emerald-600",
  },
];

export default function QuickActions() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div className="mb-5">
        <h3 className="text-base font-semibold text-slate-900">
          Quick Actions
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Jump to common tasks across the portal
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {actions.map(({ to, label, description, icon: Icon, iconClassName }) => (
          <Link
            key={to}
            to={to}
            className="group flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:border-slate-200 hover:bg-white hover:shadow-sm"
          >
            <div
              className={clsx(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                iconClassName
              )}
            >
              <Icon size={18} strokeWidth={1.75} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-medium text-slate-900">{label}</p>
                <ArrowUpRight
                  size={14}
                  className="text-slate-400 opacity-0 transition-opacity group-hover:opacity-100"
                />
              </div>
              <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                {description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
