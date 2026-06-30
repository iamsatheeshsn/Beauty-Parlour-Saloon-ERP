import { NavLink } from 'react-router-dom'
import { cn } from '@/utils/cn'

const tabs = [
  { label: 'Roles', to: '/roles' },
  { label: 'Permissions', to: '/permissions' },
]

export function AccessControlTabs() {
  return (
    <div className="inline-flex max-w-full gap-0.5 overflow-x-auto rounded-lg border border-border bg-muted/40 p-0.5">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) =>
            cn(
              'shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
              isActive
                ? 'bg-card text-primary shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </div>
  )
}
