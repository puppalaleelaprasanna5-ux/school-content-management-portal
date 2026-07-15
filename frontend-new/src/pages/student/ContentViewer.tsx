import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeft,
  ChevronRight,
  ExternalLink,
  FileWarning,
  TriangleAlert,
} from "lucide-react"

import { contentApi } from "@/lib/api/services"
import { fileUrl, getErrorMessage } from "@/lib/api/client"
import type { Content } from "@/lib/api/types"

/**
 * Student Content Viewer — read-only.
 *
 * Loads a single content item via the existing `GET /content/:id` and renders
 * it by type: an embedded PDF viewer, a responsive HTML5 video player, or
 * formatted text. No editing, deleting or uploading — viewing only.
 */
export function ContentViewer() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [content, setContent] = useState<Content | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let active = true
    setLoading(true)
    setError(null)

    contentApi
      .getById(id)
      .then((data) => {
        if (active) setContent(data)
      })
      .catch((err) => {
        if (active) setError(getErrorMessage(err, "Couldn't load this content."))
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [id])

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
        {/* Back to the folder this content lives in */}
        <button
          type="button"
          onClick={() =>
            content
              ? navigate(`/student/folder/${content.folderId}`)
              : navigate("/student/dashboard")
          }
          className="inline-flex items-center gap-1.5 rounded-lg text-sm font-medium text-slate-500 transition-colors hover:text-indigo-600"
        >
          <ArrowLeft className="size-4" />
          {content ? "Back to Folder" : "Dashboard"}
        </button>

        {/* Breadcrumb: Dashboard > Folder > Title */}
        {content && (
          <nav aria-label="Breadcrumb" className="mt-3">
            <ol className="flex flex-wrap items-center gap-1 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => navigate("/student/dashboard")}
                  className="rounded-md px-1.5 py-0.5 font-medium text-slate-500 transition-colors hover:text-indigo-600"
                >
                  Dashboard
                </button>
              </li>
              {content.folder && (
                <li className="flex items-center gap-1">
                  <ChevronRight className="size-3.5 text-slate-300" />
                  <button
                    type="button"
                    onClick={() => navigate(`/student/folder/${content.folderId}`)}
                    className="rounded-md px-1.5 py-0.5 font-medium text-slate-500 transition-colors hover:text-indigo-600"
                  >
                    {content.folder.name.trim()}
                  </button>
                </li>
              )}
              <li className="flex items-center gap-1">
                <ChevronRight className="size-3.5 text-slate-300" />
                <span
                  aria-current="page"
                  className="rounded-md px-1.5 py-0.5 font-semibold text-slate-900"
                >
                  {content.title}
                </span>
              </li>
            </ol>
          </nav>
        )}

        {loading ? (
          <ViewerSkeleton />
        ) : error ? (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" />
            <span>{error}</span>
          </div>
        ) : content ? (
          <article className="mt-4">
            {/* Header */}
            <header className="border-b border-slate-200 pb-5">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                {content.title}
              </h1>
              {content.description && (
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {content.description}
                </p>
              )}
            </header>

            {/* Body */}
            <div className="mt-6">
              <ContentBody content={content} />
            </div>
          </article>
        ) : null}
      </div>
    </div>
  )
}

/* -------------------------------- Body ----------------------------------- */

function ContentBody({ content }: { content: Content }) {
  switch (content.type) {
    case "PDF":
      return content.filePath ? (
        <PdfViewer src={fileUrl(content.filePath)} title={content.title} />
      ) : (
        <MissingFile />
      )

    case "VIDEO":
      return content.filePath ? (
        <VideoPlayer src={fileUrl(content.filePath)} />
      ) : (
        <MissingFile />
      )

    case "TEXT":
      return <TextContent text={content.textContent ?? ""} />

    default:
      return <MissingFile />
  }
}

function PdfViewer({ src, title }: { src: string; title: string }) {
  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <iframe
          src={src}
          title={title}
          className="h-[70vh] w-full sm:h-[78vh]"
        />
      </div>
      <a
        href={src}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700"
      >
        <ExternalLink className="size-4" />
        Open in new tab
      </a>
    </div>
  )
}

function VideoPlayer({ src }: { src: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-black shadow-sm">
      <video
        src={src}
        controls
        playsInline
        controlsList="nodownload"
        className="aspect-video w-full"
      >
        Your browser doesn't support embedded video.
      </video>
    </div>
  )
}

function TextContent({ text }: { text: string }) {
  if (!text.trim()) return <MissingFile label="This item has no text content." />

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      {/* Preserve the author's line breaks/spacing without rendering raw HTML. */}
      <p className="whitespace-pre-wrap text-[15px] leading-7 text-slate-700">
        {text}
      </p>
    </div>
  )
}

function MissingFile({ label = "This file isn't available." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <FileWarning className="size-6" />
      </div>
      <p className="mt-4 text-sm font-medium text-slate-900">{label}</p>
    </div>
  )
}

function ViewerSkeleton() {
  return (
    <div className="mt-4 animate-pulse">
      <div className="h-8 w-2/3 rounded bg-slate-200" />
      <div className="mt-3 h-4 w-full rounded bg-slate-100" />
      <div className="mt-2 h-4 w-4/5 rounded bg-slate-100" />
      <div className="mt-6 h-[60vh] w-full rounded-2xl bg-slate-100" />
    </div>
  )
}

export default ContentViewer
