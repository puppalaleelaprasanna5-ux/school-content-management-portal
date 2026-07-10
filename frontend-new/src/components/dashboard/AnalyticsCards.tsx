import { StatCard, type StatCardProps } from "@/components/dashboard/StatCard"
import { Skeleton } from "@/components/ui/skeleton"

interface AnalyticsCardsProps {
  stats: StatCardProps[]
  loading?: boolean
}

export function AnalyticsCards({ stats, loading }: AnalyticsCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-[124px] rounded-2xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  )
}
