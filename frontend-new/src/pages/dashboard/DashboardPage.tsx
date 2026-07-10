import { useMemo } from "react"
import { GraduationCap, Layers, Users, FolderOpen, FileText } from "lucide-react"

import { WelcomeHero } from "@/components/dashboard/WelcomeHero"
import { AnalyticsCards } from "@/components/dashboard/AnalyticsCards"
import { PerformanceChart } from "@/components/dashboard/PerformanceChart"
import { QuickActions } from "@/components/dashboard/QuickActions"
import { RecentActivity } from "@/components/dashboard/RecentActivity"
import { RecentUploads } from "@/components/dashboard/RecentUploads"
import { useResource } from "@/hooks/useResource"
import {
  activitiesApi,
  classesApi,
  contentApi,
  foldersApi,
  gradesApi,
  studentsApi,
} from "@/lib/api/services"
import type { StatCardProps } from "@/components/dashboard/StatCard"

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const TYPE_COLORS: Record<string, string> = {
  PDF: "#4f46e5",
  VIDEO: "#7c3aed",
  TEXT: "#2563eb",
}

export function DashboardPage() {
  // Core resources — fetched together so one failure doesn't block the rest.
  const core = useResource(async () => {
    const [grades, classes, students, folders, content] = await Promise.all([
      gradesApi.list(),
      classesApi.list(),
      studentsApi.list(),
      foldersApi.list(),
      contentApi.list(),
    ])
    return { grades, classes, students, folders, content }
  })

  // Activities live behind a separate request — the backend may not have the
  // table provisioned, so we isolate its failure to just this widget.
  const activitiesRes = useResource(() => activitiesApi.recent(6))

  const loading = core.loading
  const data = core.data

  const stats: StatCardProps[] = useMemo(
    () => [
      { label: "Classes", value: data?.classes.length ?? 0, subtitle: "Active sections", icon: GraduationCap },
      { label: "Grades", value: data?.grades.length ?? 0, subtitle: "Grade levels", icon: Layers },
      { label: "Students", value: data?.students.length ?? 0, subtitle: "Enrolled learners", icon: Users },
      { label: "Folders", value: data?.folders.length ?? 0, subtitle: "Organized spaces", icon: FolderOpen },
      { label: "Content", value: data?.content.length ?? 0, subtitle: "Files & lessons", icon: FileText },
    ],
    [data]
  )

  const performance = useMemo(() => {
    const counts = new Array(12).fill(0)
    for (const item of data?.content ?? []) {
      const month = new Date(item.createdAt).getMonth()
      if (month >= 0 && month < 12) counts[month] += 1
    }
    return MONTHS.map((month, i) => ({ month, uploads: counts[i] }))
  }, [data])

  const distribution = useMemo(() => {
    const byType = new Map<string, number>()
    for (const item of data?.content ?? []) {
      byType.set(item.type, (byType.get(item.type) ?? 0) + 1)
    }
    return Array.from(byType.entries()).map(([name, value]) => ({
      name,
      value,
      color: TYPE_COLORS[name] ?? "#c7d2fe",
    }))
  }, [data])

  const recentUploads = useMemo(
    () => (data?.content ?? []).slice(0, 5),
    [data]
  )

  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-6 px-4 sm:px-6 lg:px-8">
      <WelcomeHero />

      <AnalyticsCards stats={stats} loading={loading} />

      {/* Analytics + Quick Actions */}
      <div className="grid items-start gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PerformanceChart data={performance} />
        </div>
        <QuickActions />
      </div>

      {/* Recent Uploads + Recent Activity */}
      <div className="grid items-start gap-6 lg:grid-cols-3">
        <RecentUploads
          className="lg:col-span-2"
          items={recentUploads}
          distribution={distribution}
          loading={loading}
        />
        <RecentActivity
          activities={activitiesRes.data ?? []}
          loading={activitiesRes.loading}
          error={activitiesRes.error}
        />
      </div>
    </div>
  )
}

export default DashboardPage
