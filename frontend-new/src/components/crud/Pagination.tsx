import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

interface PaginationProps {
  /** 1-based current page. */
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
}

/** Builds a page list with ellipsis, e.g. [1, "…", 4, 5, 6, "…", 20]. */
function buildPages(current: number, count: number): (number | "ellipsis")[] {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1)

  const pages: (number | "ellipsis")[] = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(count - 1, current + 1)

  if (start > 2) pages.push("ellipsis")
  for (let i = start; i <= end; i += 1) pages.push(i)
  if (end < count - 1) pages.push("ellipsis")

  pages.push(count)
  return pages
}

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
}: PaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)
  const pages = buildPages(page, pageCount)

  const baseBtn =
    "inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-indigo-600/40 disabled:pointer-events-none disabled:opacity-40"
  const arrowBtn =
    "border border-slate-200 bg-white text-slate-600 shadow-sm shadow-slate-900/[0.03] hover:bg-slate-50 hover:text-slate-900"

  return (
    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
      <p className="text-sm text-slate-500">
        Showing <span className="font-semibold text-slate-700">{from}</span>–
        <span className="font-semibold text-slate-700">{to}</span> of{" "}
        <span className="font-semibold text-slate-700">{total}</span>
      </p>

      <nav className="flex items-center gap-1.5" aria-label="Pagination">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
          className={cn(baseBtn, arrowBtn)}
        >
          <ChevronLeft className="size-4" />
        </button>

        {pages.map((item, index) =>
          item === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className="inline-flex h-9 min-w-9 items-center justify-center text-sm text-slate-400"
            >
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              aria-current={item === page ? "page" : undefined}
              className={cn(
                baseBtn,
                item === page
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30 hover:bg-indigo-700"
                  : "text-slate-600 hover:bg-slate-100"
              )}
            >
              {item}
            </button>
          )
        )}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pageCount}
          aria-label="Next page"
          className={cn(baseBtn, arrowBtn)}
        >
          <ChevronRight className="size-4" />
        </button>
      </nav>
    </div>
  )
}
