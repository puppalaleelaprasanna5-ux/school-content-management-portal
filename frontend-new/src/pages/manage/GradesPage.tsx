import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { Layers } from "lucide-react"

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
import { useAuth } from "@/context/AuthContext"
import { useResource } from "@/hooks/useResource"
import { getErrorMessage } from "@/lib/api/client"
import { gradesApi } from "@/lib/api/services"
import { notify } from "@/lib/toast"
import type { Grade } from "@/lib/api/types"

const PAGE_SIZE = 8

export function GradesPage() {
  const { user } = useAuth()
  const { data, loading, error, refetch } = useResource(() => gradesApi.list())
  const grades = data ?? []

  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Grade | null>(null)
  const [deleting, setDeleting] = useState<Grade | null>(null)
  const [busy, setBusy] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } =
    useForm<{ name: string }>({ defaultValues: { name: "" } })

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return q ? grades.filter((g) => g.name.toLowerCase().includes(q)) : grades
  }, [grades, search])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const pageData = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const openCreate = () => {
    setEditing(null)
    reset({ name: "" })
    setFormOpen(true)
  }
  const openEdit = (grade: Grade) => {
    setEditing(grade)
    reset({ name: grade.name })
    setFormOpen(true)
  }

  const onSubmit = handleSubmit(async ({ name }) => {
    setBusy(true)
    try {
      if (editing) {
        await gradesApi.update(editing.id, name)
        notify.updated("Grade")
      } else {
        if (!user?.schoolId) throw new Error("No school context found.")
        await gradesApi.create(name, user.schoolId)
        notify.created("Grade")
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
      await gradesApi.remove(deleting.id)
      notify.deleted("Grade")
      setDeleting(null)
      await refetch()
    } catch (err) {
      notify.error(getErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  const columns: Column<Grade>[] = [
    {
      key: "name",
      header: "Grade",
      cell: (g) => <span className="font-medium text-slate-900">{g.name}</span>,
    },
    {
      key: "classes",
      header: "Classes",
      cell: (g) => (
        <Badge variant="outline" className="rounded-lg border-slate-200">
          {g.classes?.length ?? 0}
        </Badge>
      ),
    },
  ]

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <PageHeader
        title="Grades"
        description="Manage the grade levels in your school."
        actions={<AddButton label="Add grade" onClick={openCreate} />}
      />

      <Toolbar>
        <SearchBar
          value={search}
          onChange={(v) => {
            setSearch(v)
            setPage(1)
          }}
          placeholder="Search grades..."
        />
      </Toolbar>

      <DataTable
        columns={columns}
        data={pageData}
        getRowId={(g) => g.id}
        loading={loading}
        error={error}
        onRetry={refetch}
        onEdit={openEdit}
        onDelete={setDeleting}
        emptyState={
          <EmptyState
            icon={Layers}
            title="No grades yet"
            description="Create your first grade to start organizing classes."
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
        title={editing ? "Edit grade" : "Add grade"}
        description={editing ? "Update the grade name." : "Create a new grade level."}
        onSubmit={onSubmit}
        loading={busy}
        submitLabel={editing ? "Save changes" : "Create"}
      >
        <div className="grid gap-2">
          <Label htmlFor="grade-name">Grade name</Label>
          <Input
            id="grade-name"
            placeholder="e.g. Grade 7"
            aria-invalid={!!errors.name}
            {...register("name", { required: "Grade name is required" })}
          />
          {errors.name && (
            <p className="text-xs font-medium text-destructive">{errors.name.message}</p>
          )}
        </div>
      </FormDialog>

      <DeleteDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Delete grade"
        itemLabel={deleting?.name}
        description="Deleting this grade will also remove its classes and related data. This cannot be undone."
        loading={busy}
        onConfirm={confirmDelete}
      />
    </div>
  )
}

export default GradesPage
