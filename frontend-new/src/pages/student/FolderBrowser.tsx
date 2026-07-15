import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { motion, type Variants } from "framer-motion"
import {
  ArrowLeft,
  ChevronRight,
  FileText,
  Folder,
  FolderOpen,
  Home,
  NotebookText,
  PlayCircle,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react"

import { foldersApi } from "@/lib/api/services"
import { getErrorMessage } from "@/lib/api/client"
import type {
  Content,
  ContentType,
  Folder as FolderType,
} from "@/lib/api/types"
import { cn } from "@/lib/utils"

/**
 * Student Folder Browser — read-only.
 *
 * Loads a single folder via the existing `GET /folders/:id`, showing its
 * sub-folders first, then its (published) files. Sub-folders open deeper in
 * the browser; files navigate to `/student/content/:id`. Breadcrumb is built
 * from the folder's parent chain. No create/edit/delete/upload actions.
 */
export function FolderBrowser() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [folder, setFolder] = useState<FolderType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let active = true
    setLoading(true)
    setError(null)
    setFolder(null) // drop the previous folder so its data can't linger

    foldersApi
      .getById(id)
      .then((data) => {
        if (active) setFolder(data)
      })
      .catch((err) => {
        if (active) setError(getErrorMessage(err, "Couldn't open this folder."))
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [id])

  // Only ever show the folder that matches the current URL. During navigation
  // the previous folder can still be in state for a render; guarding on the id
  // guarantees we never render another folder's children/content.
  const current = folder && folder.id === id ? folder : null

  const subFolders = useMemo(() => current?.children ?? [], [current])
  // Students only see published content.
  const files = useMemo(
    () => (current?.contents ?? []).filter((c) => c.published),
    [current]
  )

  const isEmpty =
    !loading && !error && !!current && subFolders.length === 0 && files.length === 0

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 sm:py-10">
        {/* Back — to the parent folder for a subfolder, else to the dashboard */}
        {current && (
          <button
            type="button"
            onClick={() =>
              navigate(
                current.parent
                  ? `/student/folder/${current.parent.id}`
                  : "/student/dashboard"
              )
            }
            className="mb-3 inline-flex items-center gap-1.5 rounded-lg text-sm font-medium text-slate-500 transition-colors hover:text-indigo-600"
          >
            <ArrowLeft className="size-4" />
            {current.parent ? "Back" : "Dashboard"}
          </button>
        )}

        {/* Breadcrumb */}
        <Breadcrumb folder={current} onNavigate={navigate} />

        {/* Title */}
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          {current?.name ?? (error ? "Folder" : "Loading…")}
        </h1>

        {/* Body */}
        <div className="mt-6">
          {loading || (!current && !error) ? (
            <BrowserSkeleton />
          ) : error ? (
            <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              <TriangleAlert className="mt-0.5 size-4 shrink-0" />
              <span>{error}</span>
            </div>
          ) : isEmpty ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <FolderOpen className="size-6" />
              </div>
              <p className="mt-4 text-sm font-medium text-slate-900">
                This folder is empty
              </p>
              <p className="mt-1 text-sm text-slate-500">
                There's nothing here yet. Check back later.
              </p>
            </div>
          ) : (
            <motion.div
              variants={listVariants}
              initial="hidden"
              animate="show"
              className="space-y-8"
            >
              {/* Folders first */}
              {subFolders.length > 0 && (
                <Section title="Folders">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {subFolders.map((child) => (
                      <FolderCard
                        key={child.id}
                        name={child.name}
                        onClick={() => navigate(`/student/folder/${child.id}`)}
                      />
                    ))}
                  </div>
                </Section>
              )}

              {/* Then files */}
              {files.length > 0 && (
                <Section title="Files">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {files.map((file) => (
                      <FileCard
                        key={file.id}
                        file={file}
                        onClick={() => navigate(`/student/content/${file.id}`)}
                      />
                    ))}
                  </div>
                </Section>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------ Breadcrumb ------------------------------- */

function Breadcrumb({
  folder,
  onNavigate,
}: {
  folder: FolderType | null
  onNavigate: (to: string) => void
}) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1 text-sm">
        <li>
          <button
            type="button"
            onClick={() => onNavigate("/student/dashboard")}
            className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-medium text-slate-500 transition-colors hover:text-indigo-600"
          >
            <Home className="size-3.5" />
            Dashboard
          </button>
        </li>

        {folder?.parent && (
          <li className="flex items-center gap-1">
            <ChevronRight className="size-3.5 text-slate-300" />
            <button
              type="button"
              onClick={() => onNavigate(`/student/folder/${folder.parent!.id}`)}
              className="rounded-md px-1.5 py-0.5 font-medium text-slate-500 transition-colors hover:text-indigo-600"
            >
              {folder.parent.name}
            </button>
          </li>
        )}

        {folder && (
          <li className="flex items-center gap-1">
            <ChevronRight className="size-3.5 text-slate-300" />
            <span
              aria-current="page"
              className="rounded-md px-1.5 py-0.5 font-semibold text-slate-900"
            >
              {folder.name}
            </span>
          </li>
        )}
      </ol>
    </nav>
  )
}

/* -------------------------------- Pieces --------------------------------- */

const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {title}
      </h2>
      {children}
    </section>
  )
}

const cardClasses = cn(
  "group flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-all",
  "hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 active:translate-y-0"
)

function FolderCard({
  name,
  onClick,
}: {
  name: string
  onClick: () => void
}) {
  return (
    <motion.button
      variants={itemVariants}
      type="button"
      onClick={onClick}
      className={cardClasses}
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-100">
        <Folder className="size-5" />
      </span>
      <span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-900">
        {name}
      </span>
      <ChevronRight className="size-5 shrink-0 text-slate-300 transition-colors group-hover:text-indigo-500" />
    </motion.button>
  )
}

/** Per-type icon + accent colour for a file card. */
const FILE_APPEARANCE: Record<
  ContentType,
  { icon: LucideIcon; wrapper: string; label: string }
> = {
  PDF: { icon: FileText, wrapper: "bg-rose-50 text-rose-600", label: "PDF" },
  VIDEO: {
    icon: PlayCircle,
    wrapper: "bg-violet-50 text-violet-600",
    label: "Video",
  },
  TEXT: {
    icon: NotebookText,
    wrapper: "bg-emerald-50 text-emerald-600",
    label: "Text",
  },
}

function FileCard({ file, onClick }: { file: Content; onClick: () => void }) {
  const appearance = FILE_APPEARANCE[file.type]
  const Icon = appearance.icon

  return (
    <motion.button
      variants={itemVariants}
      type="button"
      onClick={onClick}
      className={cardClasses}
    >
      <span
        className={cn(
          "flex size-11 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105",
          appearance.wrapper
        )}
      >
        <Icon className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-slate-900">
          {file.title}
        </span>
        <span className="text-xs font-medium text-slate-400">
          {appearance.label}
        </span>
      </span>
      <ChevronRight className="size-5 shrink-0 text-slate-300 transition-colors group-hover:text-indigo-500" />
    </motion.button>
  )
}

function BrowserSkeleton() {
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

export default FolderBrowser
