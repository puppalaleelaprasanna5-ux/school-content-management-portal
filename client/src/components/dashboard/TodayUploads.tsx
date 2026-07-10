import { Link } from "react-router-dom";
import { FileText, FileVideo, AlignLeft, Image as ImageIcon, Upload, ArrowRight, Inbox } from "lucide-react";
import type { ContentItem } from "../../hooks/useDashboardData";

interface TodayUploadsProps {
  uploads: ContentItem[];
  loading?: boolean;
}

const typeConfig = {
  PDF: { icon: FileText, label: "PDF", className: "bg-rose-50 text-rose-600" },
  VIDEO: { icon: FileVideo, label: "Video", className: "bg-blue-50 text-blue-600" },
  TEXT: { icon: AlignLeft, label: "Text", className: "bg-amber-50 text-amber-600" },
  IMAGE: { icon: ImageIcon, label: "Image", className: "bg-emerald-50 text-emerald-600" },
};

function formatTime(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

export default function TodayUploads({ uploads, loading = false }: TodayUploadsProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Today's Uploads</h3>
          <p className="mt-1 text-sm text-slate-500">Content uploaded today</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <Upload size={20} />
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
      ) : uploads.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
            <Inbox size={22} />
          </div>
          <p className="mt-4 text-sm font-medium text-slate-900">No uploads today</p>
          <p className="mt-1 max-w-xs text-sm text-slate-500">
            Content uploaded today will appear here.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-100">
          {uploads.map((item) => {
            const config = typeConfig[item.type];
            const Icon = config.icon;

            return (
              <li key={item.id}>
                <div className="flex items-center gap-4 px-6 py-4 transition hover:bg-slate-50/80">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.className}`}
                  >
                    <Icon size={18} strokeWidth={1.75} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900">{item.title}</p>
                    <p className="mt-0.5 truncate text-xs text-slate-500">
                      {item.folder?.name ?? "Uncategorized"}
                    </p>
                  </div>

                  <div className="hidden shrink-0 text-right sm:block">
                    <span className="inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                      {config.label}
                    </span>
                    <p className="mt-1 text-xs text-slate-400">{formatTime(item.createdAt)}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {uploads.length > 0 && (
        <div className="border-t border-slate-100 px-6 py-3">
          <Link
            to="/dashboard/content"
            className="flex items-center justify-center gap-1 text-sm font-medium text-indigo-600 transition hover:text-indigo-700"
          >
            View all uploads
            <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
}
