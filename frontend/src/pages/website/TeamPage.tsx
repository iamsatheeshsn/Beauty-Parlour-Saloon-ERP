import { PageHero } from '@/components/website/PageHero'
import { TeamSection } from '@/components/website/TeamSection'
import { SectionHeading } from '@/components/website/SectionHeading'
import { CTABanner } from '@/components/website/CTABanner'

export default function TeamPage() {
  return (
    <>
      <PageHero
        title="Our Team"
        subtitle="Meet the stylists, colorists, and therapists behind your transformation."
        bannerKey="banner_team"
      />
      <TeamSection showAllLink={false} />
      <section className="website-section bg-muted/40">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Join Us"
            title="We're Always Growing"
            subtitle="Passionate about beauty? We're looking for talented professionals to join our family."
          />
          <a
            href={`mailto:careers@luxebeauty.ae`}
            className="inline-flex rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            careers@luxebeauty.ae
          </a>
        </div>
      </section>
      <CTABanner />
    </>
  )
}
