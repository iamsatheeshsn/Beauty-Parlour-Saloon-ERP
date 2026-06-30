import { ChevronLeft, ChevronRight } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { cn } from '@/utils/cn'
import { Logo } from '@/components/brand/Logo'
import { useAuth } from '@/contexts/AuthContext'
import { useSidebar } from '@/contexts/SidebarContext'
import { usePermission } from '@/hooks/usePermission'
import { visibleNavGroups } from '@/constants/navigation'

export function Sidebar() {
  const { collapsed, toggleCollapsed, mobileOpen, setMobileOpen } = useSidebar()
  const { isAuthenticated } = useAuth()
  const { hasPermission, hasAnyPermission } = usePermission()
  const location = useLocation()

  const groups = visibleNavGroups(isAuthenticated, hasPermission, hasAnyPermission)

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname, setMobileOpen])

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border bg-card transition-all duration-300 ease-in-out',
        collapsed ? 'w-20' : 'w-64',
        mobileOpen ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0'
      )}
    >
      <div
        className={cn(
          'flex h-16 shrink-0 items-center border-b border-border sm:h-[4.5rem]',
          collapsed ? 'justify-center px-2' : 'px-4'
        )}
      >
        {collapsed ? (
          <Logo variant="icon" className="mx-auto" iconClassName="h-9 w-9" />
        ) : (
          <Logo showTagline={false} className="min-w-0" />
        )}
      </div>

      <nav className="flex-1 overflow-y-auto overscroll-contain p-2 sm:p-3">
        {groups.map((group, groupIndex) => (
          <div
            key={group.id}
            className={cn(groupIndex > 0 && (collapsed ? 'mt-3 border-t border-border/60 pt-3' : 'mt-4'))}
          >
            {!collapsed && (
              <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.disabled ? '#' : item.to}
                  onClick={(e) => item.disabled && e.preventDefault()}
                  title={collapsed ? item.label : undefined}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                      collapsed && 'justify-center px-2',
                      item.disabled && 'cursor-not-allowed opacity-40',
                      isActive && !item.disabled
                        ? 'bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 text-primary shadow-sm'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )
                  }
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <button
        type="button"
        onClick={toggleCollapsed}
        className="hidden h-12 shrink-0 items-center justify-center border-t border-border text-muted-foreground transition-colors hover:bg-muted hover:text-primary lg:flex"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
      </button>
    </aside>
  )
}
