import { cn } from '@/utils/cn'
import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: string
  trendUp?: boolean
  gradient?: string
  className?: string
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
  gradient = 'from-[#7A2E3E] via-[#9B3D52] to-[#B76E79]',
  className,
}: StatCardProps) {
  const displayValue = typeof value === 'number' ? value.toLocaleString() : value

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border border-border bg-card p-4 polishe-card-glow transition-all hover:shadow-md sm:p-5',
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-muted-foreground sm:text-sm">{title}</p>
          <p
            className="mt-1.5 flex h-7 items-center truncate text-lg font-bold tabular-nums leading-none tracking-tight text-foreground sm:h-8 sm:text-xl"
            title={displayValue}
          >
            {displayValue}
          </p>
          {trend && (
            <p className={cn('mt-1 text-xs font-medium', trendUp ? 'text-success' : 'text-destructive')}>
              {trend}
            </p>
          )}
        </div>
        <div className={cn('shrink-0 rounded-lg bg-gradient-to-br p-2.5 text-white shadow-md sm:rounded-xl sm:p-3', gradient)}>
          <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
      </div>
      <div className={cn('absolute -bottom-4 -right-4 h-20 w-20 rounded-full bg-gradient-to-br opacity-10 sm:h-24 sm:w-24', gradient)} />
    </div>
  )
}
