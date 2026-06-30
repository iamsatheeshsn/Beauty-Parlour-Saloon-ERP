import { cn } from '@/utils/cn'

interface SimpleBarChartProps {
  labels: string[]
  values: number[]
  formatValue: (value: number) => string
  colorClass?: string
  emptyMessage?: string
}

export function SimpleBarChart({
  labels,
  values,
  formatValue,
  colorClass = 'bg-primary/70',
  emptyMessage = 'No data for this period',
}: SimpleBarChartProps) {
  if (labels.length === 0 || values.every((v) => v === 0)) {
    return (
      <p className="flex h-48 items-center justify-center text-sm text-muted-foreground">{emptyMessage}</p>
    )
  }

  const max = Math.max(...values, 1)

  return (
    <div className="space-y-3">
      {labels.map((label, i) => {
        const value = values[i] ?? 0
        const width = `${(value / max) * 100}%`
        return (
          <div key={`${label}-${i}`} className="flex items-center gap-2 sm:gap-3">
            <span className="w-10 shrink-0 text-xs text-muted-foreground sm:w-14 sm:text-sm">{label}</span>
            <div className="h-5 flex-1 rounded bg-muted sm:h-6">
              <div className={cn('h-5 rounded sm:h-6', colorClass)} style={{ width }} />
            </div>
            <span className="w-16 shrink-0 text-right text-xs font-medium sm:w-24 sm:text-sm">
              {formatValue(value)}
            </span>
          </div>
        )
      })}
    </div>
  )
}
