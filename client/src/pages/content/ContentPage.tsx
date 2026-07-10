import { useState, useEffect, useMemo, useCallback } from "react";
import { Plus, Pencil, Trash2, Eye, FileText, Video, BookOpen, Inbox, Upload, Image as ImageIcon } from "lucide-react";
import clsx from "clsx";

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
import ContentPreview from "../../components/ui/ContentPreview";
import { useAuth } from "../../context/AuthContext";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const TYPE_TONE = {
  PDF: "red",
  VIDEO: "blue",
  IMAGE: "emerald",
  TEXT: "indigo",
} as const;

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
}

interface Content {
  id: string;
  title: string;
  description?: string;
  type: "PDF" | "VIDEO" | "TEXT" | "IMAGE";
  filePath?: string;
  textContent?: string;
  published: boolean;
  folder: Folder;
  uploadedBy: {
    id: string;
    name: string;
  };
  createdAt: string;
}

interface ContentFormData {
  title: string;
  description: string;
  type: "PDF" | "VIDEO" | "TEXT" | "IMAGE";
  folderId: string;
  textContent: string;
  file?: File;
}

export default function ContentPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN" || user?.role === "STAFF";

  const [contents, setContents] = useState<Content[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [classes, setClasses] = useState<ClassSection[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGrade, setSelectedGrade] = useState<string>("all");
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [selectedFolder, setSelectedFolder] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [formData, setFormData] = useState<ContentFormData>({
    title: "",
    description: "",
    type: "TEXT",
    folderId: "",
    textContent: "",
    file: undefined,
  });
  const [submitting, setSubmitting] = useState(false);

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<Content | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Preview modal
  const [previewContent, setPreviewContent] = useState<Content | null>(null);

  // TipTap editor for rich text
  const editor = useEditor({
    extensions: [StarterKit],
    content: formData.textContent,
    onUpdate: ({ editor }) => {
      setFormData({ ...formData, textContent: editor.getHTML() });
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[200px] max-h-[400px] overflow-y-auto p-4 border border-slate-200 rounded-xl",
      },
    },
  });

  // Fetch data functions
  const fetchContents = useCallback(async () => {
    try {
      const res = await api.get("/content");
      setContents(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch contents:", error);
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

  const fetchFolders = useCallback(async () => {
    try {
      const res = await api.get("/folders");
      setFolders(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch folders:", error);
    }
  }, []);

  // Fetch data
  useEffect(() => {
    fetchContents();
    fetchGrades();
    fetchFolders();
  }, [fetchContents, fetchGrades, fetchFolders]);

  useEffect(() => {
    if (selectedGrade && selectedGrade !== "all") {
      fetchClasses(selectedGrade);
    } else {
      setClasses([]);
    }
  }, [selectedGrade, fetchClasses]);

  useEffect(() => {
    if (editor && formData.textContent !== editor.getHTML()) {
      editor.commands.setContent(formData.textContent);
    }
  }, [editingContent, editor, formData.textContent]);

  // Filter contents
  const filteredContents = useMemo(() => {
    return contents.filter((content) => {
      const matchesSearch = content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (content.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
      const matchesGrade = selectedGrade === "all" || content.folder.grade.id === selectedGrade;
      const matchesClass = selectedClass === "all" || content.folder.class.id === selectedClass;
      const matchesFolder = selectedFolder === "all" || content.folder.id === selectedFolder;
      const matchesType = selectedType === "all" || content.type === selectedType;
      return matchesSearch && matchesGrade && matchesClass && matchesFolder && matchesType;
    });
  }, [contents, searchQuery, selectedGrade, selectedClass, selectedFolder, selectedType]);

  // Open modal for add/edit
  const openModal = (content: Content | null = null) => {
    if (content) {
      setEditingContent(content);
      setFormData({
        title: content.title,
        description: content.description || "",
        type: content.type,
        folderId: content.folder.id,
        textContent: content.textContent || "",
        file: undefined,
      });
    } else {
      setEditingContent(null);
      setFormData({
        title: "",
        description: "",
        type: "TEXT",
        folderId: "",
        textContent: "",
        file: undefined,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingContent(null);
    setFormData({
      title: "",
      description: "",
      type: "TEXT",
      folderId: "",
      textContent: "",
      file: undefined,
    });
    editor?.commands.clearContent();
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.folderId) return;

    setSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("type", formData.type);
      formDataToSend.append("folderId", formData.folderId);
      formDataToSend.append("textContent", formData.textContent);
      
      if (formData.file) {
        formDataToSend.append("file", formData.file);
      }

      if (editingContent) {
        await api.put(`/content/${editingContent.id}`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/content", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      
      await fetchContents();
      closeModal();
    } catch (error) {
      console.error("Failed to save content:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deleteConfirm) return;

    setDeleting(true);
    try {
      await api.delete(`/content/${deleteConfirm.id}`);
      await fetchContents();
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Failed to delete content:", error);
    } finally {
      setDeleting(false);
    }
  };

  // Handle grade change
  const handleGradeChange = (gradeId: string) => {
    setSelectedGrade(gradeId);
    setSelectedClass("all");
    setSelectedFolder("all");
  };

  // Handle class change
  const handleClassChange = (classId: string) => {
    setSelectedClass(classId);
    setSelectedFolder("all");
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  };

  // Get type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "PDF":
        return <FileText size={18} className="text-red-500" />;
      case "VIDEO":
        return <Video size={18} className="text-blue-500" />;
      case "IMAGE":
        return <ImageIcon size={18} className="text-emerald-500" />;
      case "TEXT":
        return <BookOpen size={18} className="text-indigo-500" />;
      default:
        return <FileText size={18} className="text-slate-500" />;
    }
  };

  // Table columns
  const columns = [
    {
      key: "title",
      header: "Title",
      cell: (item: Content) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
            {getTypeIcon(item.type)}
          </div>
          <div>
            <div className="font-medium text-slate-900">{item.title}</div>
            {item.description && (
              <div className="text-xs text-slate-500 line-clamp-1">{item.description}</div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "folder",
      header: "Folder",
      cell: (item: Content) => (
        <div className="text-sm text-slate-600">
          <div>{item.folder?.name ?? "No Folder"}</div>
          <div className="text-xs text-slate-400">{item.folder?.grade?.name ?? "No Grade"} - {item.folder?.class?.name ?? "No Class"}</div>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      cell: (item: Content) => <Badge tone={TYPE_TONE[item.type]}>{item.type}</Badge>,
    },
    {
      key: "uploadedBy",
      header: "Uploaded By",
      cell: (item: Content) => (
        <div className="text-sm text-slate-600">{item.uploadedBy?.name ?? "Unknown"}</div>
      ),
    },
    {
      key: "createdAt",
      header: "Created",
      cell: (item: Content) => (
        <div className="text-sm text-slate-600">{formatDate(item.createdAt)}</div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      cell: (item: Content) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPreviewContent(item)}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Preview"
          >
            <Eye size={14} />
          </button>
          {isAdmin && (
            <>
              <button
                type="button"
                onClick={() => openModal(item)}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                aria-label="Edit"
              >
                <Pencil size={14} />
              </button>
              <button
                type="button"
                onClick={() => setDeleteConfirm(item)}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                aria-label="Delete"
              >
                <Trash2 size={14} />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  // Empty state
  const hasFilters =
    !!searchQuery ||
    selectedGrade !== "all" ||
    selectedClass !== "all" ||
    selectedFolder !== "all" ||
    selectedType !== "all";

  const emptyState = (
    <EmptyState
      icon={Inbox}
      title="No content found"
      description={
        hasFilters
          ? "Try adjusting your search or filters."
          : isAdmin
          ? "Upload your first content to get started."
          : "No content has been uploaded yet."
      }
      action={
        isAdmin && !hasFilters ? (
          <Button type="button" onClick={() => openModal()}>
            <Plus size={18} />
            Upload Content
          </Button>
        ) : undefined
      }
    />
  );

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <PageHeader
        title="Content"
        subtitle="Manage and organize your educational content"
        actions={
          isAdmin && (
            <Button type="button" onClick={() => openModal()}>
              <Plus size={18} />
              Upload Content
            </Button>
          )
        }
      />

      {/* Toolbar */}
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <SearchBox
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search content…"
          className="w-full xl:max-w-xs"
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
            onChange={(e) => handleClassChange(e.target.value)}
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

          <Select
            aria-label="Filter by folder"
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
            disabled={selectedClass === "all"}
            wrapperClassName="w-full sm:w-44"
          >
            <option value="all">All Folders</option>
            {folders
              .filter((f) => selectedClass === "all" || f.class.id === selectedClass)
              .map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
          </Select>

          <Select
            aria-label="Filter by type"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            wrapperClassName="w-full sm:w-44"
          >
            <option value="all">All Types</option>
            <option value="PDF">PDF</option>
            <option value="VIDEO">Video</option>
            <option value="IMAGE">Image</option>
            <option value="TEXT">Rich Text</option>
          </Select>
        </div>
      </div>

      {/* Content Table */}
      <Table
        columns={columns}
        data={filteredContents}
        loading={loading}
        emptyState={emptyState}
      />

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingContent ? "Edit Content" : "Upload New Content"}
        size="lg"
        footer={
          <>
            <Button
              type="button"
              onClick={closeModal}
              variant="secondary"
              size="sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              loading={submitting}
              size="sm"
            >
              {editingContent ? "Save Changes" : "Upload Content"}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="content-title" className="mb-1.5 block text-sm font-medium text-slate-700">
              Title
            </label>
            <Input
              id="content-title"
              type="text"
              placeholder="e.g., Introduction to Algebra"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div>
            <label htmlFor="content-description" className="mb-1.5 block text-sm font-medium text-slate-700">
              Description
            </label>
            <Input
              id="content-description"
              type="text"
              placeholder="Brief description of the content"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="content-type" className="mb-1.5 block text-sm font-medium text-slate-700">
              Content Type
            </label>
            <Select
              id="content-type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as "PDF" | "VIDEO" | "TEXT" | "IMAGE" })}
              wrapperClassName="w-full"
              required
            >
              <option value="TEXT">Rich Text Lesson</option>
              <option value="PDF">PDF Document</option>
              <option value="VIDEO">Video</option>
              <option value="IMAGE">Image</option>
            </Select>
          </div>

          <div>
            <label htmlFor="folder-select" className="mb-1.5 block text-sm font-medium text-slate-700">
              Folder
            </label>
            <Select
              id="folder-select"
              value={formData.folderId}
              onChange={(e) => setFormData({ ...formData, folderId: e.target.value })}
              wrapperClassName="w-full"
              required
            >
              <option value="">Select a folder</option>
              {folders.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.name} ({folder.grade?.name ?? "No Grade"} - {folder.class?.name ?? "No Class"})
                </option>
              ))}
            </Select>
          </div>

          {formData.type === "TEXT" ? (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Lesson Content
              </label>
              {editor && <EditorContent editor={editor} />}
            </div>
          ) : (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                {formData.type === "PDF" ? "PDF File" : formData.type === "VIDEO" ? "Video File" : "Image File"}
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept={formData.type === "PDF" ? ".pdf" : formData.type === "VIDEO" ? "video/*" : "image/*"}
                  onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] })}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className={clsx(
                    "flex h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition",
                    formData.file
                      ? "border-indigo-300 bg-indigo-50"
                      : "border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100"
                  )}
                >
                  {formData.file ? (
                    <>
                      <FileText size={32} className="mb-2 text-indigo-600" />
                      <p className="text-sm font-medium text-slate-900">{formData.file.name}</p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setFormData({ ...formData, file: undefined });
                        }}
                        className="mt-2 text-sm text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </>
                  ) : (
                    <>
                      <Upload size={32} className="mb-2 text-slate-400" />
                      <p className="text-sm font-medium text-slate-700">
                        {formData.type === "PDF" ? "Drop PDF here or click to upload" : formData.type === "VIDEO" ? "Drop video here or click to upload" : "Drop image here or click to upload"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formData.type === "PDF" ? "PDF files only" : formData.type === "VIDEO" ? "MP4, WebM, MOV files only" : "JPG, PNG, GIF, WebP files only"}
                      </p>
                    </>
                  )}
                </label>
              </div>
            </div>
          )}
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Content"
        size="sm"
        footer={
          <>
            <Button
              type="button"
              onClick={() => setDeleteConfirm(null)}
              variant="secondary"
              size="sm"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              variant="danger"
              size="sm"
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-slate-600">
            Are you sure you want to delete <span className="font-semibold text-slate-900">{deleteConfirm?.title}</span>?
          </p>
          <p className="text-xs text-slate-500">
            This action cannot be undone.
          </p>
        </div>
      </Modal>

      {/* Content Preview Modal */}
      <ContentPreview content={previewContent} onClose={() => setPreviewContent(null)} />
    </div>
  );
}
