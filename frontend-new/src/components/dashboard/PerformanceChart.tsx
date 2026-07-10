import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

import { Card } from "@/components/ui/card"

export interface PerformancePoint {
  month: string
  uploads: number
}

export function PerformanceChart({ data }: { data: PerformancePoint[] }) {
  return (
    <Card className="h-fit gap-0 rounded-2xl border-0 p-5 shadow-sm ring-1 ring-slate-200/70">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Content uploads
          </h3>
          <p className="mt-0.5 text-sm text-slate-500">
            Uploads per month over the current year
          </p>
        </div>
        <div className="hidden items-center gap-4 text-xs sm:flex">
          <span className="flex items-center gap-1.5 text-slate-600">
            <span className="size-2.5 rounded-full bg-indigo-600" />
            Uploads
          </span>
        </div>
      </div>

      <div className="mt-4 h-[210px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 8, left: -12, bottom: 0 }}
          >
            <defs>
              <linearGradient id="fillUploads" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.28} />
                <stop offset="100%" stopColor="#4f46e5" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              stroke="#e2e8f0"
              strokeDasharray="4 4"
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              dy={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              width={40}
            />
            <Tooltip
              cursor={{ stroke: "#c7d2fe", strokeWidth: 1 }}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #e2e8f0",
                boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
                fontSize: 12,
              }}
              labelStyle={{ color: "#0f172a", fontWeight: 600 }}
            />
            <Area
              type="monotone"
              dataKey="uploads"
              stroke="#4f46e5"
              strokeWidth={2.5}
              fill="url(#fillUploads)"
              activeDot={{ r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
