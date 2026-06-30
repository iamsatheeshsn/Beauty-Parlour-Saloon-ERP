import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { cn } from '@/utils/cn'
import { NAV_LINKS } from '@/constants/websiteContent'
import { getPublicSiteName } from '@/utils/website'
import { usePublicWebsite } from '@/contexts/PublicWebsiteContext'

export function WebsiteHeader() {
  const { settings } = usePublicWebsite()
  const salonName = getPublicSiteName(settings)
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-border/60 bg-white/95 py-3 shadow-sm backdrop-blur-md'
          : 'bg-transparent py-5',
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="group flex min-w-0 items-center gap-2 sm:gap-3">
          {settings.app_logo ? (
            <span
              className={cn(
                'inline-flex items-center transition',
                !scrolled && 'rounded-xl bg-white/95 px-3 py-2 shadow-md backdrop-blur-sm',
              )}
            >
              <img
                src={settings.app_logo}
                alt={salonName}
                className="h-9 w-auto max-w-[150px] object-contain md:h-10"
              />
            </span>
          ) : (
            <span
              className={cn(
                'font-serif text-xl font-semibold tracking-wide transition-colors md:text-2xl',
                scrolled ? 'text-primary' : 'text-white',
              )}
            >
              {salonName}
            </span>
          )}
          {settings.app_logo && (
            <span
              className={cn(
                'hidden text-[10px] uppercase tracking-[0.25em] transition-colors sm:block',
                scrolled ? 'text-muted-foreground' : 'text-white/80',
              )}
            >
              Luxury Salon & Spa
            </span>
          )}
        </Link>

        <nav className="hidden items-center gap-6 xl:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                cn(
                  'text-sm font-medium tracking-wide transition-colors',
                  scrolled
                    ? isActive
                      ? 'text-primary'
                      : 'text-foreground/80 hover:text-primary'
                    : isActive
                      ? 'text-white'
                      : 'text-white/85 hover:text-white',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            to="/contact"
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-md transition hover:bg-accent/90"
          >
            Book Now
          </Link>
        </div>

        <button
          type="button"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          className={cn(
            'rounded-lg p-2 lg:hidden',
            scrolled ? 'text-foreground' : 'text-white',
          )}
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border/40 bg-white px-4 py-6 lg:hidden">
          <nav className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'text-base font-medium',
                    isActive ? 'text-primary' : 'text-foreground/80',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              to="/contact"
              onClick={() => setMobileOpen(false)}
              className="mt-2 rounded-full bg-primary px-5 py-3 text-center text-sm font-semibold text-primary-foreground"
            >
              Book Now
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
