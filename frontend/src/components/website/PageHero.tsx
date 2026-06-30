import { usePublicWebsite } from '@/contexts/PublicWebsiteContext'
import { getPageBanner, PAGE_BANNER_DEFAULTS, type PageBannerKey } from '@/utils/website'

interface PageHeroProps {
  title: string
  subtitle?: string
  image?: string
  bannerKey?: PageBannerKey
}

export function PageHero({ title, subtitle, image, bannerKey }: PageHeroProps) {
  const { settings } = usePublicWebsite()
  const heroImage = bannerKey
    ? getPageBanner(settings, bannerKey)
    : image ?? PAGE_BANNER_DEFAULTS.banner_about

  return (
    <section className="relative flex min-h-[32vh] items-end overflow-hidden pt-20 sm:min-h-[38vh] md:min-h-[45vh]">
      <img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#2d1f22]/90 via-[#5c2230]/60 to-[#7a2e3e]/30" />
      <div className="relative mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 sm:pb-12 lg:px-8 md:pb-16">
        <h1 className="font-serif text-3xl font-semibold text-white sm:text-4xl md:text-5xl lg:text-6xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 max-w-2xl text-sm text-white/75 sm:mt-3 sm:text-base md:text-lg">{subtitle}</p>
        )}
      </div>
    </section>
  )
}
