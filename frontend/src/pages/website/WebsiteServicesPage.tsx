import { PageHero } from '@/components/website/PageHero'
import { ServicesGridSection } from '@/components/website/ServicesGridSection'
import { PricingSection } from '@/components/website/PricingSection'
import { FAQSection } from '@/components/website/FAQSection'
import { CTABanner } from '@/components/website/CTABanner'

export default function WebsiteServicesPage() {
  return (
    <>
      <PageHero
        title="Our Services"
        subtitle="Expert treatments for hair, skin, nails, spa, and special occasions."
        bannerKey="banner_services"
      />
      <ServicesGridSection showAllLink={false} />
      <PricingSection />
      <FAQSection />
      <CTABanner />
    </>
  )
}
