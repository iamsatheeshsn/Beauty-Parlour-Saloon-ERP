import { useQuery } from '@tanstack/react-query'
import { Quote } from 'lucide-react'
import { SectionHeading } from '@/components/website/SectionHeading'
import { TESTIMONIALS } from '@/constants/websiteContent'
import { publicWebsiteService } from '@/services/publicWebsiteService'
import { PageLoader } from '@/components/ui/Loader'

export function TestimonialsSection() {
  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ['public-testimonials'],
    queryFn: () => publicWebsiteService.getTestimonials(),
    staleTime: 5 * 60 * 1000,
  })

  const visible = testimonials.length > 0 ? testimonials : TESTIMONIALS

  return (
    <section className="website-section polishe-hero-bg relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -left-20 top-20 h-64 w-64 rounded-full bg-accent blur-3xl" />
        <div className="absolute -right-20 bottom-20 h-64 w-64 rounded-full bg-secondary blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Testimonials"
          title="What Our Clients Say"
          subtitle="Real stories from guests who trust us with their beauty rituals."
          className="[&_h2]:text-white [&_p]:text-white/70 [&_span]:text-accent"
        />

        {isLoading ? (
          <div className="flex justify-center py-12">
            <PageLoader />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((item, index) => (
              <blockquote
                key={'id' in item ? item.id : `${item.name}-${index}`}
                className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-sm sm:p-8"
              >
                <Quote className="h-8 w-8 text-accent" />
                <p className="mt-4 text-sm leading-relaxed text-white/90">&ldquo;{item.quote}&rdquo;</p>
                <footer className="mt-6 border-t border-white/10 pt-4">
                  <p className="font-semibold text-white">{item.name}</p>
                  {item.role && <p className="text-xs text-white/60">{item.role}</p>}
                </footer>
              </blockquote>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
