import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { FileText, GraduationCap, Upload } from "lucide-react";
import clsx from "clsx";

// Mock data for charts
const CONTENT_TYPE_DATA = [
  { name: "PDF", value: 45, color: "#6366f1" },
  { name: "Video", value: 30, color: "#3b82f6" },
  { name: "Text", value: 25, color: "#10b981" },
];

const CLASSES_BY_GRADE_DATA = [
  { grade: "Grade 1", classes: 4 },
  { grade: "Grade 2", classes: 5 },
  { grade: "Grade 3", classes: 3 },
  { grade: "Grade 4", classes: 4 },
  { grade: "Grade 5", classes: 6 },
];

const UPLOADS_PER_MONTH_DATA = [
  { month: "Jan", uploads: 12 },
  { month: "Feb", uploads: 19 },
  { month: "Mar", uploads: 15 },
  { month: "Apr", uploads: 25 },
  { month: "May", uploads: 22 },
  { month: "Jun", uploads: 30 },
];

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number }>;
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg">
        <p className="text-sm font-medium text-slate-900">{payload[0].name}</p>
        <p className="text-sm text-slate-600">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

interface ChartCardProps {
  title: string;
  icon: React.ComponentType<{ size?: number }>;
  iconClassName: string;
  children: React.ReactNode;
}

function ChartCard({ title, icon: Icon, iconClassName, children }: ChartCardProps) {
  if (!Icon) return null;
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm shadow-slate-200/40 ring-1 ring-slate-200/70 transition-all duration-200 hover:shadow-lg hover:shadow-slate-200/60">
      <div className="mb-6 flex items-center gap-3">
        <div className={clsx("flex h-10 w-10 items-center justify-center rounded-xl", iconClassName)}>
          <Icon size={20} />
        </div>
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export default function AnalyticsCharts() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Content Type Distribution */}
      <ChartCard
        title="Content Type Distribution"
        icon={FileText}
        iconClassName="bg-indigo-50 text-indigo-600"
      >
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={CONTENT_TYPE_DATA}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {CONTENT_TYPE_DATA.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value, entry: unknown) => {
                const payload = (entry as { payload?: { value?: number } }).payload;
                return <span className="text-sm text-slate-600">{value} ({payload?.value || 0})</span>;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Classes by Grade */}
      <ChartCard
        title="Classes by Grade"
        icon={GraduationCap}
        iconClassName="bg-blue-50 text-blue-600"
      >
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={CLASSES_BY_GRADE_DATA}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="grade"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="classes" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Uploads per Month */}
      <ChartCard
        title="Uploads per Month"
        icon={Upload}
        iconClassName="bg-emerald-50 text-emerald-600"
      >
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={UPLOADS_PER_MONTH_DATA}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="uploads" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
