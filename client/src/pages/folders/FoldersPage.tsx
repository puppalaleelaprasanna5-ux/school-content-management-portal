import { useState, useEffect, useMemo, useCallback } from "react";
import { Plus, Pencil, Trash2, FolderOpen, Inbox, ArrowUpDown, FileText } from "lucide-react";
import clsx from "clsx";

import api from "../../services/api";
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

  const fetchFolders = useCallback(async () => {
    try {
      const res = await api.get("/folders");
      setFolders(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch folders:", error);
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
    fetchFolders();
    fetchGrades();
  }, [fetchFolders, fetchGrades]);

  useEffect(() => {
    if (selectedGrade && selectedGrade !== "all") {
      fetchClasses(selectedGrade);
    } else {
      setClasses([]);
    }
  }, [selectedGrade, fetchClasses]);

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

  const handleSort = (field: "name") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleGradeChange = (gradeId: string) => {
    setSelectedGrade(gradeId);
    setSelectedClass("all");
    if (editingFolder) {
      setFormData({ ...formData, gradeId, classId: "" });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  };

  const loadingSkeleton = (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="animate-pulse rounded-2xl bg-white p-5 ring-1 ring-slate-200/70">
          <div className="mb-4 h-11 w-11 rounded-xl bg-slate-200" />
          <div className="mb-3 h-4 w-3/4 rounded bg-slate-200" />
          <div className="mb-4 h-3 w-1/2 rounded bg-slate-100" />
          <div className="space-y-2">
            <div className="h-3 w-full rounded bg-slate-100" />
            <div className="h-3 w-2/3 rounded bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );

  const showCreate =
    isAdmin && !searchQuery && selectedGrade === "all" && selectedClass === "all";

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <PageHeader
        title="Folders"
        subtitle="Organize your content into folders"
        actions={
          isAdmin && (
            <Button type="button" onClick={() => openModal()}>
              <Plus size={18} />
              Create Folder
            </Button>
          )
        }
      />

      {/* Toolbar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <SearchBox
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search folders…"
          className="w-full lg:max-w-sm"
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

          <button
            type="button"
            onClick={() => handleSort("name")}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-3.5 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-inset ring-slate-200 transition-all hover:ring-slate-300 hover:text-slate-900"
          >
            Name
            <ArrowUpDown
              size={14}
              className={clsx(sortField === "name" && sortDirection === "asc" ? "rotate-180" : "")}
            />
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        loadingSkeleton
      ) : filteredFolders.length === 0 ? (
        <div className="rounded-2xl bg-white ring-1 ring-slate-200/70">
          <EmptyState
            icon={Inbox}
            title="No folders found"
            description={
              searchQuery || selectedGrade !== "all" || selectedClass !== "all"
                ? "Try adjusting your search or filters."
                : isAdmin
                ? "Create your first folder to organize your content."
                : "No folders have been created yet."
            }
            action={
              showCreate ? (
                <Button type="button" onClick={() => openModal()}>
                  <Plus size={18} />
                  Create folder
                </Button>
              ) : undefined
            }
          />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredFolders.map((folder) => (
            <div
              key={folder.id}
              className="group relative rounded-2xl bg-white p-5 shadow-sm shadow-slate-200/40 ring-1 ring-slate-200/70 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/60"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-sm">
                  <FolderOpen size={22} strokeWidth={1.75} />
                </div>

                {isAdmin && (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openModal(folder)}
                      className="rounded-lg p-1.5 text-slate-400 opacity-0 transition-all hover:bg-slate-100 hover:text-slate-600 group-hover:opacity-100"
                      aria-label={`Edit ${folder.name}`}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirm(folder)}
                      className="rounded-lg p-1.5 text-slate-400 opacity-0 transition-all hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
                      aria-label={`Delete ${folder.name}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>

              <h3 className="mb-1 truncate text-base font-semibold text-slate-900">
                {folder.name}
              </h3>
              <p className="mb-4 truncate text-xs text-slate-500">
                {folder.grade?.name ?? "No Grade"} · {folder.class?.name ?? "No Class"}
              </p>

              <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                <Badge tone="indigo">
                  <FileText size={12} />
                  {folder._count?.contents ?? 0} items
                </Badge>
                <span className="text-xs text-slate-400">{formatDate(folder.createdAt)}</span>
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
            <Button type="button" onClick={closeModal} variant="secondary" size="sm">
              Cancel
            </Button>
            <Button type="submit" onClick={handleSubmit} loading={submitting} size="sm">
              {editingFolder ? "Save Changes" : "Create Folder"}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-5">
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
            <Select
              id="grade-select"
              value={formData.gradeId}
              onChange={(e) => handleGradeChange(e.target.value)}
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
              required
            >
              <option value="">Select a class</option>
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
        title="Delete Folder"
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
            This action cannot be undone. All content within this folder will also be deleted.
          </p>
        </div>
      </Modal>
    </div>
  );
}
