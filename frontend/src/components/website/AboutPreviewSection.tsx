import { Link } from 'react-router-dom'
import { ArrowRight, Award, Droplets, ShieldCheck, CalendarCheck } from 'lucide-react'
import { SectionHeading } from '@/components/website/SectionHeading'
import { FEATURES } from '@/constants/websiteContent'
import { usePublicWebsite } from '@/contexts/PublicWebsiteContext'
import { DEFAULT_SALON_INTERIOR, getPublicSiteName } from '@/utils/website'

const FEATURE_ICONS = [Award, Droplets, ShieldCheck, CalendarCheck]

export function AboutPreviewSection() {
  const { settings } = usePublicWebsite()
  const salonName = getPublicSiteName(settings)
  const interiorSrc = settings.salon_interior_image || DEFAULT_SALON_INTERIOR

  return (
    <section className="website-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative">
            <div className="overflow-hidden rounded-2xl polishe-card-glow">
              <img
                src={interiorSrc}
                alt="Salon interior"
                className="aspect-[4/5] w-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_SALON_INTERIOR
                }}
              />
            </div>
            <div className="mt-4 rounded-xl bg-primary px-5 py-3 text-primary-foreground shadow-lg sm:absolute sm:-bottom-6 sm:-right-4 sm:mt-0 sm:px-6 sm:py-4 md:block">
              <p className="font-serif text-2xl font-bold sm:text-3xl">12+</p>
              <p className="text-xs uppercase tracking-wider text-white/80">Years of Beauty</p>
            </div>
          </div>
          <div>
            <SectionHeading
              eyebrow="About Us"
              title={`Welcome to ${salonName}`}
              subtitle="A sanctuary of elegance in Dubai Marina — where every visit is a personalised journey toward confidence and radiance."
              align="left"
            />
            <p className="mb-6 leading-relaxed text-muted-foreground">
              Founded with a passion for artistry and wellness, our salon blends European techniques
              with Middle Eastern hospitality. From the moment you walk in, our team ensures a
              seamless, luxurious experience.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {FEATURES.map((feature, i) => {
                const Icon = FEATURE_ICONS[i]
                return (
                  <div key={feature.title} className="flex gap-3 rounded-xl border border-border/60 bg-white p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">{feature.title}</h4>
                      <p className="mt-0.5 text-xs text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
            <Link
              to="/about"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-secondary"
            >
              Our story
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
