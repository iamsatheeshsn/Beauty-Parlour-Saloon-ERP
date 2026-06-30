import type { AppSettings } from '@/services/appSettingsService'

const DEFAULT_FAVICON = '/favicon.svg'

function setFavicon(url: string | null | undefined): void {
  const href = url || DEFAULT_FAVICON
  let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']")

  if (!link) {
    link = document.createElement('link')
    link.rel = 'icon'
    document.head.appendChild(link)
  }

  link.href = href
}

function setThemeColor(color: string | undefined): void {
  let meta = document.querySelector<HTMLMetaElement>("meta[name='theme-color']")
  if (!meta) {
    meta = document.createElement('meta')
    meta.name = 'theme-color'
    document.head.appendChild(meta)
  }
  if (color) {
    meta.content = color
  }
}

export function applyThemeFromSettings(settings: AppSettings): void {
  const root = document.documentElement

  if (settings.primary_color) {
    root.style.setProperty('--color-primary', settings.primary_color)
  }

  if (settings.secondary_color) {
    root.style.setProperty('--color-accent', settings.secondary_color)
  }

  if (settings.app_name) {
    document.title = settings.app_name
  }

  setFavicon(settings.app_favicon)
  setThemeColor(settings.primary_color)
}

export function resetThemeToDefaults(): void {
  const root = document.documentElement
  root.style.removeProperty('--color-primary')
  root.style.removeProperty('--color-accent')
  document.title = 'Beauty Salon ERP'
  setFavicon(null)
  setThemeColor('#7A2E3E')
}
