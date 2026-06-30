import { SALON } from '@/constants/websiteContent'
import type { PublicSettings } from '@/types/publicWebsite'

const CATEGORY_IMAGES: Record<string, string> = {
  HAIR: 'https://images.unsplash.com/photo-1521590832167-7bcbfda6381b?auto=format&fit=crop&w=800&q=80',
  NAILS: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80',
  SKIN: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
  SPA: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
  MAKEUP: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=800&q=80',
  WAX: 'https://images.unsplash.com/photo-1519415510929-860fa69134ef?auto=format&fit=crop&w=800&q=80',
  PACKAGES: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=800&q=80',
}

const PRODUCT_CATEGORY_IMAGES: Record<string, string> = {
  HAIR_PROD: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
  SKIN_PROD: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
  NAIL_PROD: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80',
  SPA_PROD: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
  RETAIL: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=800&q=80',
  CONSUMABLE: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
}

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=80'

export const DEFAULT_SALON_INTERIOR = DEFAULT_IMAGE

export const PAGE_BANNER_DEFAULTS = {
  banner_home:
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1600&q=80',
  banner_about:
    'https://images.unsplash.com/photo-1633681926022-84c23e8cb124?auto=format&fit=crop&w=1600&q=80',
  banner_services:
    'https://images.unsplash.com/photo-1521590832167-7bcbfda6381b?auto=format&fit=crop&w=1600&q=80',
  banner_shop:
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1600&q=80',
  banner_blog:
    'https://images.unsplash.com/photo-1519415510929-860fa69134ef?auto=format&fit=crop&w=1600&q=80',
  banner_team:
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1600&q=80',
  banner_contact:
    'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=1600&q=80',
} as const

export type PageBannerKey = keyof typeof PAGE_BANNER_DEFAULTS

export function getPublicSiteName(settings: Pick<PublicSettings, 'public_website_name' | 'website_name' | 'company_name' | 'app_name'>): string {
  return (
    settings.public_website_name ||
    settings.website_name ||
    settings.company_name ||
    settings.app_name ||
    SALON.name
  )
}

export function getPageBanner(
  settings: Partial<Record<PageBannerKey, string | null | undefined>>,
  key: PageBannerKey,
): string {
  return settings[key] || PAGE_BANNER_DEFAULTS[key]
}

export function categoryImage(code?: string | null): string {
  if (!code) return DEFAULT_IMAGE
  return CATEGORY_IMAGES[code.toUpperCase()] ?? DEFAULT_IMAGE
}

export function productCategoryImage(code?: string | null): string {
  if (!code) return DEFAULT_IMAGE
  return PRODUCT_CATEGORY_IMAGES[code.toUpperCase()] ?? DEFAULT_IMAGE
}

export function productDisplayPrice(
  retailPrice: string | number | undefined,
  vatRate?: number,
  vatInclusive?: boolean,
): number {
  const base = Number(retailPrice ?? 0)
  if (!Number.isFinite(base)) return 0
  if (vatInclusive) return base
  const rate = Number(vatRate ?? 0)
  return base * (1 + rate / 100)
}

export function formatPublicPrice(
  value: string | number | undefined,
  currency = 'AED',
  symbol?: string,
): string {
  const amount = Number(value ?? 0)
  const formatted = Number.isFinite(amount)
    ? amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })
    : '0'
  if (symbol) return `${symbol} ${formatted}`
  return `${formatted} ${currency}`
}

export function combineDateAndTime(date: string, time: string): string {
  const normalizedTime = time.length >= 5 ? time.slice(0, 5) : time
  return `${date}T${normalizedTime}:00`
}

/** YYYY-MM-DD in the salon timezone (e.g. Asia/Dubai). */
export function salonLocalDateString(timezone = 'Asia/Dubai', date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: timezone }).format(date)
}

/** HH:mm in the salon timezone. */
export function salonLocalTimeString(timezone = 'Asia/Dubai', date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date)

  const hour = parts.find((p) => p.type === 'hour')?.value ?? '00'
  const minute = parts.find((p) => p.type === 'minute')?.value ?? '00'

  return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`
}

/** Next bookable half-hour slot in the salon timezone. */
export function nextSalonTimeSlot(timezone = 'Asia/Dubai', stepMinutes = 30): string {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date())

  let hour = Number(parts.find((p) => p.type === 'hour')?.value ?? 0)
  let minute = Number(parts.find((p) => p.type === 'minute')?.value ?? 0)

  minute = Math.ceil((minute + 1) / stepMinutes) * stepMinutes
  if (minute >= 60) {
    minute = 0
    hour += 1
  }
  if (hour >= 24) {
    hour = 23
    minute = 30
  }

  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

export function isSalonDateTimeInPast(date: string, time: string, timezone = 'Asia/Dubai'): boolean {
  const today = salonLocalDateString(timezone)
  if (date < today) return true
  if (date > today) return false
  return time <= salonLocalTimeString(timezone)
}

export function staffPlaceholder(index: number): string {
  const images = [
    'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80',
  ]
  return images[index % images.length]
}

export function buildWhatsAppUrl(phoneOrUrl: string): string {
  if (phoneOrUrl.startsWith('http://') || phoneOrUrl.startsWith('https://')) {
    return phoneOrUrl
  }

  const digits = phoneOrUrl.replace(/\D/g, '')
  return digits ? `https://wa.me/${digits}` : SALON.social.whatsapp
}

export function getWhatsAppUrl(
  settings?: Pick<PublicSettings, 'whatsapp_url' | 'public_whatsapp'> | null,
): string {
  if (settings?.whatsapp_url) return settings.whatsapp_url
  if (settings?.public_whatsapp) return buildWhatsAppUrl(settings.public_whatsapp)
  return SALON.social.whatsapp
}
