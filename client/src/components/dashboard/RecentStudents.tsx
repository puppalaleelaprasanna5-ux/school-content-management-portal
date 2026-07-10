import { Link } from "react-router-dom";
import { User, GraduationCap, ArrowRight, Inbox } from "lucide-react";
import type { StudentItem } from "../../hooks/useDashboardData";

interface RecentStudentsProps {
  students: StudentItem[];
  loading?: boolean;
}

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export default function RecentStudents({ students, loading = false }: RecentStudentsProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Recent Students</h3>
          <p className="mt-1 text-sm text-slate-500">Latest student enrollments</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <User size={20} />
        </div>
      </div>

      {loading ? (
        <div className="space-y-3 p-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex animate-pulse items-center gap-4 rounded-xl bg-slate-50 p-4"
            >
              <div className="h-10 w-10 rounded-xl bg-slate-200" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-1/3 rounded bg-slate-200" />
                <div className="h-2 w-1/4 rounded bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      ) : students.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
            <Inbox size={22} />
          </div>
          <p className="mt-4 text-sm font-medium text-slate-900">No students yet</p>
          <p className="mt-1 max-w-xs text-sm text-slate-500">
            Students you add will appear here.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-100">
          {students.map((item) => (
            <li key={item.id}>
              <div className="flex items-center gap-4 px-6 py-4 transition hover:bg-slate-50/80">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <User size={18} strokeWidth={1.75} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">{item.name}</p>
                  <p className="mt-0.5 truncate text-xs text-slate-500">
                    {item.email}
                  </p>
                </div>

                <div className="hidden shrink-0 text-right sm:block">
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <GraduationCap size={12} />
                    <span>{item.class?.name ?? item.grade?.name ?? "â€”"}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">{formatRelativeTime(item.createdAt)}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {students.length > 0 && (
        <div className="border-t border-slate-100 px-6 py-3">
          <Link
            to="/dashboard/students"
            className="flex items-center justify-center gap-1 text-sm font-medium text-indigo-600 transition hover:text-indigo-700"
          >
            View all students
            <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
}
