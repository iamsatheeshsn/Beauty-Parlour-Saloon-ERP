import { createContext, useContext } from 'react'
import type { AppSettings } from '@/services/appSettingsService'

export interface SettingsContextType {
  settings: AppSettings
  isLoading: boolean
  refreshSettings: () => Promise<void>
}

export const SettingsContext = createContext<SettingsContextType | null>(null)

export function useAppSettings() {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useAppSettings must be used within SettingsProvider')
  }
  return context
}
