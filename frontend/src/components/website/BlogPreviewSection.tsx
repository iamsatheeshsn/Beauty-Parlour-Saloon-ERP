import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight, Calendar } from 'lucide-react'
import { SectionHeading } from '@/components/website/SectionHeading'
import { publicWebsiteService } from '@/services/publicWebsiteService'
import { PageLoader } from '@/components/ui/Loader'

export function BlogPreviewSection() {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['public-blog-posts'],
    queryFn: () => publicWebsiteService.getBlogPosts(),
    staleTime: 5 * 60 * 1000,
  })

  const latest = posts.slice(0, 3)

  if (!isLoading && latest.length === 0) return null

  return (
    <section className="website-section bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Journal"
          title="Beauty Tips & Salon Stories"
          subtitle="Expert advice, trends, and inspiration from our team."
        />

        {isLoading ? (
          <div className="flex justify-center py-16">
            <PageLoader />
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-3">
            {latest.map((post) => (
              <article
                key={post.id}
                className="group overflow-hidden rounded-2xl border border-border/60 bg-card polishe-card-glow"
              >
                <Link to={`/blog/${post.slug}`} className="block">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={
                        post.featured_image ??
                        'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80'
                      }
                      alt={post.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6">
                    {post.category && (
                      <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
                        {post.category}
                      </span>
                    )}
                    <h3 className="mt-2 font-serif text-xl font-semibold text-foreground group-hover:text-primary">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      {post.published_at
                        ? new Date(post.published_at).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : null}
                      {post.reading_time ? ` · ${post.reading_time} min read` : ''}
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-secondary"
          >
            Read all articles
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
