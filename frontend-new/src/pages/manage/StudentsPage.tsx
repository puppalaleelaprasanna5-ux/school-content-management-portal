import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { Users } from "lucide-react"

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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/auth/PasswordInput"
import { useResource } from "@/hooks/useResource"
import { getErrorMessage } from "@/lib/api/client"
import { classesApi, gradesApi, studentsApi } from "@/lib/api/services"
import { notify } from "@/lib/toast"
import type { Student } from "@/lib/api/types"

const PAGE_SIZE = 8
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const selectClass =
  "h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"

interface StudentFormValues {
  name: string
  email: string
  password: string
  gradeId: string
  classId: string
}

function initials(name: string) {
  return name.split(/\s+/).map((p) => p[0] ?? "").join("").slice(0, 2).toUpperCase()
}

export function StudentsPage() {
  const { data, loading, error, refetch } = useResource(() => studentsApi.list())
  const gradesRes = useResource(() => gradesApi.list())
  const classesRes = useResource(() => classesApi.list())
  const students = data ?? []
  const grades = gradesRes.data ?? []
  const classes = classesRes.data ?? []

  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Student | null>(null)
  const [deleting, setDeleting] = useState<Student | null>(null)
  const [busy, setBusy] = useState(false)

  const { register, handleSubmit, reset, watch, formState: { errors } } =
    useForm<StudentFormValues>({
      defaultValues: { name: "", email: "", password: "", gradeId: "", classId: "" },
    })

  const selectedGrade = watch("gradeId")
  const classOptions = selectedGrade
    ? classes.filter((c) => c.gradeId === selectedGrade)
    : classes

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return students
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)
    )
  }, [students, search])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const pageData = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const openCreate = () => {
    setEditing(null)
    reset({ name: "", email: "", password: "", gradeId: "", classId: "" })
    setFormOpen(true)
  }
  const openEdit = (student: Student) => {
    setEditing(student)
    reset({
      name: student.name,
      email: student.email,
      password: "",
      gradeId: student.gradeId ?? "",
      classId: student.classId ?? "",
    })
    setFormOpen(true)
  }

  const onSubmit = handleSubmit(async (values) => {
    setBusy(true)
    try {
      const common = {
        name: values.name,
        email: values.email,
        gradeId: values.gradeId || undefined,
        classId: values.classId || undefined,
      }
      if (editing) {
        await studentsApi.update(editing.id, common)
        notify.updated("Student")
      } else {
        await studentsApi.create({ ...common, password: values.password })
        notify.created("Student")
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
      await studentsApi.remove(deleting.id)
      notify.deleted("Student")
      setDeleting(null)
      await refetch()
    } catch (err) {
      notify.error(getErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  const columns: Column<Student>[] = [
    {
      key: "name",
      header: "Student",
      cell: (s) => (
        <div className="flex items-center gap-3">
          <Avatar size="sm">
            <AvatarFallback className="bg-indigo-50 text-xs font-medium text-indigo-600">
              {initials(s.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-medium text-slate-900">{s.name}</p>
            <p className="truncate text-xs text-slate-400">{s.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "grade",
      header: "Grade",
      cell: (s) => (
        <Badge variant="outline" className="rounded-lg border-slate-200">
          {s.grade?.name ?? "—"}
        </Badge>
      ),
    },
    {
      key: "class",
      header: "Class",
      cell: (s) => <span className="text-slate-600">{s.class?.name ?? "—"}</span>,
    },
  ]

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <PageHeader
        title="Students"
        description="Manage enrolled students across grades and classes."
        actions={<AddButton label="Add student" onClick={openCreate} />}
      />

      <Toolbar>
        <SearchBar
          value={search}
          onChange={(v) => {
            setSearch(v)
            setPage(1)
          }}
          placeholder="Search by name or email..."
        />
      </Toolbar>

      <DataTable
        columns={columns}
        data={pageData}
        getRowId={(s) => s.id}
        loading={loading}
        error={error}
        onRetry={refetch}
        onEdit={openEdit}
        onDelete={setDeleting}
        emptyState={
          <EmptyState
            icon={Users}
            title="No students yet"
            description="Add your first student to start managing enrollments."
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
        title={editing ? "Edit student" : "Add student"}
        description={
          editing ? "Update this student's details." : "Enroll a new student."
        }
        onSubmit={onSubmit}
        loading={busy}
        submitLabel={editing ? "Save changes" : "Create"}
      >
        <div className="grid gap-2">
          <Label htmlFor="student-name">Full name</Label>
          <Input
            id="student-name"
            aria-invalid={!!errors.name}
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && (
            <p className="text-xs font-medium text-destructive">{errors.name.message}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="student-email">Email</Label>
          <Input
            id="student-email"
            type="email"
            aria-invalid={!!errors.email}
            {...register("email", {
              required: "Email is required",
              pattern: { value: EMAIL_PATTERN, message: "Enter a valid email" },
            })}
          />
          {errors.email && (
            <p className="text-xs font-medium text-destructive">{errors.email.message}</p>
          )}
        </div>
        {!editing && (
          <div className="grid gap-2">
            <Label htmlFor="student-password">Password</Label>
            <PasswordInput
              id="student-password"
              autoComplete="new-password"
              aria-invalid={!!errors.password}
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "At least 6 characters" },
              })}
            />
            {errors.password && (
              <p className="text-xs font-medium text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-2">
            <Label htmlFor="student-grade">Grade</Label>
            <select id="student-grade" className={selectClass} {...register("gradeId")}>
              <option value="">Unassigned</option>
              {grades.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="student-class">Class</Label>
            <select id="student-class" className={selectClass} {...register("classId")}>
              <option value="">Unassigned</option>
              {classOptions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </FormDialog>

      <DeleteDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Delete student"
        itemLabel={deleting?.name}
        loading={busy}
        onConfirm={confirmDelete}
      />
    </div>
  )
}

export default StudentsPage
