import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { FolderOpen } from "lucide-react"

import {
  PageHeader,
  Toolbar,
  SearchBar,
  AddButton,
  DataTable,
  Pagination,
  EmptyState,
  DeleteDialog,
  FormDialog,
  type Column,
} from "@/components/crud"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useResource } from "@/hooks/useResource"
import { getErrorMessage } from "@/lib/api/client"
import { classesApi, foldersApi, gradesApi } from "@/lib/api/services"
import { notify } from "@/lib/toast"
import type { Folder } from "@/lib/api/types"

const PAGE_SIZE = 8
const selectClass =
  "h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"

interface FolderFormValues {
  name: string
  gradeId: string
  classId: string
  parentId: string
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value))
}

export function FoldersPage() {
  const { data, loading, error, refetch } = useResource(() => foldersApi.list())
  const gradesRes = useResource(() => gradesApi.list())
  const classesRes = useResource(() => classesApi.list())
  const folders = data ?? []
  const grades = gradesRes.data ?? []
  const classes = classesRes.data ?? []

  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Folder | null>(null)
  const [deleting, setDeleting] = useState<Folder | null>(null)
  const [busy, setBusy] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } =
    useForm<FolderFormValues>({
      defaultValues: { name: "", gradeId: "", classId: "", parentId: "" },
    })

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return q ? folders.filter((f) => f.name.toLowerCase().includes(q)) : folders
  }, [folders, search])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const pageData = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const openCreate = () => {
    setEditing(null)
    reset({ name: "", gradeId: "", classId: "", parentId: "" })
    setFormOpen(true)
  }
  const openEdit = (folder: Folder) => {
    setEditing(folder)
    reset({
      name: folder.name,
      gradeId: folder.gradeId ?? "",
      classId: folder.classId ?? "",
      parentId: folder.parentId ?? "",
    })
    setFormOpen(true)
  }

  const onSubmit = handleSubmit(async (values) => {
    setBusy(true)
    try {
      if (editing) {
        await foldersApi.update(editing.id, values.name)
        notify.updated("Folder")
      } else {
        await foldersApi.create({
          name: values.name,
          gradeId: values.gradeId || undefined,
          classId: values.classId || undefined,
          parentId: values.parentId || undefined,
        })
        notify.created("Folder")
      }
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
      await foldersApi.remove(deleting.id)
      notify.deleted("Folder")
      setDeleting(null)
      await refetch()
    } catch (err) {
      notify.error(getErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  const columns: Column<Folder>[] = [
    {
      key: "name",
      header: "Folder",
      cell: (f) => (
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <FolderOpen className="size-4" />
          </span>
          <span className="font-medium text-slate-900">{f.name}</span>
        </div>
      ),
    },
    {
      key: "grade",
      header: "Grade",
      cell: (f) => <span className="text-slate-600">{f.grade?.name ?? "—"}</span>,
    },
    {
      key: "contents",
      header: "Items",
      cell: (f) => (
        <Badge variant="outline" className="rounded-lg border-slate-200">
          {f.contents?.length ?? 0}
        </Badge>
      ),
    },
    {
      key: "created",
      header: "Created",
      align: "right",
      cell: (f) => <span className="text-slate-500">{formatDate(f.createdAt)}</span>,
    },
  ]

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <PageHeader
        title="Folders"
        description="Organize your content into folders by grade and class."
        actions={<AddButton label="New folder" onClick={openCreate} />}
      />

      <Toolbar>
        <SearchBar
          value={search}
          onChange={(v) => {
            setSearch(v)
            setPage(1)
          }}
          placeholder="Search folders..."
        />
      </Toolbar>

      <DataTable
        columns={columns}
        data={pageData}
        getRowId={(f) => f.id}
        loading={loading}
        error={error}
        onRetry={refetch}
        onEdit={openEdit}
        onDelete={setDeleting}
        emptyState={
          <EmptyState
            icon={FolderOpen}
            title="No folders yet"
            description="Create a folder to start organizing your content."
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
        title={editing ? "Rename folder" : "New folder"}
        description={
          editing
            ? "Update the folder name."
            : "Create a folder to organize content."
        }
        onSubmit={onSubmit}
        loading={busy}
        submitLabel={editing ? "Save changes" : "Create"}
      >
        <div className="grid gap-2">
          <Label htmlFor="folder-name">Folder name</Label>
          <Input
            id="folder-name"
            placeholder="e.g. Mathematics"
            aria-invalid={!!errors.name}
            {...register("name", { required: "Folder name is required" })}
          />
          {errors.name && (
            <p className="text-xs font-medium text-destructive">{errors.name.message}</p>
          )}
        </div>

        {!editing && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="folder-grade">Grade (optional)</Label>
                <select id="folder-grade" className={selectClass} {...register("gradeId")}>
                  <option value="">None</option>
                  {grades.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="folder-class">Class (optional)</Label>
                <select id="folder-class" className={selectClass} {...register("classId")}>
                  <option value="">None</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="folder-parent">Parent folder (optional)</Label>
              <select id="folder-parent" className={selectClass} {...register("parentId")}>
                <option value="">None (top level)</option>
                {folders.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
      </FormDialog>

      <DeleteDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Delete folder"
        itemLabel={deleting?.name}
        description="Deleting this folder removes its subfolders and content. This cannot be undone."
        loading={busy}
        onConfirm={confirmDelete}
      />
    </div>
  )
}

export default FoldersPage
