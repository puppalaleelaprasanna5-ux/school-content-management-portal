import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

import { Card } from "@/components/ui/card"

export interface DistributionSlice {
  name: string
  value: number
  color: string
}

export function ContentDistributionChart({ data }: { data: DistributionSlice[] }) {
  const total = data.reduce((sum, slice) => sum + slice.value, 0)
  return (
    <Card className="h-full gap-0 rounded-2xl border-0 p-5 shadow-sm ring-1 ring-slate-200/70">
      <div>
        <h3 className="text-base font-semibold text-slate-900">
          Content distribution
        </h3>
        <p className="mt-0.5 text-sm text-slate-500">By file type</p>
      </div>

      <div className="mt-4 flex flex-col items-center gap-5 sm:flex-row">
        <div className="relative h-[180px] w-[180px] shrink-0">
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
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={62}
                outerRadius={92}
                paddingAngle={3}
                stroke="none"
              >
                {data.map((slice) => (
                  <Cell key={slice.name} fill={slice.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-semibold text-slate-900">
              {new Intl.NumberFormat("en-US").format(total)}
            </span>
            <span className="text-xs text-slate-400">Total files</span>
          </div>
        </div>

        <ul className="grid w-full flex-1 gap-2.5">
          {data.map((slice) => {
            const pct = Math.round((slice.value / total) * 100)
            return (
              <li key={slice.name} className="flex items-center gap-3 text-sm">
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: slice.color }}
                />
                <span className="flex-1 text-slate-600">{slice.name}</span>
                <span className="font-medium text-slate-900">{pct}%</span>
              </li>
            )
          })}
        </ul>
      </div>
    </Card>
  )
}
