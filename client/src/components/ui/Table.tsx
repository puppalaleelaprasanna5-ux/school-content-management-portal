import type { ReactNode } from "react";
import clsx from "clsx";

interface TableColumn<T> {
  key: string;
  header: string | ReactNode;
  cell: (item: T) => ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  emptyState?: ReactNode;
  loading?: boolean;
  className?: string;
}

export default function Table<T>({
  columns,
  data,
  emptyState,
  loading = false,
  className,
}: TableProps<T>) {
  if (loading) {
    return (
      <div className={clsx("rounded-xl border border-slate-200/80 bg-white", className)}>
        <div className="p-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="mb-3 flex animate-pulse items-center gap-4 rounded-xl bg-slate-50 p-4 last:mb-0"
            >
              <div className="h-4 w-1/4 rounded bg-slate-200" />
              <div className="h-4 w-1/3 rounded bg-slate-200" />
              <div className="ml-auto h-4 w-20 rounded bg-slate-200" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0 && emptyState) {
    return (
      <div className={clsx("rounded-xl border border-slate-200/80 bg-white", className)}>
        <div className="p-6">{emptyState}</div>
      </div>
    );
  }

  return (
    <div className={clsx("overflow-x-auto rounded-xl border border-slate-200/80 bg-white", className)}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/50">
            {columns.map((column) => (
              <th
                key={column.key}
                className={clsx(
                  "px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500",
                  column.className
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((item, index) => (
            <tr
              key={index}
              className="transition-colors hover:bg-slate-50/50"
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={clsx(
                    "px-6 py-4 text-sm text-slate-700",
                    column.className
                  )}
                >
                  {column.cell(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
