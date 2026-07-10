import { useState, useEffect, useCallback } from "react";
import {
  Clock,
  FileText,
  FolderOpen,
  GraduationCap,
  Layers,
  Settings,
  UserPlus,
  Video,
  Activity as ActivityIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import clsx from "clsx";

import api from "../../services/api";
import PageHeader from "../../components/ui/PageHeader";
import EmptyState from "../../components/ui/EmptyState";

interface ActivityUser {
  id: string;
  name: string;
  email: string;
}

interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  createdAt: string;
  user: ActivityUser;
  metadata: Record<string, unknown>;
}

// Icon + palette-aligned tone per activity type (slate / indigo / blue / emerald / amber / red only)
const TYPE_META: Record<string, { icon: LucideIcon; tone: string }> = {
  CLASS_CREATED: { icon: GraduationCap, tone: "bg-blue-50 text-blue-600" },
  CLASS_UPDATED: { icon: GraduationCap, tone: "bg-blue-50 text-blue-600" },
  GRADE_CREATED: { icon: Layers, tone: "bg-indigo-50 text-indigo-600" },
  GRADE_UPDATED: { icon: Layers, tone: "bg-indigo-50 text-indigo-600" },
  FOLDER_CREATED: { icon: FolderOpen, tone: "bg-amber-50 text-amber-600" },
  FOLDER_UPDATED: { icon: FolderOpen, tone: "bg-amber-50 text-amber-600" },
  CONTENT_CREATED: { icon: FileText, tone: "bg-emerald-50 text-emerald-600" },
  CONTENT_UPDATED: { icon: FileText, tone: "bg-emerald-50 text-emerald-600" },
  PDF_UPLOADED: { icon: FileText, tone: "bg-red-50 text-red-600" },
  VIDEO_UPLOADED: { icon: Video, tone: "bg-blue-50 text-blue-600" },
  STUDENT_CREATED: { icon: UserPlus, tone: "bg-indigo-50 text-indigo-600" },
  STUDENT_UPDATED: { icon: UserPlus, tone: "bg-indigo-50 text-indigo-600" },
  SETTINGS_UPDATED: { icon: Settings, tone: "bg-slate-100 text-slate-600" },
};

function getMeta(type: string) {
  return TYPE_META[type] ?? { icon: Clock, tone: "bg-slate-100 text-slate-600" };
}

function getRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function ActivityPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = useCallback(async () => {
    try {
      const res = await api.get("/activities?limit=100");
      setActivities(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch activities:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <PageHeader
        title="Activity"
        subtitle="Track all activities and changes across your school"
      />

      <div className="rounded-2xl bg-white p-6 shadow-sm shadow-slate-200/40 ring-1 ring-slate-200/70 sm:p-8">
        {loading ? (
          // Skeleton timeline
          <ol className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <li key={i} className="flex items-start gap-4">
                <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-slate-200" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100" />
                  <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
                </div>
              </li>
            ))}
          </ol>
        ) : activities.length === 0 ? (
          <EmptyState
            icon={ActivityIcon}
            title="No activity yet"
            description="Activities will appear here as you and your team use the system."
          />
        ) : (
          <ol className="relative">
            {activities.map((activity, index) => {
              const { icon: Icon, tone } = getMeta(activity.type);
              const isLast = index === activities.length - 1;

              return (
                <li key={activity.id} className="relative flex gap-4 pb-6 last:pb-0">
                  {/* Connector line */}
                  {!isLast && (
                    <span
                      aria-hidden="true"
                      className="absolute left-5 top-12 -ml-px h-[calc(100%-2.5rem)] w-px bg-slate-200"
                    />
                  )}

                  {/* Icon node */}
                  <div
                    className={clsx(
                      "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-4 ring-white",
                      tone
                    )}
                  >
                    <Icon size={18} />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1 rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3 transition-colors hover:bg-slate-50">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-semibold text-slate-900">{activity.title}</p>
                      <span className="shrink-0 whitespace-nowrap text-xs text-slate-400">
                        {getRelativeTime(activity.createdAt)}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-slate-600">{activity.description}</p>

                    <div className="mt-2.5 flex items-center gap-2">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-[10px] font-semibold text-white">
                        {getInitials(activity.user.name)}
                      </div>
                      <p className="text-xs font-medium text-slate-500">{activity.user.name}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}
