import { Link } from 'react-router-dom'
import { usePublicWebsite } from '@/contexts/PublicWebsiteContext'
import { getWhatsAppUrl } from '@/utils/website'

export function CTABanner() {
  const { settings } = usePublicWebsite()
  const whatsappHref = getWhatsAppUrl(settings)

  return (
    <section className="website-section-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl polishe-hero-bg px-5 py-12 text-center sm:px-8 sm:py-16 md:px-16 md:py-20">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-accent blur-3xl" />
          </div>
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              Ready to glow?
            </p>
            <h2 className="mt-3 font-serif text-2xl font-semibold text-white sm:text-3xl md:text-4xl lg:text-5xl">
              Book Your Appointment Today
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/75">
              Reserve your slot online or message us on WhatsApp. Same-day appointments available
              for select services.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                to="/contact"
                className="rounded-full bg-accent px-8 py-3.5 text-sm font-semibold text-accent-foreground transition hover:bg-accent/90"
              >
                Book Now
              </Link>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/40 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
