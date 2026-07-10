import { Search, X, Loader2 } from "lucide-react";
import clsx from "clsx";

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  /** Shows a spinner in place of the search icon. */
  loading?: boolean;
  /** Keyboard-shortcut hint shown when empty, e.g. "⌘K" or "/". */
  shortcut?: string;
  "aria-label"?: string;
}

export default function SearchBox({
  value,
  onChange,
  placeholder = "Search…",
  className,
  loading = false,
  shortcut,
  "aria-label": ariaLabel,
}: SearchBoxProps) {
  const showClear = value.length > 0 && !loading;
  const showShortcut = Boolean(shortcut) && value.length === 0 && !loading;

  return (
    <div className={clsx("relative", className)}>
      {/* Leading icon / loading spinner */}
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
        {loading ? <Loader2 size={18} className="animate-spin text-indigo-500" /> : <Search size={18} />}
      </span>

      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel ?? placeholder}
        className={clsx(
          "h-11 w-full rounded-full bg-white pl-11 text-sm text-slate-900 shadow-sm",
          "ring-1 ring-inset ring-slate-200 outline-none transition-all duration-200",
          "placeholder:text-slate-400 hover:ring-slate-300",
          "focus:ring-2 focus:ring-indigo-500 focus:shadow-lg focus:shadow-indigo-500/10",
          "[&::-webkit-search-cancel-button]:appearance-none",
          showClear ? "pr-10" : showShortcut ? "pr-14" : "pr-4"
        )}
      />

      {/* Clear button */}
      {showClear && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition-all duration-150 hover:bg-slate-100 hover:text-slate-600 animate-in fade-in zoom-in-90"
        >
          <X size={16} />
        </button>
      )}

      {/* Keyboard shortcut hint */}
      {showShortcut && (
        <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[11px] font-medium text-slate-400">
          {shortcut}
        </kbd>
      )}
    </div>
  );
}
