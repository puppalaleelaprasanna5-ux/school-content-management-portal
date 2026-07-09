import { useState, useEffect, useMemo } from "react";
import { Plus, Pencil, Trash2, Search, Layers, Inbox, ArrowUpDown } from "lucide-react";
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

interface GradeFormData {
  name: string;
}

export default function GradesPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<"name" | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null);
  const [formData, setFormData] = useState<GradeFormData>({ name: "" });
  const [submitting, setSubmitting] = useState(false);

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<Grade | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch data
  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    try {
      const res = await api.get("/grades");
      setGrades(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch grades:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort grades
  const filteredGrades = useMemo(() => {
    let result = grades.filter((grade) =>
      grade.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortField === "name") {
      result = result.sort((a, b) => {
        const comparison = a.name.localeCompare(b.name);
        return sortDirection === "asc" ? comparison : -comparison;
      });
    }

    return result;
  }, [grades, searchQuery, sortField, sortDirection]);

  // Open modal for add/edit
  const openModal = (grade: Grade | null = null) => {
    if (grade) {
      setEditingGrade(grade);
      setFormData({ name: grade.name });
    } else {
      setEditingGrade(null);
      setFormData({ name: "" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingGrade(null);
    setFormData({ name: "" });
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setSubmitting(true);
    try {
      if (editingGrade) {
        await api.put(`/grades/${editingGrade.id}`, formData);
      } else {
        await api.post("/grades", formData);
      }
      await fetchGrades();
      closeModal();
    } catch (error) {
      console.error("Failed to save grade:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deleteConfirm) return;

    setDeleting(true);
    try {
      await api.delete(`/grades/${deleteConfirm.id}`);
      await fetchGrades();
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Failed to delete grade:", error);
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
          Grade Name
          {sortField === "name" && (
            <ArrowUpDown size={14} className={clsx(sortDirection === "asc" ? "rotate-180" : "")} />
          )}
        </button>
      ),
      cell: (item: Grade) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
            <Layers size={18} strokeWidth={1.75} />
          </div>
          <span className="font-medium text-slate-900">{item.name}</span>
        </div>
      ),
    },
    {
      key: "actions",
      header: "",
      cell: (item: Grade) => (
        <div className="flex items-center gap-2">
          {isAdmin && (
            <>
              <button
                type="button"
                onClick={() => openModal(item)}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                aria-label="Edit grade"
              >
                <Pencil size={16} />
              </button>
              <button
                type="button"
                onClick={() => setDeleteConfirm(item)}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                aria-label="Delete grade"
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
      <p className="mt-4 text-sm font-medium text-slate-900">No grades found</p>
      <p className="mt-1 max-w-xs text-sm text-slate-500">
        {searchQuery
          ? "Try adjusting your search"
          : isAdmin
          ? "Create your first grade to get started"
          : "No grades have been added yet"}
      </p>
      {isAdmin && !searchQuery && (
        <button
          type="button"
          onClick={() => openModal()}
          className="mt-5 inline-flex items-center gap-1 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
        >
          <Plus size={16} />
          Add grade
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
            Grades
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Manage grade levels for your school
          </p>
        </div>

        {isAdmin && (
          <Button
            type="button"
            onClick={() => openModal()}
            className="!h-10 !w-auto !px-4 sm:!h-12 sm:!px-5"
          >
            <Plus size={18} className="mr-2" />
            Add Grade
          </Button>
        )}
      </header>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search
          size={16}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="search"
          placeholder="Search grades..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 transition focus:border-indigo-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={filteredGrades}
        emptyState={emptyState}
        loading={loading}
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingGrade ? "Edit Grade" : "Add New Grade"}
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
              {editingGrade ? "Save Changes" : "Create Grade"}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="grade-name" className="mb-1.5 block text-sm font-medium text-slate-700">
              Grade Name
            </label>
            <Input
              id="grade-name"
              type="text"
              placeholder="e.g., Grade 10"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Grade"
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
            This action cannot be undone. All classes and content associated with this grade will also be affected.
          </p>
        </div>
      </Modal>
    </div>
  );
}
