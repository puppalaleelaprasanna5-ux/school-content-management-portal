import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronRight, Folder, FolderOpen, TriangleAlert } from "lucide-react"

import { authApi, classesApi, foldersApi, gradesApi } from "@/lib/api/services"
import { getErrorMessage } from "@/lib/api/client"
import type { AuthUser, Folder as FolderType } from "@/lib/api/types"
import { cn } from "@/lib/utils"

/**
 * Student Dashboard.
 *
 * Fetches the currently logged-in student via the existing `/auth/me` endpoint
 * (source of truth, so it reflects whoever just logged in), resolves their
 * grade/class names by id from `/grades/:id` and `/classes/:id`, then lists
 * their subjects — top-level folders from `GET /folders` scoped to the
 * student's grade/class. Read-only: no create/edit/delete/upload actions.
 */
export function StudentDashboard() {
  const navigate = useNavigate()

  const [student, setStudent] = useState<AuthUser | null>(null)
  const [gradeName, setGradeName] = useState<string | null>(null)
  const [className, setClassName] = useState<string | null>(null)
  const [folders, setFolders] = useState<FolderType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)

    const load = async () => {
      try {
        // Who is logged in right now — via the existing auth flow.
        const me = await authApi.me()
        if (!active) return
        setStudent(me)

        // The user object only carries gradeId/classId, so resolve the display
        // names from the existing grade/class endpoints (and load subjects).
        const [grade, cls, folderList] = await Promise.all([
          me.gradeId ? gradesApi.getById(me.gradeId).catch(() => null) : null,
          me.classId ? classesApi.getById(me.classId).catch(() => null) : null,
          foldersApi.list(),
        ])
        if (!active) return
        setGradeName(grade?.name ?? null)
        setClassName(cls?.name ?? null)
        setFolders(folderList)
      } catch (err) {
        if (active) setError(getErrorMessage(err, "Couldn't load your dashboard."))
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [])

  // "My Subjects" = the student's top-level folders. The backend already scopes
  // `/folders` to this student's grade/class, so we only drop nested folders.
  const subjects = useMemo(
    () => folders.filter((f) => !f.parentId),
    [folders]
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 sm:py-10">
        {/* Student header card */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <p className="text-sm font-medium text-indigo-600">Welcome back</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            {student ? (
              student.name
            ) : (
              <span className="inline-block h-8 w-40 animate-pulse rounded bg-slate-200 align-middle" />
            )}
          </h1>

          <div className="mt-4 flex flex-wrap gap-2">
            <InfoChip label="Grade" value={gradeName} />
            <InfoChip label="Class" value={className} />
          </div>
        </section>

        {/* My Subjects */}
        <section className="mt-8">
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
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <FolderOpen className="size-6" />
              </div>
              <p className="mt-4 text-sm font-medium text-slate-900">
                No subjects yet
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Your subjects will appear here once your school adds them.
              </p>
            </div>
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
      </div>
    </div>
  )
}

/* -------------------------------- Pieces --------------------------------- */

function InfoChip({ label, value }: { label: string; value: string | null }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm">
      <span className="font-medium text-slate-500">{label}</span>
      <span className="font-semibold text-slate-900">{value ?? "—"}</span>
    </span>
  )
}

function SubjectCard({
  name,
  onClick,
}: {
  name: string
  onClick: () => void
}) {
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
      {/* Folder icon */}
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-100">
        <Folder className="size-5" />
      </span>

      {/* Folder name */}
      <span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-900">
        {name}
      </span>

      {/* Chevron */}
      <ChevronRight className="size-5 shrink-0 text-slate-300 transition-colors group-hover:text-indigo-500" />
    </button>
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
