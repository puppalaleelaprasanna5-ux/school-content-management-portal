import { type ReactNode } from "react"
import { MoreHorizontal, Pencil, Trash2, TriangleAlert } from "lucide-react"

import { Button } from "@/components/ui/button"

import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EmptyState } from "@/components/crud/EmptyState"
import { LoadingState } from "@/components/crud/LoadingState"
import { cn } from "@/lib/utils"

export interface Column<T> {
  key: string
  header: ReactNode
  /** Cell renderer. Receives the whole row. */
  cell: (row: T) => ReactNode
  align?: "left" | "right" | "center"
  className?: string
  headerClassName?: string
}

export interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  getRowId: (row: T) => string
  loading?: boolean
  loadingRows?: number
  /** Error message to show instead of rows; pair with onRetry. */
  error?: string | null
  onRetry?: () => void
  /** Custom empty state; falls back to the default EmptyState. */
  emptyState?: ReactNode
  onEdit?: (row: T) => void
  onDelete?: (row: T) => void
  /** Override the default row actions entirely. */
  renderRowActions?: (row: T) => ReactNode
  /** Max height of the scroll area (enables the sticky header). */
  maxHeight?: string
}

const alignClass = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
} as const

export function DataTable<T>({
  columns,
  data,
  getRowId,
  loading = false,
  loadingRows = 5,
  error,
  onRetry,
  emptyState,
  onEdit,
  onDelete,
  renderRowActions,
  maxHeight = "65vh",
}: DataTableProps<T>) {
  const hasActions = Boolean(renderRowActions || onEdit || onDelete)
  const totalColumns = columns.length + (hasActions ? 1 : 0)
  const hasError = !loading && !!error
  const isEmpty = !loading && !hasError && data.length === 0

  return (
    <div
      className="w-full overflow-auto rounded-2xl border border-slate-200 bg-white shadow-sm"
      style={{ maxHeight }}
    >
      <table className="w-full caption-bottom border-collapse text-sm">
        <TableHeader className="sticky top-0 z-10">
          <TableRow className="border-0 bg-slate-50/90 shadow-[inset_0_-1px_0_0_var(--color-slate-200)] backdrop-blur hover:bg-slate-50/90">
            {columns.map((column) => (
              <TableHead
                key={column.key}
                className={cn(
                  "h-10 px-4 text-[11px] font-semibold tracking-wider text-slate-500 uppercase",
                  alignClass[column.align ?? "left"],
                  column.headerClassName
                )}
              >
                {column.header}
              </TableHead>
            ))}
            {hasActions && (
              <TableHead className="h-10 w-14 px-4 text-right text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                <span className="sr-only">Actions</span>
              </TableHead>
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading && <LoadingState rows={loadingRows} columns={totalColumns} />}

          {hasError && (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={totalColumns} className="p-0">
                <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
                    <TriangleAlert className="size-7" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-900">
                      Couldn&apos;t load data
                    </p>
                    <p className="mx-auto max-w-sm text-sm text-slate-500">
                      {error}
                    </p>
                  </div>
                  {onRetry && (
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-1 rounded-xl"
                      onClick={onRetry}
                    >
                      Try again
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          )}

          {isEmpty && (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={totalColumns} className="p-0">
                {emptyState ?? <EmptyState />}
              </TableCell>
            </TableRow>
          )}

          {!loading &&
            !hasError &&
            data.map((row) => (
              <TableRow
                key={getRowId(row)}
                className="group border-slate-100 transition-colors hover:bg-slate-50/80"
              >
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    className={cn(
                      "px-4 py-2.5 text-slate-700",
                      alignClass[column.align ?? "left"],
                      column.className
                    )}
                  >
                    {column.cell(row)}
                  </TableCell>
                ))}
                {hasActions && (
                  <TableCell className="px-4 py-2.5 text-right">
                    {renderRowActions ? (
                      renderRowActions(row)
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          aria-label="Row actions"
                          className="inline-flex size-8 items-center justify-center rounded-lg text-slate-400 opacity-60 transition-all outline-none group-hover:opacity-100 hover:bg-slate-200/70 hover:text-slate-700 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-indigo-600/40 aria-expanded:bg-slate-200/70 aria-expanded:text-slate-700 aria-expanded:opacity-100"
                        >
                          <MoreHorizontal className="size-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          sideOffset={6}
                          className="w-40 rounded-xl p-1 shadow-lg shadow-slate-900/5"
                        >
                          {onEdit && (
                            <DropdownMenuItem
                              className="gap-2.5 rounded-lg px-2 py-2"
                              onClick={() => onEdit(row)}
                            >
                              <Pencil className="size-4" />
                              Edit
                            </DropdownMenuItem>
                          )}
                          {onDelete && (
                            <DropdownMenuItem
                              variant="destructive"
                              className="gap-2.5 rounded-lg px-2 py-2"
                              onClick={() => onDelete(row)}
                            >
                              <Trash2 className="size-4" />
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
        </TableBody>
      </table>
    </div>
  )
}
