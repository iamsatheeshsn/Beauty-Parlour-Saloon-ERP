import { PageHero } from '@/components/website/PageHero'
import { SectionHeading } from '@/components/website/SectionHeading'
import { FEATURES, SALON, STATS } from '@/constants/websiteContent'
import { CTABanner } from '@/components/website/CTABanner'

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="Our Story"
        subtitle="Where passion for beauty meets uncompromising standards of care."
        bannerKey="banner_about"
      />
      <section className="website-section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-12 lg:grid-cols-2">
            <div>
              <SectionHeading
                eyebrow="Since 2013"
                title={`The Heart of ${SALON.name}`}
                subtitle="Born from a vision to create Dubai's most welcoming luxury salon."
                align="left"
              />
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  What began as a boutique hair studio in Dubai Marina has grown into a full-service
                  beauty destination trusted by thousands of clients across the UAE. Our philosophy is
                  simple: every person deserves to feel confident, cared for, and celebrated.
                </p>
                <p>
                  We invest continuously in training, premium products, and a serene environment
                  that feels worlds away from the everyday. Whether you&apos;re preparing for a
                  milestone event or carving out an hour of self-care, our team treats every visit
                  as a bespoke experience.
                </p>
                <p>
                  Today, {SALON.name} is home to award-winning colorists, master estheticians, and
                  spa therapists — united by a shared commitment to excellence and genuine
                  hospitality.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-border bg-white p-6 text-center polishe-card-glow"
                >
                  <p className="font-serif text-3xl font-bold text-primary">{stat.value}</p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="website-section bg-muted/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Our Values"
            title="Why Clients Choose Us"
            subtitle="The principles that guide every treatment, conversation, and detail."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-border bg-white p-6 polishe-card-glow"
              >
                <h3 className="font-serif text-xl font-semibold text-primary">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="website-section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <img
              src="https://images.unsplash.com/photo-1519415510929-860fa69134ef?auto=format&fit=crop&w=900&q=80"
              alt="Salon team at work"
              className="aspect-[4/3] w-full rounded-2xl object-cover polishe-card-glow"
            />
            <div className="flex flex-col justify-center">
              <SectionHeading
                eyebrow="Our Space"
                title="A Sanctuary of Calm"
                subtitle="Designed to soothe the senses — soft lighting, curated scents, and private treatment suites."
                align="left"
              />
              <p className="text-muted-foreground leading-relaxed">
                Step inside and leave the city behind. Our interiors blend warm burgundy tones,
                natural textures, and thoughtful touches inspired by boutique European salons. Every
                corner is crafted for comfort, privacy, and a touch of everyday luxury.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  )
}
