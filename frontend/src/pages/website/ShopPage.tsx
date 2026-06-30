import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight } from 'lucide-react'
import { PageHero } from '@/components/website/PageHero'
import { SectionHeading } from '@/components/website/SectionHeading'
import { publicWebsiteService } from '@/services/publicWebsiteService'
import { formatPublicPrice, productCategoryImage, productDisplayPrice } from '@/utils/website'
import { usePublicWebsite } from '@/contexts/PublicWebsiteContext'
import { PageLoader } from '@/components/ui/Loader'
import { CTABanner } from '@/components/website/CTABanner'
import type { PublicProduct } from '@/types/publicWebsite'

export default function ShopPage() {
  const { settings } = usePublicWebsite()
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null)

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['public-products'],
    queryFn: () => publicWebsiteService.getProducts(),
    staleTime: 5 * 60 * 1000,
  })

  const categories = useMemo(() => {
    const map = new Map<number, { id: number; name: string }>()
    products.forEach((product) => {
      if (product.category) {
        map.set(product.category.id, { id: product.category.id, name: product.category.name })
      }
    })
    return Array.from(map.values())
  }, [products])

  const filteredProducts = useMemo(() => {
    if (!activeCategoryId) return products
    return products.filter((product) => product.category?.id === activeCategoryId)
  }, [products, activeCategoryId])

  const inquireHref = (product: PublicProduct) => {
    const params = new URLSearchParams({
      subject: 'Product Inquiry',
      product: product.name,
    })
    return `/contact?${params.toString()}`
  }

  return (
    <>
      <PageHero
        title="Salon Shop"
        subtitle="Professional haircare, skincare, and beauty products — curated by our stylists."
        bannerKey="banner_shop"
      />
      <section className="website-section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Retail"
            title="Premium Products"
            subtitle="Available in-salon. Contact us to reserve or inquire about availability."
          />

          {categories.length > 1 && (
            <div className="mb-10 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => setActiveCategoryId(null)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activeCategoryId === null
                    ? 'bg-primary text-primary-foreground shadow'
                    : 'border border-border bg-white text-muted-foreground hover:border-primary hover:text-primary'
                }`}
              >
                All Products
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategoryId(category.id)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    activeCategoryId === category.id
                      ? 'bg-primary text-primary-foreground shadow'
                      : 'border border-border bg-white text-muted-foreground hover:border-primary hover:text-primary'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center py-20">
              <PageLoader />
            </div>
          ) : filteredProducts.length === 0 ? (
            <p className="text-center text-muted-foreground">
              {products.length === 0
                ? 'Products will appear here once configured in inventory.'
                : 'No products in this category yet.'}
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => {
                const displayPrice = productDisplayPrice(
                  product.retail_price,
                  product.vat_rate,
                  product.vat_inclusive,
                )
                const showVatNote =
                  settings.vat_enabled &&
                  !product.vat_inclusive &&
                  Number(product.vat_rate ?? 0) > 0

                return (
                  <article
                    key={product.id}
                    className="group polishe-card-glow flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={product.image_url || productCategoryImage(product.category?.code)}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#2d1f22]/50 to-transparent" />
                      {product.category?.name && (
                        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary">
                          {product.category.name}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      {product.brand?.name && (
                        <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
                          {product.brand.name}
                        </span>
                      )}
                      <h3 className="mt-1 font-serif text-lg font-semibold text-foreground">{product.name}</h3>
                      {product.description && (
                        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                          {product.description}
                        </p>
                      )}
                      <div className="mt-4 flex items-end justify-between gap-3 border-t border-border/50 pt-4">
                        <div>
                          <span className="font-semibold text-primary">
                            {formatPublicPrice(
                              displayPrice,
                              settings.currency,
                              settings.currency_symbol,
                            )}
                          </span>
                          {showVatNote && (
                            <p className="mt-0.5 text-xs text-muted-foreground">incl. VAT</p>
                          )}
                          {product.unit && (
                            <p className="mt-0.5 text-xs text-muted-foreground">per {product.unit}</p>
                          )}
                        </div>
                        <Link
                          to={inquireHref(product)}
                          className="inline-flex shrink-0 items-center gap-1 rounded-full border border-primary px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
                        >
                          Inquire
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </section>
      <CTABanner />
    </>
  )
}
