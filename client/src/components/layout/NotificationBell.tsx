import { useState, useEffect, useRef, useCallback } from "react";
import { Bell, CheckCheck, Clock, FileText, FolderOpen, GraduationCap, Layers, Settings, UserPlus, Video, X } from "lucide-react";
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

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/activities/recent?limit=10");
      setActivities(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch activities:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchActivities();
    }
  }, [isOpen, fetchActivities]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = (id: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
  };

  const markAllAsRead = () => {
    setActivities([]);
  };

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
      GRADE_CREATED: "bg-purple-100 text-purple-600",
      GRADE_UPDATED: "bg-purple-100 text-purple-600",
      FOLDER_CREATED: "bg-yellow-100 text-yellow-600",
      FOLDER_UPDATED: "bg-yellow-100 text-yellow-600",
      CONTENT_CREATED: "bg-green-100 text-green-600",
      CONTENT_UPDATED: "bg-green-100 text-green-600",
      PDF_UPLOADED: "bg-red-100 text-red-600",
      VIDEO_UPLOADED: "bg-pink-100 text-pink-600",
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

  const unreadCount = activities.length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={clsx(
          "relative flex h-10 w-10 items-center justify-center rounded-xl transition",
          isOpen ? "bg-indigo-50 text-indigo-600" : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        )}
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-semibold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-slate-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700"
              >
                <CheckCheck size={14} />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="space-y-3 p-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="h-8 w-8 shrink-0 animate-pulse rounded-lg bg-slate-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-3/4 animate-pulse rounded bg-slate-200" />
                      <div className="h-2.5 w-1/2 animate-pulse rounded bg-slate-200" />
                    </div>
                  </div>
                ))}
              </div>
            ) : activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                  <Bell size={20} />
                </div>
                <p className="mt-3 text-sm font-medium text-slate-900">No notifications</p>
                <p className="mt-1 text-xs text-slate-500">You're all caught up!</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {activities.map((activity) => {
                  const Icon = getActivityIcon(activity.type);
                  const iconColor = getIconColor(activity.type);

                  return (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 p-4 hover:bg-slate-50 transition"
                    >
                      <div className={clsx("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", iconColor)}>
                        <Icon size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-900 line-clamp-1">{activity.title}</p>
                        <p className="mt-0.5 text-xs text-slate-500 line-clamp-1">{activity.description}</p>
                        <p className="mt-1 text-[11px] text-slate-400">{getRelativeTime(activity.createdAt)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => markAsRead(activity.id)}
                        className="shrink-0 rounded-lg p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
                        aria-label="Mark as read"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
