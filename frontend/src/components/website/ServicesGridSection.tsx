import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight, Clock } from 'lucide-react'
import { SectionHeading } from '@/components/website/SectionHeading'
import { publicWebsiteService } from '@/services/publicWebsiteService'
import { categoryImage, formatPublicPrice } from '@/utils/website'
import { usePublicWebsite } from '@/contexts/PublicWebsiteContext'
import { PageLoader } from '@/components/ui/Loader'

interface ServicesGridSectionProps {
  showAllLink?: boolean
  limit?: number
}

export function ServicesGridSection({ showAllLink = true, limit }: ServicesGridSectionProps) {
  const { settings } = usePublicWebsite()
  const { data: services = [], isLoading } = useQuery({
    queryKey: ['public-services'],
    queryFn: () => publicWebsiteService.getServices(),
    staleTime: 5 * 60 * 1000,
  })

  const visible = limit ? services.slice(0, limit) : services

  return (
    <section className="website-section bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Our Services"
          title="Treatments Tailored to You"
          subtitle="From precision cuts to restorative spa rituals — discover our full range of beauty and wellness services."
        />

        {isLoading ? (
          <div className="flex justify-center py-16">
            <PageLoader />
          </div>
        ) : visible.length === 0 ? (
          <p className="text-center text-muted-foreground">Services will appear here once configured.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((service) => (
              <article
                key={service.id}
                className="group polishe-card-glow overflow-hidden rounded-2xl border border-border/60 bg-card transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={service.image_url || categoryImage(service.category?.code)}
                    alt={service.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2d1f22]/60 to-transparent" />
                  {service.category?.name && (
                    <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary">
                      {service.category.name}
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-xl font-semibold text-foreground">{service.name}</h3>
                  {service.description && (
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {service.description}
                    </p>
                  )}
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="font-semibold text-primary">
                      {formatPublicPrice(
                        service.total_price ?? service.price,
                        settings.currency,
                        settings.currency_symbol,
                      )}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      {service.duration_minutes} min
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {showAllLink && (
          <div className="mt-10 text-center">
            <Link
              to="/our-services"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-secondary"
            >
              View all services
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
