import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { FileText, FileType2, Video, FileCode } from "lucide-react"

import {
  PageHeader,
  Toolbar,
  SearchBar,
  Filters,
  AddButton,
  DataTable,
  Pagination,
  EmptyState,
  DeleteDialog,
  FormDialog,
  type Column,
  type FilterConfig,
} from "@/components/crud"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useResource } from "@/hooks/useResource"
import { getErrorMessage } from "@/lib/api/client"
import { contentApi, foldersApi } from "@/lib/api/services"
import { notify } from "@/lib/toast"
import { cn } from "@/lib/utils"
import type { Content, ContentType } from "@/lib/api/types"

const PAGE_SIZE = 8
const selectClass =
  "h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"

const typeStyles: Record<ContentType, { badge: string; icon: typeof FileType2 }> = {
  PDF: { badge: "bg-rose-50 text-rose-600", icon: FileType2 },
  VIDEO: { badge: "bg-violet-50 text-violet-600", icon: Video },
  TEXT: { badge: "bg-blue-50 text-blue-600", icon: FileCode },
}

const filterConfigs: FilterConfig[] = [
  {
    key: "type",
    label: "Type",
    options: [
      { label: "All types", value: "all" },
      { label: "PDF", value: "PDF" },
      { label: "Video", value: "VIDEO" },
      { label: "Text", value: "TEXT" },
    ],
  },
]

interface ContentFormValues {
  title: string
  description: string
  type: ContentType
  folderId: string
  textContent: string
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value))
}

