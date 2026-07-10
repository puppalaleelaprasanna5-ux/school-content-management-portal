import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Loader2, GraduationCap, Layers, FolderOpen, FileText, Users, X } from "lucide-react";
import clsx from "clsx";

import api from "../../services/api";

interface SearchResult {
  id: string;
  name: string;
  subtitle: string;
  category: "Classes" | "Grades" | "Students" | "Folders" | "Content";
  icon: typeof GraduationCap;
  path: string;
}

const CATEGORY_CONFIG = {
  Classes: { icon: GraduationCap, color: "bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-600", badgeColor: "bg-indigo-100 text-indigo-700" },
  Grades: { icon: Layers, color: "bg-gradient-to-br from-violet-50 to-violet-100 text-violet-600", badgeColor: "bg-violet-100 text-violet-700" },
  Students: { icon: Users, color: "bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600", badgeColor: "bg-emerald-100 text-emerald-700" },
  Folders: { icon: FolderOpen, color: "bg-gradient-to-br from-sky-50 to-sky-100 text-sky-600", badgeColor: "bg-sky-100 text-sky-700" },
  Content: { icon: FileText, color: "bg-gradient-to-br from-amber-50 to-amber-100 text-amber-600", badgeColor: "bg-amber-100 text-amber-700" },
};

export default function GlobalSearch() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [allData, setAllData] = useState<SearchResult[]>([]);

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch all data on mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [classesRes, gradesRes, studentsRes, foldersRes, contentRes] = await Promise.all([
          api.get("/classes"),
          api.get("/grades"),
          api.get("/students"),
          api.get("/folders"),
          api.get("/content"),
        ]);

        const classes = (classesRes.data.data || []).map((item: { id: string; name: string; grade?: { name: string } }) => ({
          id: item.id,
          name: item.name,
          subtitle: item.grade?.name || "No grade",
          category: "Classes" as const,
          icon: GraduationCap,
          path: `/dashboard/classes`,
        }));

        const grades = (gradesRes.data.data || []).map((item: { id: string; name: string; classes?: { length: number } }) => ({
          id: item.id,
          name: item.name,
          subtitle: `${item.classes?.length || 0} classes`,
          category: "Grades" as const,
          icon: Layers,
          path: `/dashboard/grades`,
        }));

        const students = (studentsRes.data.data || []).map((item: { id: string; name: string; email: string }) => ({
          id: item.id,
          name: item.name,
          subtitle: item.email,
          category: "Students" as const,
          icon: Users,
          path: `/dashboard/students`,
        }));

        const folders = (foldersRes.data.data || []).map((item: { id: string; name: string; grade?: { name: string }; class?: { name: string } }) => ({
          id: item.id,
          name: item.name,
          subtitle: item.grade?.name || item.class?.name || "Root folder",
          category: "Folders" as const,
          icon: FolderOpen,
          path: `/dashboard/folders`,
        }));

        const content = (contentRes.data.data || []).map((item: { id: string; title: string; type?: string }) => ({
          id: item.id,
          name: item.title,
          subtitle: item.type || "Content",
          category: "Content" as const,
          icon: FileText,
          path: `/dashboard/content`,
        }));

        setAllData([...classes, ...grades, ...students, ...folders, ...content]);
      } catch (error) {
        console.error("Failed to fetch search data:", error);
      }
    };

    fetchAllData();
  }, []);

  // Filter results based on query
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSelectedIndex(-1);
      return;
    }

    setLoading(true);
    const filtered = allData.filter(
      (item) =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
    setSelectedIndex(-1);
    setLoading(false);
  }, [query, allData]);

  // Group results by category
  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.category]) {
      acc[result.category] = [];
    }
    acc[result.category].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const flatResults = Object.values(groupedResults).flat();

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => (prev < flatResults.length - 1 ? prev + 1 : prev));
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0 && flatResults[selectedIndex]) {
            navigate(flatResults[selectedIndex].path);
            setIsOpen(false);
            setQuery("");
          }
          break;
        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          inputRef.current?.blur();
          break;
      }
    },
    [groupedResults, selectedIndex, navigate]
  );

  const handleResultClick = (result: SearchResult) => {
    navigate(result.path);
    setIsOpen(false);
    setQuery("");
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-sm xl:max-w-md">
      <div className="relative">
        <Search
          size={16}
          className={clsx(
            "absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors",
            isOpen ? "text-indigo-500" : "text-slate-400"
          )}
        />
        <input
          ref={inputRef}
          type="search"
          placeholder="Search classes, grades, students..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className={clsx(
            "h-10 w-full rounded-xl border pl-10 pr-10 text-sm text-slate-700 placeholder:text-slate-400 transition-all duration-200 outline-none",
            isOpen
              ? "border-indigo-500 bg-white ring-2 ring-indigo-500 ring-offset-0"
              : "border-slate-200 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0"
          )}
          aria-label="Global search"
          aria-expanded={isOpen}
          aria-controls="search-results"
        />
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-0.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {isOpen && (
        <div
          id="search-results"
          className="absolute left-0 right-0 z-50 mt-2 max-h-96 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl animate-in fade-in slide-in-from-top-2 duration-200"
          role="listbox"
        >
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={24} className="animate-spin text-slate-400" />
            </div>
          ) : query && results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                <Search size={20} />
              </div>
              <p className="mt-3 text-sm font-medium text-slate-900">No results found</p>
              <p className="mt-1 text-xs text-slate-500">Try adjusting your search query</p>
            </div>
          ) : !query ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                <Search size={20} />
              </div>
              <p className="mt-3 text-sm font-medium text-slate-900">Start typing to search</p>
              <p className="mt-1 text-xs text-slate-500">Search across classes, grades, students, folders, and content</p>
            </div>
          ) : (
            <div className="py-2">
              {Object.entries(groupedResults).map(([category, items]) => (
                <div key={category} className="px-3 py-2">
                  <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {category}
                  </p>
                  {items.map((item, index) => {
                    const config = CATEGORY_CONFIG[item.category];
                    const Icon = config.icon;
                    const flatIndex = Object.entries(groupedResults)
                      .slice(0, Object.keys(groupedResults).indexOf(category))
                      .reduce((sum, [, vals]) => sum + vals.length, 0) + index;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleResultClick(item)}
                        className={clsx(
                          "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition",
                          selectedIndex === flatIndex
                            ? "bg-indigo-50"
                            : "hover:bg-slate-50"
                        )}
                        role="option"
                        aria-selected={selectedIndex === flatIndex}
                      >
                        <div className={clsx("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg shadow-sm", config.color)}>
                          <Icon size={16} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-slate-900">{item.name}</p>
                          <p className="truncate text-xs text-slate-500">{item.subtitle}</p>
                        </div>
                        <span
                          className={clsx(
                            "shrink-0 rounded-md px-2 py-0.5 text-xs font-medium",
                            config.badgeColor
                          )}
                        >
                          {item.category}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
