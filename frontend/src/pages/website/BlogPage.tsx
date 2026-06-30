import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Calendar, ArrowRight } from 'lucide-react'
import { PageHero } from '@/components/website/PageHero'
import { publicWebsiteService } from '@/services/publicWebsiteService'
import { PageLoader } from '@/components/ui/Loader'
import { CTABanner } from '@/components/website/CTABanner'

export default function BlogPage() {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['public-blog-posts'],
    queryFn: () => publicWebsiteService.getBlogPosts(),
  })

  return (
    <>
      <PageHero
        title="Salon Journal"
        subtitle="Beauty insights, seasonal tips, and stories from Luxe Beauty Lounge."
        bannerKey="banner_blog"
      />
      <section className="website-section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <PageLoader />
            </div>
          ) : posts.length === 0 ? (
            <p className="text-center text-muted-foreground">No articles published yet.</p>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="group overflow-hidden rounded-2xl border border-border/60 bg-white polishe-card-glow"
                >
                  <Link to={`/blog/${post.slug}`}>
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={
                          post.featured_image ??
                          'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80'
                        }
                        alt={post.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      {post.category && (
                        <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
                          {post.category}
                        </span>
                      )}
                      <h2 className="mt-2 font-serif text-2xl font-semibold text-foreground group-hover:text-primary">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
                      )}
                      <div className="mt-4 flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          {post.published_at
                            ? new Date(post.published_at).toLocaleDateString()
                            : ''}
                        </span>
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                          Read more
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
      <CTABanner />
    </>
  )
}
