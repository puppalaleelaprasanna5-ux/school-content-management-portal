import { useState, useEffect, useMemo, useCallback } from "react";
import { Plus, Pencil, Trash2, Users } from "lucide-react";

import api from "../../services/api";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Table from "../../components/ui/Table";
import Badge from "../../components/ui/Badge";
import Select from "../../components/ui/Select";
import PageHeader from "../../components/ui/PageHeader";
import EmptyState from "../../components/ui/EmptyState";
import SearchBox from "../../components/ui/SearchBox";
import { useAuth } from "../../context/AuthContext";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

interface Grade {
  id: string;
  name: string;
}

interface ClassSection {
  id: string;
  name: string;
  grade?: Grade;
}

interface Student {
  id: string;
  name: string;
  email: string;
  role: string;
  grade?: Grade;
  class?: ClassSection;
  createdAt: string;
}

interface StudentFormData {
  name: string;
  email: string;
  password: string;
  gradeId: string;
  classId: string;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function StudentsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN" || user?.role === "STAFF";

  const [students, setStudents] = useState<Student[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [classes, setClasses] = useState<ClassSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGrade, setSelectedGrade] = useState<string>("all");
  const [selectedClass, setSelectedClass] = useState<string>("all");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState<StudentFormData>({
    name: "",
    email: "",
    password: "",
    gradeId: "",
    classId: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<Student | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchStudents = useCallback(async () => {
    try {
      const res = await api.get("/students");
      setStudents(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchGrades = useCallback(async () => {
    try {
      const res = await api.get("/grades");
      setGrades(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch grades:", error);
    }
  }, []);

  const fetchClasses = useCallback(async (gradeId: string) => {
    try {
      const res = await api.get("/classes");
      const allClasses = res.data.data || [];
      setClasses(allClasses.filter((cls: ClassSection) => cls.grade?.id === gradeId));
    } catch (error) {
      console.error("Failed to fetch classes:", error);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
    fetchGrades();
  }, [fetchStudents, fetchGrades]);

  useEffect(() => {
    if (selectedGrade && selectedGrade !== "all") {
      fetchClasses(selectedGrade);
    } else {
      setClasses([]);
    }
  }, [selectedGrade, fetchClasses]);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGrade = selectedGrade === "all" || student.grade?.id === selectedGrade;
      const matchesClass = selectedClass === "all" || student.class?.id === selectedClass;
      return matchesSearch && matchesGrade && matchesClass;
    });
  }, [students, searchQuery, selectedGrade, selectedClass]);

  const openModal = (student: Student | null = null) => {
    if (student) {
      setEditingStudent(student);
      setFormData({
        name: student.name,
        email: student.email,
        password: "",
        gradeId: student.grade?.id || "",
        classId: student.class?.id || "",
      });
    } else {
      setEditingStudent(null);
      setFormData({ name: "", email: "", password: "", gradeId: "", classId: "" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
    setFormData({ name: "", email: "", password: "", gradeId: "", classId: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;

    if (!editingStudent && !formData.password.trim()) {
      alert("Password is required for new students");
      return;
    }

    setSubmitting(true);
    try {
      if (editingStudent) {
        await api.put(`/students/${editingStudent.id}`, {
          name: formData.name,
          email: formData.email,
          gradeId: formData.gradeId || null,
          classId: formData.classId || null,
        });
      } else {
        await api.post("/students", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          gradeId: formData.gradeId || null,
          classId: formData.classId || null,
        });
      }
      await fetchStudents();
      closeModal();
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error("Failed to save student:", error);
      alert(apiError.response?.data?.message || "Failed to save student");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;

    setDeleting(true);
    try {
      await api.delete(`/students/${deleteConfirm.id}`);
      await fetchStudents();
      setDeleteConfirm(null);
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error("Failed to delete student:", error);
      alert(apiError.response?.data?.message || "Failed to delete student");
    } finally {
      setDeleting(false);
    }
  };

  const handleGradeChange = (gradeId: string) => {
    setSelectedGrade(gradeId);
    setSelectedClass("all");
    if (editingStudent) {
      setFormData({ ...formData, gradeId, classId: "" });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  };

  const columns = [
    {
      key: "name",
      header: "Student",
      cell: (item: Student) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-xs font-semibold text-white">
            {getInitials(item.name)}
          </div>
          <div className="min-w-0">
            <div className="font-medium text-slate-900">{item.name}</div>
            <div className="truncate text-xs text-slate-500">{item.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "grade",
      header: "Grade",
      cell: (item: Student) =>
        item.grade?.name ? (
          <Badge tone="indigo">{item.grade.name}</Badge>
        ) : (
          <span className="text-sm text-slate-400">—</span>
        ),
    },
    {
      key: "class",
      header: "Class",
      cell: (item: Student) => (
        <span className="text-sm text-slate-600">{item.class?.name || "—"}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: () => (
        <Badge tone="emerald" dot>
          Active
        </Badge>
      ),
    },
    {
      key: "createdAt",
      header: "Added",
      cell: (item: Student) => (
        <span className="text-sm text-slate-600">{formatDate(item.createdAt)}</span>
      ),
    },
    {
      key: "actions",
      header: "",
      cell: (item: Student) =>
        isAdmin ? (
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => openModal(item)}
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              aria-label={`Edit ${item.name}`}
            >
              <Pencil size={16} />
            </button>
            <button
              type="button"
              onClick={() => setDeleteConfirm(item)}
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
              aria-label={`Delete ${item.name}`}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ) : null,
      className: "text-right",
    },
  ];

  const hasFilters = !!searchQuery || selectedGrade !== "all" || selectedClass !== "all";

  const emptyState = (
    <EmptyState
      icon={Users}
      title="No students found"
      description={
        hasFilters
          ? "Try adjusting your search or filters."
          : isAdmin
          ? "Add your first student to get started."
          : "No students have been added yet."
      }
      action={
        isAdmin && !hasFilters ? (
          <Button type="button" onClick={() => openModal()}>
            <Plus size={18} />
            Add Student
          </Button>
        ) : undefined
      }
    />
  );

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <PageHeader
        title="Students"
        subtitle="Manage student accounts and information"
        actions={
          isAdmin && (
            <Button type="button" onClick={() => openModal()}>
              <Plus size={18} />
              Add Student
            </Button>
          )
        }
      />

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBox
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search students…"
          className="w-full sm:max-w-sm"
        />

        <div className="flex flex-wrap items-center gap-3">
          <Select
            aria-label="Filter by grade"
            value={selectedGrade}
            onChange={(e) => handleGradeChange(e.target.value)}
            wrapperClassName="w-full sm:w-44"
          >
            <option value="all">All Grades</option>
            {grades.map((grade) => (
              <option key={grade.id} value={grade.id}>
                {grade.name}
              </option>
            ))}
          </Select>

          <Select
            aria-label="Filter by class"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            disabled={selectedGrade === "all"}
            wrapperClassName="w-full sm:w-44"
          >
            <option value="all">All Classes</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <Table columns={columns} data={filteredStudents} loading={loading} emptyState={emptyState} />

      {/* Add/Edit Student Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingStudent ? "Edit Student" : "Add New Student"}
        size="sm"
        footer={
          <>
            <Button type="button" onClick={closeModal} variant="secondary" size="sm">
              Cancel
            </Button>
            <Button type="submit" onClick={handleSubmit} loading={submitting} size="sm">
              {editingStudent ? "Save Changes" : "Add Student"}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="student-name" className="mb-1.5 block text-sm font-medium text-slate-700">
              Full Name
            </label>
            <Input
              id="student-name"
              type="text"
              placeholder="e.g., John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label htmlFor="student-email" className="mb-1.5 block text-sm font-medium text-slate-700">
              Email
            </label>
            <Input
              id="student-email"
              type="email"
              placeholder="e.g., john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          {!editingStudent && (
            <div>
              <label htmlFor="student-password" className="mb-1.5 block text-sm font-medium text-slate-700">
                Password
              </label>
              <Input
                id="student-password"
                type="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
          )}

          <div>
            <label htmlFor="grade-select" className="mb-1.5 block text-sm font-medium text-slate-700">
              Grade
            </label>
            <Select
              id="grade-select"
              value={formData.gradeId}
              onChange={(e) => handleGradeChange(e.target.value)}
              wrapperClassName="w-full"
            >
              <option value="">Select a grade (optional)</option>
              {grades.map((grade) => (
                <option key={grade.id} value={grade.id}>
                  {grade.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label htmlFor="class-select" className="mb-1.5 block text-sm font-medium text-slate-700">
              Class
            </label>
            <Select
              id="class-select"
              value={formData.classId}
              onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
              disabled={!formData.gradeId}
              wrapperClassName="w-full"
            >
              <option value="">Select a class (optional)</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </Select>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Student"
        size="sm"
        footer={
          <>
            <Button type="button" onClick={() => setDeleteConfirm(null)} variant="secondary" size="sm">
              Cancel
            </Button>
            <Button type="button" onClick={handleDelete} disabled={deleting} variant="danger" size="sm">
              {deleting ? "Deleting…" : "Delete"}
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-slate-600">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-slate-900">{deleteConfirm?.name}</span>?
          </p>
          <p className="text-xs text-slate-500">
            This action cannot be undone. The student's account will be permanently removed.
          </p>
        </div>
      </Modal>
    </div>
  );
}
