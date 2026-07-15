import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  ChevronRight,
  FileText,
  Folder,
  FolderOpen,
  NotebookText,
  PlayCircle,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react"

import { contentApi, foldersApi } from "@/lib/api/services"
import { getErrorMessage } from "@/lib/api/client"
import { useStudentSession, initialsOf } from "@/context/StudentSessionContext"
import type {
  Content,
  ContentType,
  Folder as FolderType,
} from "@/lib/api/types"
import { cn } from "@/lib/utils"

/**
 * Student Dashboard.
 *
 * Identity (name/grade/class) comes from the shared student session; this page
 * loads the student's subjects (top-level folders) and content from the
 * existing scoped `GET /folders` and `GET /content` to show summary counts,
 * subject cards and recent content. Read-only.
 */
export function StudentDashboard() {
  const navigate = useNavigate()
  const { student, gradeName, className, loading: sessionLoading } =
    useStudentSession()

  const [folders, setFolders] = useState<FolderType[]>([])
  const [content, setContent] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)

    Promise.all([foldersApi.list(), contentApi.list()])
      .then(([folderList, contentList]) => {
        if (!active) return
        setFolders(folderList)
        setContent(contentList)
      })
      .catch((err) => {
        if (active) setError(getErrorMessage(err, "Couldn't load your dashboard."))
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  // "My Subjects" = the student's top-level folders (backend already scopes).
  const subjects = useMemo(() => folders.filter((f) => !f.parentId), [folders])

  const stats = useMemo(
    () => ({
      subjects: subjects.length,
      pdfs: content.filter((c) => c.type === "PDF").length,
      videos: content.filter((c) => c.type === "VIDEO").length,
      lessons: content.filter((c) => c.type === "TEXT").length,
    }),
    [subjects, content]
  )

  // Backend returns content newest-first; take the 5 most recent.
  const recent = useMemo(() => content.slice(0, 5), [content])

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 px-4 py-6 sm:px-6 sm:py-10">
      {/* Header */}
      <section className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-lg font-semibold text-indigo-700 sm:size-16 sm:text-xl">
          {sessionLoading ? "" : initialsOf(student?.name)}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-medium text-indigo-600">Welcome back</p>
          <h1 className="mt-0.5 truncate text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            {student ? (
              student.name
            ) : (
              <span className="inline-block h-8 w-40 animate-pulse rounded bg-slate-200 align-middle" />
            )}
          </h1>
          <div className="mt-3 flex flex-wrap gap-2">
            <InfoChip label="Grade" value={gradeName} />
            <InfoChip label="Class" value={className} />
          </div>
        </div>
      </section>

      {/* Summary cards */}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={Folder} label="Subjects" value={stats.subjects} tone="indigo" loading={loading} />
        <StatCard icon={FileText} label="PDFs" value={stats.pdfs} tone="rose" loading={loading} />
        <StatCard icon={PlayCircle} label="Videos" value={stats.videos} tone="violet" loading={loading} />
        <StatCard icon={NotebookText} label="Lessons" value={stats.lessons} tone="emerald" loading={loading} />
      </section>

      {/* My Subjects */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-slate-900">
            My Subjects
          </h2>
          {!loading && !error && subjects.length > 0 && (
            <span className="text-sm text-slate-500">
              {subjects.length} {subjects.length === 1 ? "subject" : "subjects"}
            </span>
          )}
        </div>

        {loading ? (
          <SubjectsSkeleton />
        ) : error ? (
          <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" />
            <span>{error}</span>
          </div>
        ) : subjects.length === 0 ? (
          <EmptyCard
            title="No subjects yet"
            subtitle="Your subjects will appear here once your school adds them."
          />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((folder) => (
              <SubjectCard
                key={folder.id}
                name={folder.name}
                onClick={() => navigate(`/student/folder/${folder.id}`)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Recent content */}
      {!error && (loading || recent.length > 0) && (
        <section>
          <h2 className="mb-4 text-lg font-semibold tracking-tight text-slate-900">
            Recent content
          </h2>

          {loading ? (
            <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-4">
                  <div className="size-10 shrink-0 animate-pulse rounded-xl bg-slate-100" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100" />
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {recent.map((item) => (
                <RecentItem
                  key={item.id}
                  item={item}
                  onClick={() => navigate(`/student/content/${item.id}`)}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  )
}

/* -------------------------------- Pieces --------------------------------- */

const TONE: Record<string, string> = {
  indigo: "bg-indigo-50 text-indigo-600",
  rose: "bg-rose-50 text-rose-600",
  violet: "bg-violet-50 text-violet-600",
  emerald: "bg-emerald-50 text-emerald-600",
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
  loading,
}: {
  icon: LucideIcon
  label: string
  value: number
  tone: keyof typeof TONE
  loading: boolean
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-xl", TONE[tone])}>
        <Icon className="size-5" />
      </span>
      <div className="min-w-0">
        {loading ? (
          <span className="block h-6 w-8 animate-pulse rounded bg-slate-100" />
        ) : (
          <span className="block text-2xl font-semibold leading-none text-slate-900">
            {value}
          </span>
        )}
        <span className="mt-1 block text-xs font-medium text-slate-500">{label}</span>
      </div>
    </div>
  )
}

const FILE_ICON: Record<ContentType, { icon: LucideIcon; tone: string; label: string }> = {
  PDF: { icon: FileText, tone: "bg-rose-50 text-rose-600", label: "PDF" },
  VIDEO: { icon: PlayCircle, tone: "bg-violet-50 text-violet-600", label: "Video" },
  TEXT: { icon: NotebookText, tone: "bg-emerald-50 text-emerald-600", label: "Lesson" },
}

function RecentItem({ item, onClick }: { item: Content; onClick: () => void }) {
  const appearance = FILE_ICON[item.type]
  const Icon = appearance.icon
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500/40"
    >
      <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", appearance.tone)}>
        <Icon className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-slate-900">{item.title}</span>
        <span className="text-xs font-medium text-slate-400">
          {appearance.label}
          {item.folder?.name ? ` · ${item.folder.name.trim()}` : ""}
        </span>
      </span>
      <ChevronRight className="size-5 shrink-0 text-slate-300 transition-colors group-hover:text-indigo-500" />
    </button>
  )
}

function InfoChip({ label, value }: { label: string; value: string | null }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm">
      <span className="font-medium text-slate-500">{label}</span>
      <span className="font-semibold text-slate-900">{value ?? "—"}</span>
    </span>
  )
}

function SubjectCard({ name, onClick }: { name: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-all",
        "hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 active:translate-y-0"
      )}
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-100">
        <Folder className="size-5" />
      </span>
      <span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-900">
        {name}
      </span>
      <ChevronRight className="size-5 shrink-0 text-slate-300 transition-colors group-hover:text-indigo-500" />
    </button>
  )
}

function EmptyCard({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <FolderOpen className="size-6" />
      </div>
      <p className="mt-4 text-sm font-medium text-slate-900">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
    </div>
  )
}

function SubjectsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4"
        >
          <div className="size-11 shrink-0 animate-pulse rounded-xl bg-slate-100" />
          <div className="h-4 flex-1 animate-pulse rounded bg-slate-100" />
        </div>
      ))}
    </div>
  )
}

export default StudentDashboard
