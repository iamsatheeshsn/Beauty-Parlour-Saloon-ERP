import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Share2 } from 'lucide-react'
import { SectionHeading } from '@/components/website/SectionHeading'
import { publicWebsiteService } from '@/services/publicWebsiteService'
import { staffPlaceholder } from '@/utils/website'
import { TEAM } from '@/constants/websiteContent'
import { PageLoader } from '@/components/ui/Loader'

interface TeamSectionProps {
  showAllLink?: boolean
  /** When true, shows only the 4 staff selected in Settings → Homepage Team */
  featuredOnly?: boolean
}

export function TeamSection({ showAllLink = true, featuredOnly = false }: TeamSectionProps) {
  const { data: team = [], isLoading } = useQuery({
    queryKey: featuredOnly ? ['public-team-featured'] : ['public-team'],
    queryFn: () =>
      featuredOnly ? publicWebsiteService.getFeaturedTeam() : publicWebsiteService.getTeam(),
    staleTime: 5 * 60 * 1000,
  })

  const members =
    team.length > 0
      ? team.map((member, index) => ({
          id: member.id,
          name: member.name,
          role: [member.designation, member.department].filter(Boolean).join(' · ') || 'Team Member',
          image: member.avatar || staffPlaceholder(index),
        }))
      : featuredOnly
        ? []
        : TEAM

  return (
    <section className="website-section bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Our Team"
          title="Meet the Artists"
          subtitle="Passionate professionals dedicated to making you look and feel extraordinary."
        />

        {isLoading ? (
          <div className="flex justify-center py-16">
            <PageLoader />
          </div>
        ) : members.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            No team members selected for the homepage yet.
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {members.map((member, index) => (
              <article key={`${member.name}-${index}`} className="group text-center">
                <div className="relative mx-auto mb-5 aspect-[3/4] max-w-[280px] overflow-hidden rounded-2xl polishe-card-glow">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-[#2d1f22]/70 via-transparent to-transparent opacity-0 transition group-hover:opacity-100">
                    <span className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-primary">
                      <Share2 className="h-4 w-4" />
                    </span>
                  </div>
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground">{member.name}</h3>
                <p className="mt-1 text-sm text-secondary">{member.role}</p>
              </article>
            ))}
          </div>
        )}

        {showAllLink && (
          <div className="mt-10 text-center">
            <Link
              to="/team"
              className="inline-flex rounded-full border border-primary px-8 py-3 text-sm font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
            >
              View full team
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
