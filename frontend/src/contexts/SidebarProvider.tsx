import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { SidebarContext } from './SidebarContext'

interface SidebarProviderProps {
  children: ReactNode
}

export function SidebarProvider({ children }: SidebarProviderProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const toggleCollapsed = useCallback(() => setCollapsed((prev) => !prev), [])
  const toggleMobile = useCallback(() => setMobileOpen((prev) => !prev), [])

  const value = useMemo(
    () => ({
      collapsed,
      setCollapsed,
      toggleCollapsed,
      mobileOpen,
      setMobileOpen,
      toggleMobile,
    }),
    [collapsed, mobileOpen, toggleCollapsed, toggleMobile]
  )

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
}
