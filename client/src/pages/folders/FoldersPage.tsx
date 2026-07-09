import { useState, useEffect, useMemo } from "react";
import { Plus, Pencil, Trash2, Search, FolderOpen, Inbox, ArrowUpDown } from "lucide-react";
import clsx from "clsx";

import api from "../../services/api";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { useAuth } from "../../context/AuthContext";

interface Grade {
  id: string;
  name: string;
}

interface ClassSection {
  id: string;
  name: string;
  grade?: Grade;
}

interface Folder {
  id: string;
  name: string;
  grade: Grade;
  class: ClassSection;
  _count?: {
    contents: number;
  };
  createdAt: string;
}

interface FolderFormData {
  name: string;
  gradeId: string;
  classId: string;
}

export default function FoldersPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN" || user?.role === "STAFF";

  const [folders, setFolders] = useState<Folder[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [classes, setClasses] = useState<ClassSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGrade, setSelectedGrade] = useState<string>("all");
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [sortField, setSortField] = useState<"name" | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  const [formData, setFormData] = useState<FolderFormData>({ name: "", gradeId: "", classId: "" });
  const [submitting, setSubmitting] = useState(false);

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<Folder | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch data
  useEffect(() => {
    fetchFolders();
    fetchGrades();
  }, []);

  useEffect(() => {
    if (selectedGrade && selectedGrade !== "all") {
      fetchClasses(selectedGrade);
    } else {
      setClasses([]);
    }
  }, [selectedGrade]);

  const fetchFolders = async () => {
    try {
      const res = await api.get("/folders");
      setFolders(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch folders:", error);
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

  const fetchClasses = async (gradeId: string) => {
    try {
      const res = await api.get("/classes");
      const allClasses = res.data.data || [];
      setClasses(allClasses.filter((cls: ClassSection) => cls.grade?.id === gradeId));
    } catch (error) {
      console.error("Failed to fetch classes:", error);
    }
  };

  // Filter and sort folders
  const filteredFolders = useMemo(() => {
    let result = folders.filter((folder) => {
      const matchesSearch = folder.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGrade = selectedGrade === "all" || folder.grade.id === selectedGrade;
      const matchesClass = selectedClass === "all" || folder.class.id === selectedClass;
      return matchesSearch && matchesGrade && matchesClass;
    });

    if (sortField === "name") {
      result = result.sort((a, b) => {
        const comparison = a.name.localeCompare(b.name);
        return sortDirection === "asc" ? comparison : -comparison;
      });
    }

    return result;
  }, [folders, searchQuery, selectedGrade, selectedClass, sortField, sortDirection]);

  // Open modal for add/edit
  const openModal = (folder: Folder | null = null) => {
    if (folder) {
      setEditingFolder(folder);
      setFormData({ name: folder.name, gradeId: folder.grade.id, classId: folder.class.id });
    } else {
      setEditingFolder(null);
      setFormData({ name: "", gradeId: "", classId: "" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingFolder(null);
    setFormData({ name: "", gradeId: "", classId: "" });
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.gradeId || !formData.classId) return;

    setSubmitting(true);
    try {
      if (editingFolder) {
        await api.put(`/folders/${editingFolder.id}`, formData);
      } else {
        await api.post("/folders", formData);
      }
      await fetchFolders();
      closeModal();
    } catch (error) {
      console.error("Failed to save folder:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deleteConfirm) return;

    setDeleting(true);
    try {
      await api.delete(`/folders/${deleteConfirm.id}`);
      await fetchFolders();
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Failed to delete folder:", error);
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

  // Handle grade change
  const handleGradeChange = (gradeId: string) => {
    setSelectedGrade(gradeId);
    setSelectedClass("all");
    if (editingFolder) {
      setFormData({ ...formData, gradeId, classId: "" });
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  };

  // Loading skeleton
  const loadingSkeleton = (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="animate-pulse rounded-xl border border-slate-200/80 bg-white p-5">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100" />
          <div className="mb-3 h-5 w-3/4 rounded bg-slate-200" />
          <div className="mb-4 h-4 w-1/2 rounded bg-slate-200" />
          <div className="space-y-2">
            <div className="h-3 w-full rounded bg-slate-100" />
            <div className="h-3 w-2/3 rounded bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );

  // Empty state
  const emptyState = (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <Inbox size={28} />
      </div>
      <p className="mt-6 text-base font-semibold text-slate-900">No folders found</p>
      <p className="mt-2 max-w-sm text-sm text-slate-500">
        {searchQuery || selectedGrade !== "all" || selectedClass !== "all"
          ? "Try adjusting your search or filters"
          : isAdmin
          ? "Create your first folder to organize your content"
          : "No folders have been created yet"}
      </p>
      {isAdmin && !searchQuery && selectedGrade === "all" && selectedClass === "all" && (
        <button
          type="button"
          onClick={() => openModal()}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
        >
          <Plus size={18} />
          Create folder
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
            Folders
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Organize your content into folders
          </p>
        </div>

        {isAdmin && (
          <Button
            type="button"
            onClick={() => openModal()}
            className="!h-10 !w-auto !px-4 sm:!h-12 sm:!px-5"
          >
            <Plus size={18} className="mr-2" />
            Create Folder
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
            placeholder="Search folders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 transition focus:border-indigo-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="grade-filter" className="text-sm font-medium text-slate-600">
              Grade:
            </label>
            <select
              id="grade-filter"
              value={selectedGrade}
              onChange={(e) => handleGradeChange(e.target.value)}
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

          <div className="flex items-center gap-2">
            <label htmlFor="class-filter" className="text-sm font-medium text-slate-600">
              Class:
            </label>
            <select
              id="class-filter"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              disabled={selectedGrade === "all"}
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 transition focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="all">All Classes</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => handleSort("name")}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:border-slate-300"
          >
            Name
            <ArrowUpDown size={14} className={clsx(sortField === "name" && sortDirection === "asc" ? "rotate-180" : "")} />
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        loadingSkeleton
      ) : filteredFolders.length === 0 ? (
        emptyState
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredFolders.map((folder) => (
            <div
              key={folder.id}
              className="group relative rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
            >
              {/* Header */}
              <div className="mb-4 flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                  <FolderOpen size={20} strokeWidth={1.75} />
                </div>

                {isAdmin && (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openModal(folder)}
                      className="rounded-lg p-1.5 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-slate-100 hover:text-slate-600"
                      aria-label="Edit folder"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirm(folder)}
                      className="rounded-lg p-1.5 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-50 hover:text-red-600"
                      aria-label="Delete folder"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* Name */}
              <h3 className="mb-3 truncate text-base font-semibold text-slate-900">
                {folder.name}
              </h3>

              {/* Metadata */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-500">
                  <span className="font-medium">Grade:</span>
                  <span className="truncate">{folder.grade.name}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <span className="font-medium">Class:</span>
                  <span className="truncate">{folder.class.name}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <span className="font-medium">Content:</span>
                  <span>{folder._count?.contents ?? 0} items</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <span>Updated:</span>
                  <span>{formatDate(folder.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingFolder ? "Edit Folder" : "Create New Folder"}
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
              {editingFolder ? "Save Changes" : "Create Folder"}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="folder-name" className="mb-1.5 block text-sm font-medium text-slate-700">
              Folder Name
            </label>
            <Input
              id="folder-name"
              type="text"
              placeholder="e.g., Mathematics"
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
              onChange={(e) => handleGradeChange(e.target.value)}
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

          <div>
            <label htmlFor="class-select" className="mb-1.5 block text-sm font-medium text-slate-700">
              Class
            </label>
            <select
              id="class-select"
              value={formData.classId}
              onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
              disabled={!formData.gradeId}
              className="h-14 w-full rounded-2xl border border-slate-300 bg-white px-5 text-[15px] text-slate-700 transition-all duration-200 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              <option value="">Select a class</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
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
        title="Delete Folder"
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
            This action cannot be undone. All content within this folder will also be deleted.
          </p>
        </div>
      </Modal>
    </div>
  );
}
