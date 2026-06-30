import api from '@/services/api'
import type { ApiResponse } from '@/types'

export interface AppSettings {
  app_name: string
  app_logo?: string | null
  app_favicon?: string | null
  company_name?: string
  timezone: string
  currency: string
  currency_symbol: string
  vat_rate: number
  vat_enabled?: boolean
  primary_color: string
  secondary_color: string
}

export const DEFAULT_APP_SETTINGS: AppSettings = {
  app_name: 'Beauty Salon ERP',
  app_logo: null,
  app_favicon: null,
  timezone: 'Asia/Dubai',
  currency: 'AED',
  currency_symbol: 'د.إ',
  vat_rate: 0,
  vat_enabled: false,
  primary_color: '#7A2E3E',
  secondary_color: '#C9A46C',
}

export const appSettingsService = {
  get: async (): Promise<AppSettings> => {
    const { data } = await api.get<ApiResponse<AppSettings>>('/app-settings')
    return { ...DEFAULT_APP_SETTINGS, ...data.data }
  },
}
