import { useQuery } from '@tanstack/react-query'
import { SectionHeading } from '@/components/website/SectionHeading'
import { GALLERY } from '@/constants/websiteContent'
import { publicWebsiteService } from '@/services/publicWebsiteService'
import { PageLoader } from '@/components/ui/Loader'

export function GallerySection() {
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['public-gallery'],
    queryFn: () => publicWebsiteService.getGallery(),
    staleTime: 5 * 60 * 1000,
  })

  const visible = items.filter((item) => item.image_url)
  const fallback = GALLERY.map((src, index) => ({
    id: index,
    image_url: src,
    alt_text: `Gallery ${index + 1}`,
  }))
  const gallery = visible.length > 0 ? visible : fallback

  return (
    <section className="website-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Gallery"
          title="Moments of Beauty"
          subtitle="A glimpse into our salon, our work, and the transformations we create every day."
        />
        {isLoading ? (
          <div className="flex justify-center py-12">
            <PageLoader />
          </div>
        ) : (
          <div className="columns-2 gap-4 md:columns-3">
            {gallery.map((item, i) => (
              <div
                key={item.id}
                className={`mb-4 break-inside-avoid overflow-hidden rounded-xl polishe-card-glow ${
                  i % 3 === 0 ? 'md:mt-8' : ''
                }`}
              >
                <img
                  src={item.image_url!}
                  alt={item.alt_text || item.title || `Gallery ${i + 1}`}
                  className="w-full object-cover transition duration-500 hover:scale-105"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
