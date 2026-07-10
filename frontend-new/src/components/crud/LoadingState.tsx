import { Skeleton } from "@/components/ui/skeleton"
import { TableCell, TableRow } from "@/components/ui/table"

interface LoadingStateProps {
  /** Number of skeleton rows to render. */
  rows?: number
  /** Number of columns (should match the DataTable column count). */
  columns: number
}

/**
 * Skeleton rows for a DataTable body while data is loading.
 * Rendered inside a <tbody> so column widths stay aligned.
 */
export function LoadingState({ rows = 5, columns }: LoadingStateProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={rowIndex} className="border-slate-100 hover:bg-transparent">
          {Array.from({ length: columns }).map((__, colIndex) => (
            <TableCell key={colIndex} className="px-4 py-2.5">
              <Skeleton
                className="h-4 rounded-md"
                style={{ width: colIndex === 0 ? "60%" : "40%" }}
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}
