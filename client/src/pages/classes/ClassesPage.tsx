import { useState, useEffect, useMemo } from "react";
import { Plus, Pencil, Trash2, Search, GraduationCap, Inbox, ArrowUpDown } from "lucide-react";
import clsx from "clsx";

import api from "../../services/api";
import Table from "../../components/ui/Table";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { useAuth } from "../../context/AuthContext";

interface Grade {
  id: string;
  name: string;
}

interface Class {
  id: string;
  name: string;
  grade: Grade;
}

interface ClassFormData {
  name: string;
  gradeId: string;
}

export default function ClassesPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const [classes, setClasses] = useState<Class[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGrade, setSelectedGrade] = useState<string>("all");
  const [sortField, setSortField] = useState<"name" | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [formData, setFormData] = useState<ClassFormData>({ name: "", gradeId: "" });
  const [submitting, setSubmitting] = useState(false);

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<Class | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch data
  useEffect(() => {
    fetchClasses();
    fetchGrades();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await api.get("/classes");
      setClasses(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch classes:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGrades = async () => {
    try {
      const res = await api.get("/grades");
      setGrades(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch grades:", error);
    }
  };

  // Filter and sort classes
  const filteredClasses = useMemo(() => {
    let result = classes.filter((cls) => {
      const matchesSearch = cls.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGrade = selectedGrade === "all" || cls.grade.id === selectedGrade;
      return matchesSearch && matchesGrade;
    });

    if (sortField === "name") {
      result = result.sort((a, b) => {
        const comparison = a.name.localeCompare(b.name);
        return sortDirection === "asc" ? comparison : -comparison;
      });
    }

    return result;
  }, [classes, searchQuery, selectedGrade, sortField, sortDirection]);

  // Open modal for add/edit
  const openModal = (cls: Class | null = null) => {
    if (cls) {
      setEditingClass(cls);
      setFormData({ name: cls.name, gradeId: cls.grade.id });
    } else {
      setEditingClass(null);
      setFormData({ name: "", gradeId: "" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingClass(null);
    setFormData({ name: "", gradeId: "" });
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.gradeId) return;

    setSubmitting(true);
    try {
      if (editingClass) {
        await api.put(`/classes/${editingClass.id}`, formData);
      } else {
        await api.post("/classes", formData);
      }
      await fetchClasses();
      closeModal();
    } catch (error) {
      console.error("Failed to save class:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deleteConfirm) return;

    setDeleting(true);
    try {
      await api.delete(`/classes/${deleteConfirm.id}`);
      await fetchClasses();
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Failed to delete class:", error);
    } finally {
      setDeleting(false);
    }
  };

  // Handle sort
  const handleSort = (field: "name") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Table columns
  const columns = [
    {
      key: "name",
      header: (
        <button
          type="button"
          onClick={() => handleSort("name")}
          className="flex items-center gap-2 hover:text-slate-700 transition-colors"
        >
          Class Name
          {sortField === "name" && (
            <ArrowUpDown size={14} className={clsx(sortDirection === "asc" ? "rotate-180" : "")} />
          )}
        </button>
      ),
      cell: (item: Class) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <GraduationCap size={18} strokeWidth={1.75} />
          </div>
          <span className="font-medium text-slate-900">{item.name}</span>
        </div>
      ),
    },
    {
      key: "grade",
      header: "Grade",
      cell: (item: Class) => (
        <span className="inline-flex rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
          {item.grade.name}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      cell: (item: Class) => (
        <div className="flex items-center gap-2">
          {isAdmin && (
            <>
              <button
                type="button"
                onClick={() => openModal(item)}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                aria-label="Edit class"
              >
                <Pencil size={16} />
              </button>
              <button
                type="button"
                onClick={() => setDeleteConfirm(item)}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                aria-label="Delete class"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      ),
      className: "text-right",
    },
  ];

  // Empty state
  const emptyState = (
    <div className="flex flex-col items-center justify-center py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
        <Inbox size={22} />
      </div>
      <p className="mt-4 text-sm font-medium text-slate-900">No classes found</p>
      <p className="mt-1 max-w-xs text-sm text-slate-500">
        {searchQuery || selectedGrade !== "all"
          ? "Try adjusting your search or filters"
          : isAdmin
          ? "Create your first class to get started"
          : "No classes have been added yet"}
      </p>
      {isAdmin && !searchQuery && selectedGrade === "all" && (
        <button
          type="button"
          onClick={() => openModal()}
          className="mt-5 inline-flex items-center gap-1 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
        >
          <Plus size={16} />
          Add class
        </button>
      )}
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Classes
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Manage class sections across all grades
          </p>
        </div>

        {isAdmin && (
          <Button
            type="button"
            onClick={() => openModal()}
            className="!h-10 !w-auto !px-4 sm:!h-12 sm:!px-5"
          >
            <Plus size={18} className="mr-2" />
            Add Class
          </Button>
        )}
      </header>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            placeholder="Search classes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 transition focus:border-indigo-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="grade-filter" className="text-sm font-medium text-slate-600">
            Grade:
          </label>
          <select
            id="grade-filter"
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 transition focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          >
            <option value="all">All Grades</option>
            {grades.map((grade) => (
              <option key={grade.id} value={grade.id}>
                {grade.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={filteredClasses}
        emptyState={emptyState}
        loading={loading}
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingClass ? "Edit Class" : "Add New Class"}
        size="sm"
        footer={
          <>
            <button
              type="button"
              onClick={closeModal}
              className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
            >
              Cancel
            </button>
            <Button
              type="submit"
              onClick={handleSubmit}
              loading={submitting}
              className="!h-10 !w-auto !px-5"
            >
              {editingClass ? "Save Changes" : "Create Class"}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="class-name" className="mb-1.5 block text-sm font-medium text-slate-700">
              Class Name
            </label>
            <Input
              id="class-name"
              type="text"
              placeholder="e.g., Class A"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label htmlFor="grade-select" className="mb-1.5 block text-sm font-medium text-slate-700">
              Grade
            </label>
            <select
              id="grade-select"
              value={formData.gradeId}
              onChange={(e) => setFormData({ ...formData, gradeId: e.target.value })}
              className="h-14 w-full rounded-2xl border border-slate-300 bg-white px-5 text-[15px] text-slate-700 transition-all duration-200 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              required
            >
              <option value="">Select a grade</option>
              {grades.map((grade) => (
                <option key={grade.id} value={grade.id}>
                  {grade.name}
                </option>
              ))}
            </select>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Class"
        size="sm"
        footer={
          <>
            <button
              type="button"
              onClick={() => setDeleteConfirm(null)}
              className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className={clsx(
                "flex h-10 items-center justify-center rounded-xl bg-red-600 px-5 text-sm font-medium text-white shadow-lg transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60",
                deleting && "cursor-wait"
              )}
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-slate-600">
            Are you sure you want to delete <span className="font-semibold text-slate-900">{deleteConfirm?.name}</span>?
          </p>
          <p className="text-xs text-slate-500">
            This action cannot be undone. All content and folders associated with this class will also be affected.
          </p>
        </div>
      </Modal>
    </div>
  );
}
