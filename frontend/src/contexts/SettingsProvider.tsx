import { useCallback, useEffect, useMemo, type ReactNode } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { SettingsContext } from './SettingsContext'
import { useAuth } from './AuthContext'
import {
  appSettingsService,
  DEFAULT_APP_SETTINGS,
  type AppSettings,
} from '@/services/appSettingsService'
import { applyThemeFromSettings, resetThemeToDefaults } from '@/utils/applyTheme'

interface SettingsProviderProps {
  children: ReactNode
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const { isAuthenticated } = useAuth()
  const queryClient = useQueryClient()

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['app-settings'],
    queryFn: appSettingsService.get,
    enabled: isAuthenticated,
    staleTime: 30_000,
  })

  const settings: AppSettings = data ?? DEFAULT_APP_SETTINGS

  useEffect(() => {
    if (isAuthenticated && data) {
      applyThemeFromSettings(data)
    } else if (!isAuthenticated) {
      resetThemeToDefaults()
    }
  }, [isAuthenticated, data])

  const refreshSettings = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ['app-settings'] })
    await refetch()
  }, [queryClient, refetch])

  const value = useMemo(
    () => ({
      settings,
      isLoading: isAuthenticated && isLoading,
      refreshSettings,
    }),
    [settings, isAuthenticated, isLoading, refreshSettings]
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}
