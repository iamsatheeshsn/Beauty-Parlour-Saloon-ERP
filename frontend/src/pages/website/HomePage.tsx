import { HeroSection } from '@/components/website/HeroSection'
import { StatsBar } from '@/components/website/StatsBar'
import { AboutPreviewSection } from '@/components/website/AboutPreviewSection'
import { ServicesGridSection } from '@/components/website/ServicesGridSection'
import { PricingSection } from '@/components/website/PricingSection'
import { TeamSection } from '@/components/website/TeamSection'
import { TestimonialsSection } from '@/components/website/TestimonialsSection'
import { GallerySection } from '@/components/website/GallerySection'
import { BlogPreviewSection } from '@/components/website/BlogPreviewSection'
import { FAQSection } from '@/components/website/FAQSection'
import { CTABanner } from '@/components/website/CTABanner'
import { ContactSection } from '@/components/website/ContactSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <AboutPreviewSection />
      <ServicesGridSection limit={6} />
      <PricingSection />
      <TeamSection featuredOnly />
      <TestimonialsSection />
      <GallerySection />
      <BlogPreviewSection />
      <FAQSection />
      <CTABanner />
      <ContactSection compact />
    </>
  )
}
