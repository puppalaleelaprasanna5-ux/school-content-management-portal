import { useState, useEffect, useMemo, useCallback } from "react";
import { Plus, Pencil, Trash2, Layers, Inbox, ArrowUpDown } from "lucide-react";
import clsx from "clsx";

import api from "../../services/api";
import Table from "../../components/ui/Table";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import PageHeader from "../../components/ui/PageHeader";
import EmptyState from "../../components/ui/EmptyState";
import SearchBox from "../../components/ui/SearchBox";
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

  const fetchGrades = useCallback(async () => {
    try {
      const res = await api.get("/grades");
      setGrades(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch grades:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGrades();
  }, [fetchGrades]);

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

  const handleSort = (field: "name") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const columns = [
    {
      key: "name",
      header: (
        <button
          type="button"
          onClick={() => handleSort("name")}
          className="flex items-center gap-2 transition-colors hover:text-slate-700"
        >
          Grade Name
          {sortField === "name" && (
            <ArrowUpDown size={14} className={clsx(sortDirection === "asc" ? "rotate-180" : "")} />
          )}
        </button>
      ),
      cell: (item: Grade) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Layers size={18} strokeWidth={1.75} />
          </div>
          <span className="font-medium text-slate-900">{item.name}</span>
        </div>
      ),
    },
    {
      key: "actions",
      header: "",
      cell: (item: Grade) =>
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

  const emptyState = (
    <EmptyState
      icon={Inbox}
      title="No grades found"
      description={
        searchQuery
          ? "Try adjusting your search."
          : isAdmin
          ? "Create your first grade to get started."
          : "No grades have been added yet."
      }
      action={
        isAdmin && !searchQuery ? (
          <Button type="button" onClick={() => openModal()}>
            <Plus size={18} />
            Add grade
          </Button>
        ) : undefined
      }
    />
  );

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <PageHeader
        title="Grades"
        subtitle="Manage grade levels for your school"
        actions={
          isAdmin && (
            <Button type="button" onClick={() => openModal()}>
              <Plus size={18} />
              Add Grade
            </Button>
          )
        }
      />

      <SearchBox
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search grades…"
        className="w-full sm:max-w-sm"
      />

      <Table columns={columns} data={filteredGrades} emptyState={emptyState} loading={loading} />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingGrade ? "Edit Grade" : "Add New Grade"}
        size="sm"
        footer={
          <>
            <Button type="button" onClick={closeModal} variant="secondary" size="sm">
              Cancel
            </Button>
            <Button type="submit" onClick={handleSubmit} loading={submitting} size="sm">
              {editingGrade ? "Save Changes" : "Create Grade"}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-5">
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
            This action cannot be undone. All classes and content associated with this grade will also
            be affected.
          </p>
        </div>
      </Modal>
    </div>
  );
}
