import { NavLink, Outlet } from 'react-router-dom'
import { cn } from '@/utils/cn'
import { masterNavItems } from '@/config/masterConfigs'
import { usePermission } from '@/hooks/usePermission'

export function MastersLayout() {
  const { hasPermission } = usePermission()
  const visibleItems = masterNavItems.filter((item) => hasPermission(item.permission))

  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      <aside className="w-full shrink-0 lg:w-56">
        <div className="rounded-xl border border-border bg-card p-3 shadow-sm">
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Master Data
          </p>
          <nav className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 lg:block lg:space-y-0.5 lg:overflow-visible lg:pb-0">
            {visibleItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'block shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  )
}
