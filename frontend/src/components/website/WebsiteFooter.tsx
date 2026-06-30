import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Clock, Share2, Globe, Calendar, ShoppingBag, MessageCircle } from 'lucide-react'
import { NAV_LINKS, SALON } from '@/constants/websiteContent'
import { usePublicWebsite } from '@/contexts/PublicWebsiteContext'
import { getPublicSiteName, getWhatsAppUrl } from '@/utils/website'

export function WebsiteFooter() {
  const { settings } = usePublicWebsite()
  const year = new Date().getFullYear()
  const salonName = getPublicSiteName(settings)
  const phone = settings.phone || SALON.phone
  const email = settings.email || SALON.email
  const location = settings.location || settings.address || SALON.location
  const hours = settings.business_hours || SALON.hours
  const whatsappHref = getWhatsAppUrl(settings)

  return (
    <footer className="border-t border-border bg-[#2d1f22] text-white/85">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 sm:py-14 lg:grid-cols-4 lg:gap-8 lg:px-8 lg:py-16">
        <div className="min-w-0 sm:col-span-2 lg:col-span-1">
          <p className="font-serif text-xl font-semibold text-white sm:text-2xl">{salonName}</p>
          <p className="mt-2 text-sm text-white/60">{SALON.tagline}</p>
          <p className="mt-4 text-sm leading-relaxed text-white/70">
            Dubai&apos;s destination for refined beauty, bespoke treatments, and unforgettable
            self-care rituals.
          </p>
          <div className="mt-6 flex gap-3">
            <a
              href={SALON.social.instagram}
              target="_blank"
              rel="noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/80 transition hover:border-accent hover:text-accent"
              aria-label="Instagram"
            >
              <Share2 className="h-4 w-4" />
            </a>
            <a
              href={SALON.social.facebook}
              target="_blank"
              rel="noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/80 transition hover:border-accent hover:text-accent"
              aria-label="Facebook"
            >
              <Globe className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="min-w-0">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Quick Links
          </h3>
          <ul className="space-y-2.5">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-sm text-white/70 transition hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/login" className="text-sm text-white/70 transition hover:text-white">
                Staff Portal
              </Link>
            </li>
          </ul>
        </div>

        <div className="min-w-0">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Contact
          </h3>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
              <span className="min-w-0 break-words">{location}</span>
            </li>
            <li className="flex gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
              <a href={`tel:${phone.replace(/\s/g, '')}`} className="hover:text-white">
                {phone}
              </a>
            </li>
            <li className="flex gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
              <a href={`mailto:${email}`} className="min-w-0 break-all hover:text-white">
                {email}
              </a>
            </li>
            <li className="flex gap-2">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
              <span className="min-w-0">{hours}</span>
            </li>
          </ul>
        </div>

        <div className="min-w-0 sm:col-span-2 lg:col-span-1">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Book With Us
          </h3>
          <p className="text-sm leading-relaxed text-white/70">
            Reserve your treatment online, browse retail products, or message us on WhatsApp for
            same-day availability.
          </p>
          <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap lg:flex-col">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition hover:bg-accent/90"
            >
              <Calendar className="h-4 w-4" />
              Book Appointment
            </Link>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-white/50 hover:bg-white/5"
            >
              <ShoppingBag className="h-4 w-4" />
              Salon Shop
            </Link>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-white/50 hover:bg-white/5"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-center text-xs text-white/50 sm:flex-row sm:px-6 lg:px-8">
          <p>
            © {year} {salonName}. All rights reserved.
          </p>
          <p>Powered by Luxe Beauty ERP</p>
        </div>
      </div>
    </footer>
  )
}
