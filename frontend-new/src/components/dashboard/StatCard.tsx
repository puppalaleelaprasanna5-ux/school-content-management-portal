import { type ComponentType } from "react"
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export interface StatCardProps {
  label: string
  value: number
  subtitle: string
  icon: ComponentType<{ className?: string }>
  /** Optional percentage change; the trend pill is hidden when undefined. */
  trend?: number
}

function formatValue(value: number) {
  return new Intl.NumberFormat("en-US").format(value)
}

export function StatCard({ label, value, subtitle, trend, icon: Icon }: StatCardProps) {
  const hasTrend = typeof trend === "number"
  const up = (trend ?? 0) > 0
  const flat = (trend ?? 0) === 0
  const TrendIcon = flat ? Minus : up ? ArrowUpRight : ArrowDownRight

  return (
    <Card className="h-full gap-0 rounded-2xl border-0 p-4 shadow-sm ring-1 ring-slate-200/70 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:ring-indigo-200">
      <div className="flex items-center justify-between">
        <div className="flex size-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
          <Icon className="size-[18px]" />
        </div>
        {hasTrend && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-medium",
              flat
                ? "bg-slate-100 text-slate-500"
                : up
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-rose-50 text-rose-600"
            )}
          >
            <TrendIcon className="size-3" />
            {flat ? "0%" : `${Math.abs(trend ?? 0)}%`}
          </span>
        )}
      </div>

      <p className="mt-3 text-[28px] leading-none font-semibold tracking-tight text-slate-900">
        {formatValue(value)}
      </p>
      <p className="mt-2 text-sm font-medium text-slate-700">{label}</p>
      <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>
    </Card>
  )
}
