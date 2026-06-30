import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ChevronDown } from 'lucide-react'
import { SectionHeading } from '@/components/website/SectionHeading'
import { FAQS } from '@/constants/websiteContent'
import { publicWebsiteService } from '@/services/publicWebsiteService'
import { PageLoader } from '@/components/ui/Loader'
import { cn } from '@/utils/cn'

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const { data: faqs = [], isLoading } = useQuery({
    queryKey: ['public-faqs'],
    queryFn: () => publicWebsiteService.getFaqs(),
    staleTime: 5 * 60 * 1000,
  })

  const visible =
    faqs.length > 0
      ? faqs.map((faq) => ({ q: faq.question, a: faq.answer, id: faq.id }))
      : FAQS.map((faq, index) => ({ ...faq, id: index }))

  return (
    <section className="website-section bg-muted/40">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="FAQ"
          title="Frequently Asked Questions"
          subtitle="Everything you need to know before your visit."
        />
        {isLoading ? (
          <div className="flex justify-center py-12">
            <PageLoader />
          </div>
        ) : (
          <div className="space-y-3">
            {visible.map((faq, i) => {
              const open = openIndex === i
              return (
                <div
                  key={faq.id}
                  className="overflow-hidden rounded-xl border border-border bg-white polishe-card-glow"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(open ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="text-sm font-semibold text-foreground">{faq.q}</span>
                    <ChevronDown
                      className={cn(
                        'h-5 w-5 shrink-0 text-primary transition-transform',
                        open && 'rotate-180',
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      'grid transition-all duration-300',
                      open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
