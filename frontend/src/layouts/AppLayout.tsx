import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import { SidebarProvider } from '@/contexts/SidebarProvider'
import { useSidebar } from '@/contexts/SidebarContext'
import { cn } from '@/utils/cn'

function AppLayoutShell() {
  const { collapsed, toggleMobile, mobileOpen, setMobileOpen } = useSidebar()

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div
        className={cn(
          'min-h-screen min-w-0 transition-[padding] duration-300 ease-in-out',
          collapsed ? 'lg:pl-20' : 'lg:pl-64'
        )}
      >
        <Navbar onMenuClick={toggleMobile} />
        <main className="w-full max-w-[100vw] p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export function AppLayout() {
  return (
    <SidebarProvider>
      <AppLayoutShell />
    </SidebarProvider>
  )
}
