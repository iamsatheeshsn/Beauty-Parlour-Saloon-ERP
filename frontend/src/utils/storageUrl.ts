import { API_BASE_URL } from '@/constants/app'

export function storageUrl(path: string | null | undefined): string | null {
  if (!path) return null
  if (/^https?:\/\//i.test(path)) return path
  const origin = API_BASE_URL.replace(/\/api\/v1\/?$/i, '')
  return `${origin}/storage/${path.replace(/^\/+/, '')}`
}
