const LAST_SEEN_KEY = 'beauty_salon_notifications_last_seen_at'
const DISMISSED_ALERTS_KEY = 'beauty_salon_notifications_dismissed_alerts'

export function getNotificationsLastSeenAt(): string | null {
  return sessionStorage.getItem(LAST_SEEN_KEY)
}

export function setNotificationsLastSeenAt(iso: string): void {
  sessionStorage.setItem(LAST_SEEN_KEY, iso)
}

export function getDismissedNotificationAlerts(): string[] {
  try {
    const raw = sessionStorage.getItem(DISMISSED_ALERTS_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

export function dismissNotificationAlerts(types: string[]): void {
  const merged = [...new Set([...getDismissedNotificationAlerts(), ...types])]
  sessionStorage.setItem(DISMISSED_ALERTS_KEY, JSON.stringify(merged))
}

export function isNotificationUnread(createdAt: string, lastSeenAt: string | null): boolean {
  if (!lastSeenAt) return true
  return new Date(createdAt).getTime() > new Date(lastSeenAt).getTime()
}
