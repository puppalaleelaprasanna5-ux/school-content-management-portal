import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type SelectHTMLAttributes,
} from "react";
import { ChevronDown, Check, Search } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import clsx from "clsx";

export interface SelectOption {
  value: string;
  label: string;
  icon?: LucideIcon;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  /** Applied to the wrapper — controls width/layout (e.g. "w-full", "w-44"). */
  wrapperClassName?: string;

  // Opt-in searchable combobox mode:
  searchable?: boolean;
  options?: SelectOption[];
  onValueChange?: (value: string) => void;
  placeholder?: string;
}

const controlClass =
  "h-11 w-full rounded-xl bg-white text-sm text-slate-700 shadow-sm ring-1 ring-inset outline-none transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50";

function ringClass(error: boolean) {
  return error
    ? "ring-red-300 focus:ring-2 focus:ring-red-500"
    : "ring-slate-200 hover:ring-slate-300 focus:ring-2 focus:ring-indigo-500";
}

export default function Select({
  className,
  wrapperClassName,
  error = false,
  searchable = false,
  options,
  onValueChange,
  placeholder = "Select…",
  children,
  disabled,
  value,
  ...props
}: SelectProps) {
  // ---- Searchable combobox mode ----------------------------------------
  if (searchable && options) {
    return (
      <SearchableSelect
        options={options}
        value={typeof value === "string" ? value : ""}
        onValueChange={onValueChange}
        placeholder={placeholder}
        disabled={disabled}
        error={error}
        wrapperClassName={wrapperClassName}
        className={className}
      />
    );
  }

  // ---- Native mode (backward compatible) -------------------------------
  return (
    <div className={clsx("relative", wrapperClassName)}>
      <select
        {...props}
        value={value}
        disabled={disabled}
        className={clsx(
          controlClass,
          "cursor-pointer appearance-none pl-3.5 pr-10",
          ringClass(error),
          className
        )}
      >
        {children}
      </select>
      <ChevronDown
        size={16}
        className={clsx(
          "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400",
          disabled && "opacity-50"
        )}
      />
    </div>
  );
}

// ------------------------------------------------------------------------
// Searchable, keyboard-navigable, accessible combobox
// ------------------------------------------------------------------------
interface SearchableSelectProps {
  options: SelectOption[];
  value: string;
  onValueChange?: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
  error: boolean;
  wrapperClassName?: string;
  className?: string;
}

function SearchableSelect({
  options,
  value,
  onValueChange,
  placeholder,
  disabled,
  error,
  wrapperClassName,
  className,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const listboxId = useId();
  const optionId = (i: number) => `${listboxId}-opt-${i}`;

  const selected = options.find((o) => o.value === value) ?? null;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  // Close on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // On open: focus search, position active on selected
  useEffect(() => {
    if (open) {
      const idx = filtered.findIndex((o) => o.value === value);
      setActiveIndex(idx >= 0 ? idx : 0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Keep active option in view
  useEffect(() => {
    if (!open) return;
    const el = document.getElementById(optionId(activeIndex));
    el?.scrollIntoView({ block: "nearest" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, open]);

  function choose(opt: SelectOption) {
    onValueChange?.(opt.value);
    setOpen(false);
    setQuery("");
  }

  function onTriggerKeyDown(e: React.KeyboardEvent) {
    if (disabled) return;
    if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(e.key)) {
      e.preventDefault();
      setOpen(true);
    }
  }

  function onListKeyDown(e: React.KeyboardEvent) {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => Math.min(filtered.length - 1, i + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => Math.max(0, i - 1));
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(filtered.length - 1);
        break;
      case "Enter":
        e.preventDefault();
        if (filtered[activeIndex]) choose(filtered[activeIndex]);
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        setQuery("");
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  }

  const SelectedIcon = selected?.icon;

  return (
    <div ref={containerRef} className={clsx("relative", wrapperClassName)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onTriggerKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        className={clsx(
          controlClass,
          "flex cursor-pointer items-center gap-2 pl-3.5 pr-10 text-left",
          ringClass(error),
          className
        )}
      >
        {SelectedIcon && <SelectedIcon size={16} className="shrink-0 text-slate-400" />}
        <span className={clsx("truncate", !selected && "text-slate-400")}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          size={16}
          className={clsx(
            "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full min-w-[12rem] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-300/40 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center gap-2 border-b border-slate-100 px-3">
            <Search size={16} className="shrink-0 text-slate-400" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIndex(0);
              }}
              onKeyDown={onListKeyDown}
              placeholder="Search…"
              aria-label="Search options"
              aria-controls={listboxId}
              aria-activedescendant={filtered[activeIndex] ? optionId(activeIndex) : undefined}
              className="h-10 w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>

          <ul
            ref={listRef}
            id={listboxId}
            role="listbox"
            className="max-h-60 overflow-y-auto p-1.5"
          >
            {filtered.length === 0 ? (
              <li className="px-3 py-6 text-center text-sm text-slate-400">No results</li>
            ) : (
              filtered.map((opt, i) => {
                const isSelected = opt.value === value;
                const isActive = i === activeIndex;
                const OptIcon = opt.icon;
                return (
                  <li
                    key={opt.value}
                    id={optionId(i)}
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => choose(opt)}
                    className={clsx(
                      "flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                      isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-700",
                      isSelected && "font-semibold"
                    )}
                  >
                    {OptIcon && <OptIcon size={16} className="shrink-0 text-slate-400" />}
                    <span className="flex-1 truncate">{opt.label}</span>
                    {isSelected && <Check size={16} className="shrink-0 text-indigo-600" />}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
