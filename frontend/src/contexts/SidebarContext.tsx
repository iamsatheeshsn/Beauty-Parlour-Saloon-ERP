import { createContext, useContext } from 'react'

export interface SidebarContextValue {
  collapsed: boolean
  setCollapsed: (value: boolean) => void
  toggleCollapsed: () => void
  mobileOpen: boolean
  setMobileOpen: (value: boolean) => void
  toggleMobile: () => void
}

export const SidebarContext = createContext<SidebarContextValue | null>(null)

export function useSidebar(): SidebarContextValue {
  const ctx = useContext(SidebarContext)
  if (!ctx) {
    throw new Error('useSidebar must be used within SidebarProvider')
  }
  return ctx
}
