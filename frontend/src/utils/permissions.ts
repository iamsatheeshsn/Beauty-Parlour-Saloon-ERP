/**
 * Normalize API/localStorage permission values to a flat string array.
 */
export function normalizePermissions(raw: unknown): string[] {
  if (raw == null) return []

  if (Array.isArray(raw)) {
    return raw.flatMap((item) => {
      if (typeof item === 'string') return item
      if (item && typeof item === 'object' && 'name' in item) {
        const name = (item as { name: unknown }).name
        return typeof name === 'string' ? name : []
      }
      return []
    })
  }

  if (typeof raw === 'object') {
    return Object.entries(raw as Record<string, unknown>).flatMap(([key, value]) => {
      if (typeof value === 'string') return value
      if (value === true) return key
      return []
    })
  }

  if (typeof raw === 'string') {
    const trimmed = raw.trim()
    if (!trimmed) return []
    if (trimmed.startsWith('[')) {
      try {
        return normalizePermissions(JSON.parse(trimmed))
      } catch {
        return []
      }
    }
    return trimmed.split(',').map((part) => part.trim()).filter(Boolean)
  }

  return []
}
