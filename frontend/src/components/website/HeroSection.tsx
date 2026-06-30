import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { HERO_SLIDES } from '@/constants/websiteContent'
import { publicWebsiteService } from '@/services/publicWebsiteService'
import { getPageBanner } from '@/utils/website'
import { usePublicWebsite } from '@/contexts/PublicWebsiteContext'
import type { PublicHomepageSlide } from '@/types/publicWebsite'

function toSlideView(
  slide: PublicHomepageSlide,
  fallbackImage?: string,
) {
  return {
    eyebrow: slide.eyebrow ?? '',
    title: slide.title,
    subtitle: slide.subtitle ?? '',
    cta: slide.cta_text ?? 'Book Appointment',
    ctaLink: slide.cta_link ?? '/contact',
    secondaryCta: slide.secondary_cta_text ?? 'Explore Services',
    secondaryCtaLink: slide.secondary_cta_link ?? '/our-services',
    image: slide.image_url ?? fallbackImage ?? HERO_SLIDES[0].image,
  }
}

export function HeroSection() {
  const { settings } = usePublicWebsite()
  const [active, setActive] = useState(0)

  const { data: apiSlides = [] } = useQuery({
    queryKey: ['public-homepage-slides'],
    queryFn: () => publicWebsiteService.getHomepageSlides(),
    staleTime: 5 * 60 * 1000,
  })

  const slides = useMemo(() => {
    if (apiSlides.length > 0) {
      return apiSlides.map((slide, index) =>
        toSlideView(
          slide,
          index === 0 ? getPageBanner(settings, 'banner_home') : undefined,
        ),
      )
    }

    return HERO_SLIDES.map((slide, index) => ({
      eyebrow: slide.eyebrow,
      title: slide.title,
      subtitle: slide.subtitle,
      cta: slide.cta,
      ctaLink: '/contact',
      secondaryCta: 'Explore Services',
      secondaryCtaLink: '/our-services',
      image: index === 0 ? getPageBanner(settings, 'banner_home') : slide.image,
    }))
  }, [apiSlides, settings])

  useEffect(() => {
    setActive(0)
  }, [slides.length])

  useEffect(() => {
    if (slides.length <= 1) return undefined
    const timer = setInterval(() => {
      setActive((i) => (i + 1) % slides.length)
    }, 7000)
    return () => clearInterval(timer)
  }, [slides.length])

  const slide = slides[active] ?? slides[0]

  if (!slide) return null

  return (
    <section className="relative min-h-[80vh] overflow-hidden pt-20 sm:min-h-[88vh] lg:min-h-[92vh]">
      {slides.map((s, i) => (
        <div
          key={`${s.title}-${i}`}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === active ? 1 : 0 }}
          aria-hidden={i !== active}
        >
          <img src={s.image} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2d1f22]/85 via-[#5c2230]/70 to-[#7a2e3e]/40" />
        </div>
      ))}

      <div className="relative mx-auto flex min-h-[calc(80vh-5rem)] max-w-7xl flex-col justify-center px-4 py-12 pb-24 sm:min-h-[calc(88vh-5rem)] sm:px-6 sm:py-16 sm:pb-28 lg:min-h-[calc(92vh-5rem)] lg:px-8">
        <p className="website-fade-up mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-accent sm:mb-4 sm:text-xs sm:tracking-[0.25em]">
          {slide.eyebrow}
        </p>
        <h1 className="website-fade-up website-delay-1 max-w-3xl font-serif text-3xl font-semibold leading-[1.1] text-white sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
          {slide.title}
        </h1>
        <p className="website-fade-up website-delay-2 mt-4 max-w-xl text-sm leading-relaxed text-white/80 sm:mt-6 sm:text-base md:text-lg">
          {slide.subtitle}
        </p>
        <div className="website-fade-up website-delay-3 mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-4">
          <Link
            to={slide.ctaLink}
            className="inline-flex justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-lg transition hover:bg-accent/90 sm:px-8 sm:py-3.5"
          >
            {slide.cta}
          </Link>
          <Link
            to={slide.secondaryCtaLink}
            className="inline-flex justify-center rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10 sm:px-8 sm:py-3.5"
          >
            {slide.secondaryCta}
          </Link>
        </div>
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-3 sm:bottom-8 sm:gap-4">
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => setActive((i) => (i - 1 + slides.length) % slides.length)}
            className="rounded-full border border-white/30 p-2 text-white/80 transition hover:border-white hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setActive(i)}
                className={`h-2 rounded-full transition-all ${
                  i === active ? 'w-8 bg-accent' : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => setActive((i) => (i + 1) % slides.length)}
            className="rounded-full border border-white/30 p-2 text-white/80 transition hover:border-white hover:text-white"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </section>
  )
}
