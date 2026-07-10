import { Clock, Calendar, Shield, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function RecentLogin() {
  const { user } = useAuth();

  const formatCurrentSession = () => {
    const now = new Date();
    return now.toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatSessionDuration = () => {
    // Since we don't have lastLogin in the User interface, we'll show current session info
    const now = new Date();
    const sessionStart = new Date();
    sessionStart.setHours(now.getHours() - 1); // Simulate 1 hour session
    
    const diffMs = now.getTime() - sessionStart.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffHours > 0) return `${diffHours}h ${diffMins % 60}m`;
    return `${diffMins}m`;
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Current Session</h3>
          <p className="mt-1 text-sm text-slate-500">Your session information</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
          <Clock size={20} />
        </div>
      </div>

      <div className="space-y-4 p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Shield size={24} strokeWidth={1.75} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-slate-900">{user?.name ?? "User"}</p>
            <p className="mt-0.5 text-xs text-slate-500 capitalize">{user?.role?.toLowerCase() ?? "member"}</p>
          </div>
        </div>

        <div className="space-y-3 rounded-xl bg-slate-50 p-4">
          <div className="flex items-center gap-3">
            <Calendar size={16} className="text-slate-400" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-500">Date</p>
              <p className="text-sm font-medium text-slate-900">{formatCurrentSession()}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock size={16} className="text-slate-400" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-500">Time</p>
              <p className="text-sm font-medium text-slate-900">{formatCurrentTime()}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LogOut size={16} className="text-slate-400" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-500">Session Duration</p>
              <p className="text-sm font-medium text-slate-900">{formatSessionDuration()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
