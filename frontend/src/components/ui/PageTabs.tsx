import type { LucideIcon } from 'lucide-react'
import { cn } from '@/utils/cn'

export interface PageTabItem<T extends string = string> {
  key: T
  label: string
  icon?: LucideIcon
  badge?: number | string
}

interface PageTabsProps<T extends string> {
  tabs: PageTabItem<T>[]
  active: T
  onChange: (key: T) => void
  className?: string
}

export function PageTabs<T extends string>({ tabs, active, onChange, className }: PageTabsProps<T>) {
  return (
    <div className={cn('flex flex-nowrap gap-0.5 overflow-x-auto border-b border-border', className)}>
      {tabs.map(({ key, label, icon: Icon, badge }) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          className={cn(
            'flex shrink-0 items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-1.5 text-xs font-medium transition-colors',
            active === key
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          {Icon && <Icon className="h-3.5 w-3.5 shrink-0" />}
          {label}
          {badge != null && Number(badge) > 0 && (
            <span className="rounded-full bg-destructive/10 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-destructive">
              {badge}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
