import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Bell } from 'lucide-react'
import { Link } from 'react-router-dom'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { useAppSettings } from '@/contexts/SettingsContext'
import { usePermission } from '@/hooks/usePermission'
import { notificationService } from '@/services/notificationService'
import { formatDate } from '@/utils/format'
import {
  dismissNotificationAlerts,
  getDismissedNotificationAlerts,
  getNotificationsLastSeenAt,
  isNotificationUnread,
  setNotificationsLastSeenAt,
} from '@/utils/notifications'
import { cn } from '@/utils/cn'

export function NotificationBell() {
  const { settings } = useAppSettings()
  const { hasPermission } = usePermission()
  const canViewLogs = hasPermission('activity-logs.view')

  const [lastSeenAt, setLastSeenAt] = useState<string | null>(() => getNotificationsLastSeenAt())
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>(() => getDismissedNotificationAlerts())

  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationService.list,
    refetchInterval: 60_000,
  })

  const items = data?.items ?? []
  const alerts = data?.alerts ?? []

  const visibleAlerts = useMemo(
    () => alerts.filter((alert) => !dismissedAlerts.includes(alert.type)),
    [alerts, dismissedAlerts]
  )

  const unreadItems = useMemo(
    () => items.filter((item) => isNotificationUnread(item.created_at, lastSeenAt)),
    [items, lastSeenAt]
  )

  const badgeCount = visibleAlerts.length + unreadItems.length

  const markAsRead = () => {
    const now = new Date().toISOString()
    setLastSeenAt(now)
    setNotificationsLastSeenAt(now)

    if (alerts.length > 0) {
      const types = alerts.map((alert) => alert.type)
      dismissNotificationAlerts(types)
      setDismissedAlerts((prev) => [...new Set([...prev, ...types])])
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (open) {
      markAsRead()
    }
  }

  return (
    <DropdownMenu.Root onOpenChange={handleOpenChange}>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {badgeCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-secondary px-1 text-[10px] font-bold text-secondary-foreground">
              {badgeCount > 9 ? '9+' : badgeCount}
            </span>
          )}
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="z-50 w-[min(calc(100vw-2rem),22rem)] rounded-xl border border-border bg-card p-1 shadow-lg"
          sideOffset={8}
          align="end"
        >
          <div className="border-b border-border px-3 py-2">
            <p className="text-sm font-semibold">Notifications</p>
            <p className="text-xs text-muted-foreground">Recent activity and alerts</p>
          </div>

          {isLoading ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">Loading…</p>
          ) : alerts.length === 0 && items.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">No notifications yet</p>
          ) : (
            <div className="max-h-80 overflow-y-auto py-1">
              {alerts.map((alert) => (
                <DropdownMenu.Item key={alert.type} asChild>
                  <Link
                    to={alert.href}
                    className="flex cursor-pointer flex-col gap-0.5 rounded-lg px-3 py-2 outline-none hover:bg-muted"
                  >
                    <span className="text-xs font-semibold text-amber-700">{alert.title}</span>
                    <span className="text-sm">{alert.message}</span>
                  </Link>
                </DropdownMenu.Item>
              ))}

              {items.map((item) => (
                <DropdownMenu.Item
                  key={item.id}
                  className="flex cursor-default flex-col gap-0.5 rounded-lg px-3 py-2 outline-none hover:bg-muted"
                  onSelect={(e) => e.preventDefault()}
                >
                  <span className="text-sm font-medium">{item.action_label}</span>
                  {item.description && (
                    <span className="line-clamp-2 text-xs text-muted-foreground">{item.description}</span>
                  )}
                  <span className="text-[10px] text-muted-foreground/80">
                    {formatDate(item.created_at, settings.timezone)}
                    {item.user?.name ? ` · ${item.user.name}` : ''}
                  </span>
                </DropdownMenu.Item>
              ))}
            </div>
          )}

          {canViewLogs && (
            <>
              <DropdownMenu.Separator className="my-1 h-px bg-border" />
              <DropdownMenu.Item asChild>
                <Link
                  to="/activity-logs"
                  className={cn(
                    'block rounded-lg px-3 py-2 text-center text-sm font-medium text-primary outline-none hover:bg-muted'
                  )}
                >
                  View all activity
                </Link>
              </DropdownMenu.Item>
            </>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
