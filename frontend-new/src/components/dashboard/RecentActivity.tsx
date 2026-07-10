import { UploadCloud, UserPlus, FolderPlus, PenSquare, Activity as ActivityIcon } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { Activity } from "@/lib/api/types"

interface RecentActivityProps {
  activities: Activity[]
  loading?: boolean
  error?: string | null
}

function toneFor(type: string): string {
  const key = type.toLowerCase()
  if (key.includes("upload") || key.includes("content")) return "bg-indigo-50 text-indigo-600"
  if (key.includes("student") || key.includes("enroll")) return "bg-emerald-50 text-emerald-600"
  if (key.includes("folder")) return "bg-blue-50 text-blue-600"
  if (key.includes("class") || key.includes("grade")) return "bg-violet-50 text-violet-600"
  return "bg-slate-100 text-slate-500"
}

function iconFor(type: string) {
  const key = type.toLowerCase()
  if (key.includes("upload") || key.includes("content")) return UploadCloud
  if (key.includes("student") || key.includes("enroll")) return UserPlus
  if (key.includes("folder")) return FolderPlus
  return PenSquare
}

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime()
  const diff = Date.now() - then
  const mins = Math.round(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.round(hrs / 24)
  return `${days}d ago`
}

export function RecentActivity({ activities, loading, error }: RecentActivityProps) {
  return (
    <Card className="gap-0 rounded-2xl border-0 p-6 shadow-sm ring-1 ring-slate-200/70">
      <h3 className="text-base font-semibold text-slate-900">Recent activity</h3>
      <p className="mt-0.5 text-sm text-slate-500">Latest events in your school</p>

      {loading ? (
        <div className="mt-5 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="size-8 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-1/2 rounded" />
                <Skeleton className="h-3 w-2/3 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : error || activities.length === 0 ? (
        <div className="mt-4 flex flex-col items-center gap-2 py-8 text-center">
          <div className="flex size-11 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <ActivityIcon className="size-5" />
          </div>
          <p className="text-sm font-medium text-slate-900">No recent activity</p>
          <p className="max-w-xs text-xs text-slate-500">
            {error ? "Activity log is unavailable right now." : "Actions across your school will show up here."}
          </p>
        </div>
      ) : (
        <ol className="mt-5 space-y-1">
          {activities.map((item, index) => {
            const isLast = index === activities.length - 1
            const Icon = iconFor(item.type)
            return (
              <li key={item.id} className="relative flex gap-3.5 pb-5 last:pb-0">
                {!isLast && (
                  <span className="absolute top-9 left-[15px] h-[calc(100%-1.5rem)] w-px bg-slate-200" />
                )}
                <span
                  className={cn(
                    "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full",
                    toneFor(item.type)
                  )}
                >
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {item.title}
                    </p>
                    <span className="shrink-0 text-xs text-slate-400">
                      {relativeTime(item.createdAt)}
                    </span>
                  </div>
                  <p className="truncate text-sm text-slate-500">{item.description}</p>
                </div>
              </li>
            )
          })}
        </ol>
      )}
    </Card>
  )
}
