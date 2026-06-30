import { Outlet, ScrollRestoration } from 'react-router-dom'
import { WebsiteHeader } from '@/components/website/WebsiteHeader'
import { WebsiteFooter } from '@/components/website/WebsiteFooter'
import { PublicWebsiteProvider } from '@/contexts/PublicWebsiteContext'

export function WebsiteLayout() {
  return (
    <PublicWebsiteProvider>
      <div className="flex min-h-screen flex-col overflow-x-clip bg-background">
        <WebsiteHeader />
        <main className="flex-1">
          <Outlet />
        </main>
        <WebsiteFooter />
        <ScrollRestoration />
      </div>
    </PublicWebsiteProvider>
  )
}
