import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { GraduationCap } from "lucide-react"

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
import { classesApi, gradesApi } from "@/lib/api/services"
import { notify } from "@/lib/toast"
import type { ClassSection } from "@/lib/api/types"

const PAGE_SIZE = 8

const selectClass =
  "h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"

interface ClassFormValues {
  name: string
  gradeId: string
}

export function ClassesPage() {
  const { data, loading, error, refetch } = useResource(() => classesApi.list())
  const gradesRes = useResource(() => gradesApi.list())
  const classes = data ?? []
  const grades = gradesRes.data ?? []

  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<ClassSection | null>(null)
  const [deleting, setDeleting] = useState<ClassSection | null>(null)
  const [busy, setBusy] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } =
    useForm<ClassFormValues>({ defaultValues: { name: "", gradeId: "" } })

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return classes
    return classes.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.grade?.name.toLowerCase().includes(q)
    )
  }, [classes, search])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const pageData = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const openCreate = () => {
    setEditing(null)
    reset({ name: "", gradeId: grades[0]?.id ?? "" })
    setFormOpen(true)
  }
  const openEdit = (cls: ClassSection) => {
    setEditing(cls)
    reset({ name: cls.name, gradeId: cls.gradeId })
    setFormOpen(true)
  }

  const onSubmit = handleSubmit(async ({ name, gradeId }) => {
    setBusy(true)
    try {
      if (editing) {
        await classesApi.update(editing.id, name)
        notify.updated("Class")
      } else {
        if (!gradeId) throw new Error("Please select a grade.")
        await classesApi.create(name, gradeId)
        notify.created("Class")
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
      await classesApi.remove(deleting.id)
      notify.deleted("Class")
      setDeleting(null)
      await refetch()
    } catch (err) {
      notify.error(getErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  const columns: Column<ClassSection>[] = [
    {
      key: "name",
      header: "Class",
      cell: (c) => <span className="font-medium text-slate-900">{c.name}</span>,
    },
    {
      key: "grade",
      header: "Grade",
      cell: (c) => (
        <Badge variant="outline" className="rounded-lg border-slate-200">
          {c.grade?.name ?? "—"}
        </Badge>
      ),
    },
  ]

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <PageHeader
        title="Classes"
        description="Manage class sections within each grade."
        actions={<AddButton label="Add class" onClick={openCreate} />}
      />

      <Toolbar>
        <SearchBar
          value={search}
          onChange={(v) => {
            setSearch(v)
            setPage(1)
          }}
          placeholder="Search classes..."
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
            icon={GraduationCap}
            title="No classes yet"
            description="Add a class section to a grade to get started."
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
        title={editing ? "Edit class" : "Add class"}
        description={
          editing
            ? "Update the class name."
            : "Create a new class section within a grade."
        }
        onSubmit={onSubmit}
        loading={busy}
        submitLabel={editing ? "Save changes" : "Create"}
      >
        <div className="grid gap-2">
          <Label htmlFor="class-name">Class name</Label>
          <Input
            id="class-name"
            placeholder="e.g. Section A"
            aria-invalid={!!errors.name}
            {...register("name", { required: "Class name is required" })}
          />
          {errors.name && (
            <p className="text-xs font-medium text-destructive">{errors.name.message}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="class-grade">Grade</Label>
          <select
            id="class-grade"
            className={selectClass}
            disabled={!!editing || gradesRes.loading}
            {...register("gradeId", { required: !editing })}
          >
            {grades.length === 0 && <option value="">No grades available</option>}
            {grades.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
          {editing && (
            <p className="text-xs text-slate-400">
              Grade can&apos;t be changed after creation.
            </p>
          )}
        </div>
      </FormDialog>

      <DeleteDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Delete class"
        itemLabel={deleting?.name}
        loading={busy}
        onConfirm={confirmDelete}
      />
    </div>
  )
}

export default ClassesPage
