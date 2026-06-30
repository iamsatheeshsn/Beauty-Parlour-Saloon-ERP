import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Check } from 'lucide-react'
import { SectionHeading } from '@/components/website/SectionHeading'
import { publicWebsiteService } from '@/services/publicWebsiteService'
import { formatPublicPrice } from '@/utils/website'
import { usePublicWebsite } from '@/contexts/PublicWebsiteContext'
import { PageLoader } from '@/components/ui/Loader'

export function PricingSection() {
  const { settings } = usePublicWebsite()
  const { data: packages = [], isLoading } = useQuery({
    queryKey: ['public-packages'],
    queryFn: () => publicWebsiteService.getServicePackages(),
    staleTime: 5 * 60 * 1000,
  })

  const featuredIndex = packages.length > 1 ? 1 : 0

  return (
    <section className="website-section bg-muted/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Packages & Pricing"
          title="Indulge in Our Signature Packages"
          subtitle="Transparent pricing in AED. Custom packages available for bridal and group bookings."
        />

        {isLoading ? (
          <div className="flex justify-center py-16">
            <PageLoader />
          </div>
        ) : packages.length === 0 ? (
          <p className="text-center text-muted-foreground">Packages will appear here once configured.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {packages.slice(0, 3).map((plan, index) => {
              const featured = index === featuredIndex
              const features = [
                ...(plan.description ? [plan.description] : []),
                ...(plan.items?.map(
                  (item) =>
                    `${item.quantity_included > 1 ? `${item.quantity_included}× ` : ''}${item.service?.name ?? 'Service'}`,
                ) ?? []),
                plan.validity_days
                  ? `Valid for ${plan.validity_days} days`
                  : `${plan.points_included} points included`,
              ].slice(0, 5)

              return (
                <article
                  key={plan.id}
                  className={`relative flex flex-col rounded-2xl border p-8 transition hover:-translate-y-1 ${
                    featured
                      ? 'border-primary bg-primary text-primary-foreground shadow-xl polishe-card-glow scale-[1.02]'
                      : 'border-border bg-white polishe-card-glow'
                  }`}
                >
                  {featured && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-bold uppercase tracking-wider text-accent-foreground">
                      Most Popular
                    </span>
                  )}
                  <h3
                    className={`font-serif text-2xl font-semibold ${
                      featured ? 'text-white' : 'text-foreground'
                    }`}
                  >
                    {plan.name}
                  </h3>
                  <p className="mt-4 flex items-baseline gap-1">
                    <span
                      className={`font-serif text-4xl font-bold ${
                        featured ? 'text-accent' : 'text-primary'
                      }`}
                    >
                      {formatPublicPrice(
                        plan.total_price ?? plan.price,
                        settings.currency,
                      ).replace(` ${settings.currency}`, '')}
                    </span>
                    <span
                      className={`text-sm ${featured ? 'text-white/70' : 'text-muted-foreground'}`}
                    >
                      {settings.currency}
                    </span>
                  </p>
                  <ul className="mt-6 flex flex-1 flex-col gap-3">
                    {features.map((feature) => (
                      <li key={feature} className="flex gap-2 text-sm">
                        <Check
                          className={`mt-0.5 h-4 w-4 shrink-0 ${
                            featured ? 'text-accent' : 'text-secondary'
                          }`}
                        />
                        <span className={featured ? 'text-white/90' : 'text-muted-foreground'}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/contact"
                    className={`mt-8 block rounded-full py-3 text-center text-sm font-semibold transition ${
                      featured
                        ? 'bg-accent text-accent-foreground hover:bg-accent/90'
                        : 'bg-primary text-primary-foreground hover:bg-primary/90'
                    }`}
                  >
                    Book This Package
                  </Link>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
