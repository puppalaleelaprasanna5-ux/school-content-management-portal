import { useState, useEffect, useCallback } from "react";
import { Clock, FileText, FolderOpen, GraduationCap, Layers, Settings, UserPlus, Video, ArrowRight, Inbox } from "lucide-react";
import clsx from "clsx";

import api from "../../services/api";

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

export default function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = useCallback(async () => {
    try {
      const res = await api.get("/activities/recent?limit=5");
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

  // Get icon based on activity type
  const getActivityIcon = (type: string) => {
    const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
      CLASS_CREATED: GraduationCap,
      CLASS_UPDATED: GraduationCap,
      GRADE_CREATED: Layers,
      GRADE_UPDATED: Layers,
      FOLDER_CREATED: FolderOpen,
      FOLDER_UPDATED: FolderOpen,
      CONTENT_CREATED: FileText,
      CONTENT_UPDATED: FileText,
      PDF_UPLOADED: FileText,
      VIDEO_UPLOADED: Video,
      STUDENT_CREATED: UserPlus,
      STUDENT_UPDATED: UserPlus,
      SETTINGS_UPDATED: Settings,
    };

    const Icon = iconMap[type] || Clock;
    return Icon;
  };

  // Get icon color based on activity type
  const getIconColor = (type: string) => {
    const colorMap: Record<string, string> = {
      CLASS_CREATED: "bg-blue-100 text-blue-600",
      CLASS_UPDATED: "bg-blue-100 text-blue-600",
      GRADE_CREATED: "bg-indigo-100 text-indigo-600",
      GRADE_UPDATED: "bg-indigo-100 text-indigo-600",
      FOLDER_CREATED: "bg-amber-100 text-amber-600",
      FOLDER_UPDATED: "bg-amber-100 text-amber-600",
      CONTENT_CREATED: "bg-emerald-100 text-emerald-600",
      CONTENT_UPDATED: "bg-emerald-100 text-emerald-600",
      PDF_UPLOADED: "bg-red-100 text-red-600",
      VIDEO_UPLOADED: "bg-blue-100 text-blue-600",
      STUDENT_CREATED: "bg-indigo-100 text-indigo-600",
      STUDENT_UPDATED: "bg-indigo-100 text-indigo-600",
      SETTINGS_UPDATED: "bg-slate-100 text-slate-600",
    };

    return colorMap[type] || "bg-slate-100 text-slate-600";
  };

  // Format relative time
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Get initials
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  // Loading skeleton
  const loadingSkeleton = (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-start gap-3">
          <div className="h-8 w-8 shrink-0 animate-pulse rounded-lg bg-slate-200" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-3/4 animate-pulse rounded bg-slate-200" />
            <div className="h-2.5 w-1/2 animate-pulse rounded bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  );

  // Empty state
  const emptyState = (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
        <Inbox size={20} />
      </div>
      <p className="mt-3 text-sm font-medium text-slate-900">No recent activity</p>
      <p className="mt-1 text-xs text-slate-500">Activities will appear here as you use the system</p>
    </div>
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900">Recent Activity</h3>
        <a
          href="/dashboard/activity"
          className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700"
        >
          View all
          <ArrowRight size={14} />
        </a>
      </div>

      {loading ? (
        loadingSkeleton
      ) : activities.length === 0 ? (
        emptyState
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => {
            const Icon = getActivityIcon(activity.type);
            const iconColor = getIconColor(activity.type);

            return (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={clsx("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", iconColor)}>
                  <Icon size={14} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-900 line-clamp-1">{activity.title}</p>
                  <p className="mt-0.5 text-xs text-slate-500 line-clamp-1">{activity.description}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-medium text-slate-600">
                      {getInitials(activity.user.name)}
                    </div>
                    <p className="text-[11px] text-slate-400">{getRelativeTime(activity.createdAt)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
