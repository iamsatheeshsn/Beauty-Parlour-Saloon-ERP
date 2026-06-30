import { createContext, useContext, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { publicWebsiteService } from '@/services/publicWebsiteService'
import type { PublicSettings } from '@/types/publicWebsite'
import { SALON } from '@/constants/websiteContent'
import { applyThemeFromSettings } from '@/utils/applyTheme'
import { DEFAULT_APP_SETTINGS } from '@/services/appSettingsService'

interface PublicWebsiteContextValue {
  settings: PublicSettings
  isLoading: boolean
}

const fallbackSettings: PublicSettings = {
  app_name: SALON.name,
  company_name: SALON.name,
  public_website_name: SALON.name,
  website_name: SALON.name,
  timezone: 'Asia/Dubai',
  currency: 'AED',
  currency_symbol: 'د.إ',
  vat_rate: 5,
  vat_enabled: true,
  app_logo: null,
  app_favicon: null,
  phone: SALON.phone,
  email: SALON.email,
  location: SALON.location,
}

const PublicWebsiteContext = createContext<PublicWebsiteContextValue>({
  settings: fallbackSettings,
  isLoading: true,
})

export function PublicWebsiteProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading } = useQuery({
    queryKey: ['public-settings'],
    queryFn: () => publicWebsiteService.getSettings(),
    staleTime: 5 * 60 * 1000,
  })

  const settings: PublicSettings = data
    ? { ...fallbackSettings, ...data }
    : fallbackSettings

  useEffect(() => {
    if (data) {
      applyThemeFromSettings({ ...DEFAULT_APP_SETTINGS, ...data })
    }
  }, [data])

  return (
    <PublicWebsiteContext.Provider value={{ settings, isLoading }}>
      {children}
    </PublicWebsiteContext.Provider>
  )
}

export function usePublicWebsite() {
  return useContext(PublicWebsiteContext)
}
