import { Link } from "react-router-dom"
import { UploadCloud } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/crud/EmptyState"
import { cn } from "@/lib/utils"
import type { Content, ContentType } from "@/lib/api/types"

interface DistributionSlice {
  name: string
  value: number
  color: string
}

interface RecentUploadsProps {
  items: Content[]
  /** Content grouped by type — powers the donut + legend. */
  distribution: DistributionSlice[]
  loading?: boolean
  className?: string
}

const typeStyles: Record<ContentType, string> = {
  PDF: "bg-rose-50 text-rose-600",
  VIDEO: "bg-violet-50 text-violet-600",
  TEXT: "bg-blue-50 text-blue-600",
}

// Fixed legend so PDF / Video / Text always show, matching the donut colors.
const LEGEND: { key: ContentType; label: string; color: string }[] = [
  { key: "PDF", label: "PDF", color: "#4f46e5" },
  { key: "VIDEO", label: "Video", color: "#7c3aed" },
  { key: "TEXT", label: "Text", color: "#2563eb" },
]

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value))
}

export function RecentUploads({
  items,
  distribution,
  loading,
  className,
}: RecentUploadsProps) {
  const total = distribution.reduce((sum, slice) => sum + slice.value, 0)

  return (
    <Card
      className={cn(
        "h-fit min-h-[320px] gap-0 rounded-2xl border-0 p-6 shadow-sm ring-1 ring-slate-200/70",
        className
      )}
    >
      <div>
        <h3 className="text-base font-semibold text-slate-900">Recent uploads</h3>
        <p className="mt-0.5 text-sm text-slate-500">
          Library breakdown and latest files
        </p>
      </div>

      {loading ? (
        <div className="mt-6 grid grid-cols-1 items-start gap-8 lg:grid-cols-[200px_1fr]">
          <div className="flex flex-col items-center gap-4">
            <Skeleton className="size-[140px] rounded-full" />
            <Skeleton className="h-4 w-36 rounded" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-9 rounded-lg" />
            ))}
          </div>
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={UploadCloud}
          title="No uploads yet"
          description="Upload your first PDF, video or lesson and it will appear here."
          className="py-12"
          action={
            <Button
              render={<Link to="/content" />}
              className="h-9 rounded-xl bg-indigo-600 px-4 text-white hover:bg-indigo-700"
            >
              <UploadCloud className="size-4" />
              Upload content
            </Button>
          }
        />
      ) : (
        <div className="mt-6 grid grid-cols-1 items-start gap-8 lg:grid-cols-[200px_1fr]">
          {/* Left column — donut + total + legend */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative size-[140px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
                      fontSize: 12,
                    }}
                  />
                  <Pie
                    data={distribution}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={46}
                    outerRadius={64}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {distribution.map((slice) => (
                      <Cell key={slice.name} fill={slice.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-semibold text-slate-900">
                  {new Intl.NumberFormat("en-US").format(total)}
                </span>
                <span className="text-[11px] text-slate-400">Total files</span>
              </div>
            </div>

            <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5">
              {LEGEND.map((entry) => (
                <li
                  key={entry.key}
                  className="flex items-center gap-1.5 text-xs text-slate-600"
                >
                  <span
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  {entry.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Right column — uploads table only */}
          <div className="min-w-0 -mx-2 overflow-x-auto lg:mx-0">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200 hover:bg-transparent">
                  <TableHead className="text-xs font-medium text-slate-500">
                    File Name
                  </TableHead>
                  <TableHead className="text-xs font-medium text-slate-500">
                    Type
                  </TableHead>
                  <TableHead className="text-xs font-medium text-slate-500">
                    Folder
                  </TableHead>
                  <TableHead className="text-right text-xs font-medium text-slate-500">
                    Date
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id} className="border-slate-100">
                    <TableCell className="max-w-[220px] truncate py-2.5 font-medium text-slate-900">
                      {item.title}
                    </TableCell>
                    <TableCell className="py-2.5">
                      <span
                        className={cn(
                          "inline-flex rounded-md px-2 py-0.5 text-xs font-medium",
                          typeStyles[item.type]
                        )}
                      >
                        {item.type}
                      </span>
                    </TableCell>
                    <TableCell className="py-2.5 text-slate-600">
                      {item.folder?.name ?? "—"}
                    </TableCell>
                    <TableCell className="py-2.5 text-right text-slate-400">
                      {formatDate(item.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </Card>
  )
}