export function ContentPage() {
  const { data, loading, error, refetch } = useResource(() => contentApi.list())
  const foldersRes = useResource(() => foldersApi.list())
  const contents = data ?? []
  const folders = foldersRes.data ?? []

  const [search, setSearch] = useState("")
  const [filterValues, setFilterValues] = useState<Record<string, string>>({ type: "all" })
  const [page, setPage] = useState(1)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Content | null>(null)
  const [deleting, setDeleting] = useState<Content | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const { register, handleSubmit, reset, watch, formState: { errors } } =
    useForm<ContentFormValues>({
      defaultValues: { title: "", description: "", type: "PDF", folderId: "", textContent: "" },
    })

  const currentType = watch("type")

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return contents.filter((c) => {
      const matchesSearch = !q || c.title.toLowerCase().includes(q)
      const matchesType = filterValues.type === "all" || c.type === filterValues.type
      return matchesSearch && matchesType
    })
  }, [contents, search, filterValues])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const pageData = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const openCreate = () => {
    setEditing(null)
    setFile(null)
    setFileError(null)
    reset({ title: "", description: "", type: "PDF", folderId: folders[0]?.id ?? "", textContent: "" })
    setFormOpen(true)
  }
  const openEdit = (item: Content) => {
    setEditing(item)
    setFile(null)
    setFileError(null)
    reset({
      title: item.title,
      description: item.description ?? "",
      type: item.type,
      folderId: item.folderId,
      textContent: item.textContent ?? "",
    })
    setFormOpen(true)
  }

  const onSubmit = handleSubmit(async (values) => {
    setFileError(null)
    // Editing only updates text fields (backend accepts title/description/textContent).
    if (editing) {
      setBusy(true)
      try {
        await contentApi.update(editing.id, {
          title: values.title,
          description: values.description,
          textContent: values.textContent,
        })
        notify.updated("Content")
        setFormOpen(false)
        await refetch()
      } catch (err) {
        notify.error(getErrorMessage(err))
      } finally {
        setBusy(false)
      }
      return
    }

    if (!values.folderId) {
      setFileError("Please select a folder.")
      return
    }
    if (values.type === "TEXT" && !values.textContent.trim()) {
      setFileError("Text content is required for text items.")
      return
    }
    if (values.type !== "TEXT" && !file) {
      setFileError("Please choose a file to upload.")
      return
    }

    const form = new FormData()
    form.append("title", values.title)
    form.append("description", values.description)
    form.append("type", values.type)
    form.append("folderId", values.folderId)
    if (values.type === "TEXT") {
      form.append("textContent", values.textContent)
    } else if (file) {
      form.append("file", file)
    }

    setBusy(true)
    try {
      await contentApi.create(form)
      notify.created("Content")
      setFormOpen(false)
      await refetch()
    } catch (err) {
      notify.error(getErrorMessage(err))
    } finally {
      setBusy(false)
    }
  })

  const confirmDelete = async () => {
    if (!deleting) return
    setBusy(true)
    try {
      await contentApi.remove(deleting.id)
      notify.deleted("Content")
      setDeleting(null)
      await refetch()
    } catch (err) {
      notify.error(getErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  const columns: Column<Content>[] = [
    {
      key: "title",
      header: "Title",
      cell: (c) => {
        const Icon = typeStyles[c.type].icon
        return (
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "flex size-9 items-center justify-center rounded-lg",
                typeStyles[c.type].badge
              )}
            >
              <Icon className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="truncate font-medium text-slate-900">{c.title}</p>
              {c.description && (
                <p className="truncate text-xs text-slate-400">{c.description}</p>
              )}
            </div>
          </div>
        )
      },
    },
    {
      key: "type",
      header: "Type",
      cell: (c) => (
        <span
          className={cn(
            "inline-flex rounded-lg px-2 py-0.5 text-xs font-medium",
            typeStyles[c.type].badge
          )}
        >
          {c.type}
        </span>
      ),
    },
    {
      key: "folder",
      header: "Folder",
      cell: (c) => <span className="text-slate-600">{c.folder?.name ?? "—"}</span>,
    },
    {
      key: "uploader",
      header: "Uploaded by",
      cell: (c) => <span className="text-slate-600">{c.uploadedBy?.name ?? "—"}</span>,
    },
    {
      key: "created",
      header: "Date",
      align: "right",
      cell: (c) => <span className="text-slate-500">{formatDate(c.createdAt)}</span>,
    },
  ]

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <PageHeader
        title="Content"
        description="Upload and manage learning materials across your folders."
        actions={<AddButton label="Upload content" onClick={openCreate} />}
      />

      <Toolbar
        actions={
          <Filters
            filters={filterConfigs}
            values={filterValues}
            onChange={(key, value) => {
              setFilterValues((prev) => ({ ...prev, [key]: value }))
              setPage(1)
            }}
          />
        }
      >
        <SearchBar
          value={search}
          onChange={(v) => {
            setSearch(v)
            setPage(1)
          }}
          placeholder="Search content..."
        />
      </Toolbar>

      <DataTable
        columns={columns}
        data={pageData}
        getRowId={(c) => c.id}
        loading={loading}
        error={error}
        onRetry={refetch}
        onEdit={openEdit}
        onDelete={setDeleting}
        emptyState={
          <EmptyState
            icon={FileText}
            title="No content yet"
            description="Upload PDFs, videos or text lessons to your folders."
          />
        }
      />

      {!loading && !error && filtered.length > 0 && (
        <Pagination
          page={currentPage}
          pageSize={PAGE_SIZE}
          total={filtered.length}
          onPageChange={setPage}
        />
      )}

      <FormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editing ? "Edit content" : "Upload content"}
        description={
          editing
            ? "Update the details for this item."
            : "Add a PDF, video or text lesson."
        }
        onSubmit={onSubmit}
        loading={busy}
        submitLabel={editing ? "Save changes" : "Upload"}
      >
        <div className="grid gap-2">
          <Label htmlFor="content-title">Title</Label>
          <Input
            id="content-title"
            aria-invalid={!!errors.title}
            {...register("title", { required: "Title is required" })}
          />
          {errors.title && (
            <p className="text-xs font-medium text-destructive">{errors.title.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="content-description">Description</Label>
          <Input id="content-description" {...register("description")} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-2">
            <Label htmlFor="content-type">Type</Label>
            <select
              id="content-type"
              className={selectClass}
              disabled={!!editing}
              {...register("type")}
            >
              <option value="PDF">PDF</option>
              <option value="VIDEO">Video</option>
              <option value="TEXT">Text</option>
            </select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="content-folder">Folder</Label>
            <select
              id="content-folder"
              className={selectClass}
              disabled={!!editing || foldersRes.loading}
              {...register("folderId")}
            >
              {folders.length === 0 && <option value="">No folders available</option>}
              {folders.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {currentType === "TEXT" ? (
          <div className="grid gap-2">
            <Label htmlFor="content-text">Text content</Label>
            <textarea
              id="content-text"
              rows={4}
              className="w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              {...register("textContent")}
            />
          </div>
        ) : (
          !editing && (
            <div className="grid gap-2">
              <Label htmlFor="content-file">File</Label>
              <input
                id="content-file"
                type="file"
                accept={currentType === "PDF" ? "application/pdf" : "video/*"}
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="block w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm text-slate-600 outline-none file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-3 file:py-1 file:text-sm file:font-medium file:text-indigo-600 hover:file:bg-indigo-100"
              />
              <p className="text-xs text-slate-400">
                {currentType === "PDF" ? "PDF up to 100MB." : "MP4/WebM up to 100MB."}
              </p>
            </div>
          )
        )}

        {fileError && (
          <p className="text-xs font-medium text-destructive">{fileError}</p>
        )}
      </FormDialog>

      <DeleteDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Delete content"
        itemLabel={deleting?.title}
        loading={busy}
        onConfirm={confirmDelete}
      />
    </div>
  )
}

export default ContentPage
