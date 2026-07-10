import { useState, useEffect, useMemo, useCallback } from "react";
import { Plus, Pencil, Trash2, GraduationCap, Inbox, ArrowUpDown } from "lucide-react";
import clsx from "clsx";

import api from "../../services/api";
import Table from "../../components/ui/Table";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Badge from "../../components/ui/Badge";
import Select from "../../components/ui/Select";
import PageHeader from "../../components/ui/PageHeader";
import EmptyState from "../../components/ui/EmptyState";
import SearchBox from "../../components/ui/SearchBox";
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

  // Fetch data functions
  const fetchClasses = useCallback(async () => {
    try {
      const res = await api.get("/classes");
      setClasses(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch classes:", error);
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

  useEffect(() => {
    fetchClasses();
    fetchGrades();
  }, [fetchClasses, fetchGrades]);

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
          className="flex items-center gap-2 transition-colors hover:text-slate-700"
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
      cell: (item: Class) => <Badge tone="indigo">{item.grade?.name ?? "No Grade"}</Badge>,
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
      key: "actions",
      header: "",
      cell: (item: Class) =>
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
      title="No classes found"
      description={
        searchQuery || selectedGrade !== "all"
          ? "Try adjusting your search or filters."
          : isAdmin
          ? "Create your first class to get started."
          : "No classes have been added yet."
      }
      action={
        isAdmin && !searchQuery && selectedGrade === "all" ? (
          <Button type="button" onClick={() => openModal()}>
            <Plus size={18} />
            Add class
          </Button>
        ) : undefined
      }
    />
  );

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      {/* Top toolbar */}
      <PageHeader
        title="Classes"
        subtitle="Manage class sections across all grades"
        actions={
          isAdmin && (
            <Button type="button" onClick={() => openModal()}>
              <Plus size={18} />
              Add Class
            </Button>
          )
        }
      />

      {/* Search + filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBox
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search classes…"
          className="w-full sm:max-w-sm"
        />

        <div className="flex items-center gap-2">
          <label htmlFor="grade-filter" className="text-sm font-medium text-slate-600">
            Grade
          </label>
          <Select
            id="grade-filter"
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            wrapperClassName="w-full sm:w-48"
          >
            <option value="all">All Grades</option>
            {grades.map((grade) => (
              <option key={grade.id} value={grade.id}>
                {grade.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Modern table (rounded container, sticky header, hover rows, pagination) */}
      <Table columns={columns} data={filteredClasses} emptyState={emptyState} loading={loading} />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingClass ? "Edit Class" : "Add New Class"}
        size="sm"
        footer={
          <>
            <Button type="button" onClick={closeModal} variant="secondary" size="sm">
              Cancel
            </Button>
            <Button type="submit" onClick={handleSubmit} loading={submitting} size="sm">
              {editingClass ? "Save Changes" : "Create Class"}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-5">
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
            <Select
              id="grade-select"
              value={formData.gradeId}
              onChange={(e) => setFormData({ ...formData, gradeId: e.target.value })}
              wrapperClassName="w-full"
              required
            >
              <option value="">Select a grade</option>
              {grades.map((grade) => (
                <option key={grade.id} value={grade.id}>
                  {grade.name}
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
        title="Delete Class"
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
            This action cannot be undone. All content and folders associated with this class will also
            be affected.
          </p>
        </div>
      </Modal>
    </div>
  );
}
