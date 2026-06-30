import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Calendar } from 'lucide-react'
import { publicWebsiteService } from '@/services/publicWebsiteService'
import { PageLoader } from '@/components/ui/Loader'
import { CTABanner } from '@/components/website/CTABanner'

export default function BlogPostPage() {
  const { slug = '' } = useParams()
  const { data: post, isLoading, isError } = useQuery({
    queryKey: ['public-blog-post', slug],
    queryFn: () => publicWebsiteService.getBlogPost(slug),
    enabled: Boolean(slug),
  })

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center pt-24">
        <PageLoader />
      </div>
    )
  }

  if (isError || !post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-32 text-center">
        <h1 className="font-serif text-3xl font-semibold">Article not found</h1>
        <Link to="/blog" className="mt-6 inline-flex text-primary hover:underline">
          Back to journal
        </Link>
      </div>
    )
  }

  return (
    <>
      <article className="pt-24">
        <div className="relative min-h-[40vh] overflow-hidden">
          <img
            src={
              post.featured_image ??
              'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1600&q=80'
            }
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2d1f22]/90 via-[#5c2230]/50 to-transparent" />
          <div className="relative mx-auto max-w-4xl px-4 pb-12 pt-16 sm:px-6 lg:px-8">
            <Link
              to="/blog"
              className="mb-6 inline-flex items-center gap-1.5 text-sm text-white/80 transition hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to journal
            </Link>
            {post.category && (
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                {post.category}
              </span>
            )}
            <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight text-white md:text-5xl">
              {post.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/70">
              {post.author_name && <span>By {post.author_name}</span>}
              {post.published_at && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.published_at).toLocaleDateString(undefined, {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              )}
              {post.reading_time ? <span>{post.reading_time} min read</span> : null}
            </div>
          </div>
        </div>

        <div className="website-section">
          <div
            className="prose prose-neutral mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 prose-headings:font-serif prose-a:text-primary"
            dangerouslySetInnerHTML={{ __html: post.content ?? '' }}
          />
        </div>
      </article>
      <CTABanner />
    </>
  )
}
