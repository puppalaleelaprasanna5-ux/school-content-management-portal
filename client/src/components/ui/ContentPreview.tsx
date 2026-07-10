import { useState, useEffect } from "react";
import { Download, ExternalLink, X, FileText, Video, Image as ImageIcon, BookOpen, Calendar, User, Folder, GraduationCap, Loader2, AlertCircle } from "lucide-react";
import clsx from "clsx";

interface Content {
  id: string;
  title: string;
  description?: string;
  type: "PDF" | "VIDEO" | "TEXT" | "IMAGE";
  filePath?: string;
  textContent?: string;
  published: boolean;
  folder: {
    id: string;
    name: string;
    grade: { id: string; name: string };
    class: { id: string; name: string };
  };
  uploadedBy: {
    id: string;
    name: string;
  };
  createdAt: string;
}

interface ContentPreviewProps {
  content: Content | null;
  onClose: () => void;
}

export default function ContentPreview({ content, onClose }: ContentPreviewProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getFileUrl = (filePath?: string) => {
    if (!filePath) return "";
    return `http://localhost:5000/${filePath.replace(/\\/g, "/")}`;
  };

  useEffect(() => {
    if (!content) return;

    setLoading(true);
    setError(null);

    if (content.type === "TEXT" || !content.filePath) {
      setLoading(false);
      return;
    }

    // Preload the file to check if it's accessible
    const url = getFileUrl(content.filePath);
    const img = new Image();
    const video = document.createElement('video');

    const handleLoad = () => {
      setLoading(false);
      setError(null);
    };

    const handleError = () => {
      setLoading(false);
      setError("Failed to load the file. Please try again later.");
    };

    if (content.type === "IMAGE") {
      img.onload = handleLoad;
      img.onerror = handleError;
      img.src = url;
    } else if (content.type === "VIDEO") {
      video.onloadeddata = handleLoad;
      video.onerror = handleError;
      video.src = url;
    } else if (content.type === "PDF") {
      // For PDFs, we'll set a timeout since we can't easily detect iframe load
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }

    return () => {
      img.onload = null;
      img.onerror = null;
      video.onloadeddata = null;
      video.onerror = null;
    };
  }, [content]);

  if (!content) return null;

  const handleDownload = () => {
    if (content.filePath) {
      const url = getFileUrl(content.filePath);
      const link = document.createElement("a");
      link.href = url;
      link.download = content.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (content.type === "TEXT" && content.textContent) {
      const blob = new Blob([content.textContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${content.title}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleOpenInNewTab = () => {
    if (content.filePath) {
      window.open(getFileUrl(content.filePath), "_blank");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "PDF":
        return <FileText size={20} className="text-red-500" />;
      case "VIDEO":
        return <Video size={20} className="text-purple-500" />;
      case "IMAGE":
        return <ImageIcon size={20} className="text-emerald-500" />;
      case "TEXT":
        return <BookOpen size={20} className="text-blue-500" />;
      default:
        return <FileText size={20} className="text-slate-500" />;
    }
  };

  const renderPreview = () => {
    if (loading) {
      return (
        <div className="flex h-[500px] items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={32} className="animate-spin text-indigo-600" />
            <p className="text-sm text-slate-500">Loading preview...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex h-[500px] items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
              <AlertCircle size={24} className="text-red-600" />
            </div>
            <p className="text-sm text-slate-600">{error}</p>
            <button
              type="button"
              onClick={() => {
                setError(null);
                setLoading(true);
              }}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    switch (content.type) {
      case "PDF":
        return content.filePath ? (
          <iframe
            src={getFileUrl(content.filePath)}
            className="h-[500px] w-full rounded-xl border border-slate-200"
            title="PDF Preview"
          />
        ) : (
          <div className="flex h-[500px] items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
            <p className="text-sm text-slate-500">No file available for preview</p>
          </div>
        );

      case "VIDEO":
        return content.filePath ? (
          <video
            src={getFileUrl(content.filePath)}
            controls
            className="h-[500px] w-full rounded-xl bg-black"
          />
        ) : (
          <div className="flex h-[500px] items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
            <p className="text-sm text-slate-500">No video available for preview</p>
          </div>
        );

      case "IMAGE":
        return content.filePath ? (
          <img
            src={getFileUrl(content.filePath)}
            alt={content.title}
            className="h-[500px] w-full object-contain rounded-xl border border-slate-200 bg-slate-50"
          />
        ) : (
          <div className="flex h-[500px] items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
            <p className="text-sm text-slate-500">No image available for preview</p>
          </div>
        );

      case "TEXT":
        return content.textContent ? (
          <div
            className="prose prose-sm sm:prose lg:prose-lg max-h-[500px] overflow-y-auto rounded-xl border border-slate-200 bg-white p-6"
            dangerouslySetInnerHTML={{ __html: content.textContent }}
          />
        ) : (
          <div className="flex h-[500px] items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
            <p className="text-sm text-slate-500">No text content available</p>
          </div>
        );

      default:
        return (
          <div className="flex h-[500px] items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
            <p className="text-sm text-slate-500">Preview not available for this content type</p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-gradient-to-r from-white to-slate-50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 shadow-sm">
              {getTypeIcon(content.type)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{content.title}</h3>
              <p className="text-sm text-slate-500">{content.type}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {(content.filePath || content.type === "TEXT") && (
              <>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                  title="Download"
                >
                  <Download size={16} />
                  <span className="hidden sm:inline">Download</span>
                </button>
                {content.filePath && (
                  <button
                    type="button"
                    onClick={handleOpenInNewTab}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                    title="Open in new tab"
                  >
                    <ExternalLink size={16} />
                    <span className="hidden sm:inline">Open</span>
                  </button>
                )}
              </>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row max-h-[calc(90vh-73px)] overflow-hidden">
          {/* Preview Area */}
          <div className="flex-1 overflow-auto p-6 bg-slate-50">
            {content.description && (
              <p className="mb-4 text-sm text-slate-600">{content.description}</p>
            )}
            {renderPreview()}
          </div>

          {/* Metadata Sidebar */}
          <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-slate-200 bg-white p-6 overflow-auto">
            <h4 className="text-sm font-semibold text-slate-900 mb-4">Metadata</h4>
            
            <div className="space-y-4">
              {/* Created By */}
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-600 shadow-sm">
                  <User size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-slate-500">Created By</p>
                  <p className="text-sm text-slate-900 truncate">{content.uploadedBy?.name ?? "Unknown"}</p>
                </div>
              </div>

              {/* Created Date */}
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600 shadow-sm">
                  <Calendar size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-slate-500">Created Date</p>
                  <p className="text-sm text-slate-900">{formatDate(content.createdAt)}</p>
                </div>
              </div>

              {/* Folder */}
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-sky-50 to-sky-100 text-sky-600 shadow-sm">
                  <Folder size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-slate-500">Folder</p>
                  <p className="text-sm text-slate-900 truncate">{content.folder.name}</p>
                </div>
              </div>

              {/* Grade */}
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-50 to-violet-100 text-violet-600 shadow-sm">
                  <GraduationCap size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-slate-500">Grade</p>
                  <p className="text-sm text-slate-900 truncate">{content.folder?.grade?.name ?? "No Grade"}</p>
                </div>
              </div>

              {/* Class */}
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-50 to-amber-100 text-amber-600 shadow-sm">
                  <GraduationCap size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-slate-500">Class</p>
                  <p className="text-sm text-slate-900 truncate">{content.folder?.class?.name ?? "No Class"}</p>
                </div>
              </div>

              {/* Type */}
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 shadow-sm">
                  {getTypeIcon(content.type)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-slate-500">Content Type</p>
                  <p className="text-sm text-slate-900">{content.type}</p>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 shadow-sm">
                  <div className={clsx("h-2 w-2 rounded-full", content.published ? "bg-emerald-500" : "bg-slate-400")} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-slate-500">Status</p>
                  <p className="text-sm text-slate-900">{content.published ? "Published" : "Draft"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
