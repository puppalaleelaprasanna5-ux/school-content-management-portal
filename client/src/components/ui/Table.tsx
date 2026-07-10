import { useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, ChevronsUpDown, ArrowUp, ArrowDown } from "lucide-react";
import clsx from "clsx";

interface TableColumn<T> {
  key: string;
  header: string | ReactNode;
  cell: (item: T) => ReactNode;
  className?: string;
  /** Opt-in: render a built-in sort control in the header. */
  sortable?: boolean;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  emptyState?: ReactNode;
  loading?: boolean;
  className?: string;
  pageSize?: number;

  // Opt-in sorting (backward compatible — pages may keep custom header controls)
  sortKey?: string;
  sortDirection?: "asc" | "desc";
  onSort?: (key: string) => void;
}

const shell =
  "overflow-hidden rounded-2xl bg-white shadow-sm shadow-slate-200/40 ring-1 ring-slate-200/70";

const headerCell =
  "border-b border-slate-200 px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500";

function SortIcon({ active, direction }: { active: boolean; direction?: "asc" | "desc" }) {
  if (!active) return <ChevronsUpDown size={14} className="text-slate-300" />;
  return direction === "asc" ? (
    <ArrowUp size={14} className="text-indigo-500" />
  ) : (
    <ArrowDown size={14} className="text-indigo-500" />
  );
}

export default function Table<T>({
  columns,
  data,
  emptyState,
  loading = false,
  className,
  pageSize = 10,
  sortKey,
  sortDirection,
  onSort,
}: TableProps<T>) {
  const [page, setPage] = useState(1);

  if (loading) {
    return (
      <div className={clsx(shell, className)}>
        <div className="p-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="mb-2 flex animate-pulse items-center gap-4 rounded-xl bg-slate-50 p-4 last:mb-0"
            >
              <div className="h-9 w-9 rounded-lg bg-slate-200" />
              <div className="h-3.5 w-1/4 rounded bg-slate-200" />
              <div className="h-3.5 w-1/3 rounded bg-slate-200" />
              <div className="ml-auto h-3.5 w-16 rounded bg-slate-200" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0 && emptyState) {
    return (
      <div className={clsx(shell, className)}>
        <div className="p-6">{emptyState}</div>
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageData = data.slice(start, start + pageSize);
  const showPagination = data.length > pageSize;

  return (
    <div className={clsx(shell, className)}>
      <div className="max-h-[65vh] overflow-auto">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 z-10">
            <tr className="bg-slate-50/95 backdrop-blur-sm">
              {columns.map((column) => (
                <th key={column.key} className={clsx(headerCell, column.className)}>
                  {column.sortable ? (
                    <button
                      type="button"
                      onClick={() => onSort?.(column.key)}
                      className="inline-flex items-center gap-1.5 uppercase tracking-wider transition-colors hover:text-slate-700"
                    >
                      {column.header}
                      <SortIcon
                        active={sortKey === column.key}
                        direction={sortKey === column.key ? sortDirection : undefined}
                      />
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.map((item, index) => (
              <tr
                key={index}
                className={clsx(
                  "border-b border-slate-100 transition-colors last:border-0",
                  index % 2 === 1 && "bg-slate-50/40",
                  "hover:bg-indigo-50/50"
                )}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={clsx("px-5 py-3.5 text-sm text-slate-700", column.className)}
                  >
                    {column.cell(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showPagination && (
        <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-5 py-3">
          <p className="hidden text-xs text-slate-500 sm:block">
            Showing <span className="font-semibold text-slate-700">{start + 1}</span>–
            <span className="font-semibold text-slate-700">
              {Math.min(start + pageSize, data.length)}
            </span>{" "}
            of <span className="font-semibold text-slate-700">{data.length}</span>
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) pageNum = i + 1;
              else if (currentPage <= 3) pageNum = i + 1;
              else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
              else pageNum = currentPage - 2 + i;

              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setPage(pageNum)}
                  aria-current={currentPage === pageNum ? "page" : undefined}
                  className={clsx(
                    "h-8 min-w-8 rounded-lg px-2 text-sm font-medium transition-colors",
                    currentPage === pageNum
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100"
                  )}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
