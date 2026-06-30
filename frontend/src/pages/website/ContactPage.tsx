import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { PageHero } from '@/components/website/PageHero'
import { ContactSection } from '@/components/website/ContactSection'
import { InquirySection } from '@/components/website/InquirySection'
import { FAQSection } from '@/components/website/FAQSection'

type ContactTab = 'booking' | 'inquiry'

export default function ContactPage() {
  const [searchParams] = useSearchParams()
  const defaultTab: ContactTab =
    searchParams.get('product') || searchParams.get('subject') ? 'inquiry' : 'booking'
  const [tab, setTab] = useState<ContactTab>(defaultTab)

  useEffect(() => {
    if (searchParams.get('product') || searchParams.get('subject')) {
      setTab('inquiry')
    }
  }, [searchParams])

  return (
    <>
      <PageHero
        title="Contact & Booking"
        subtitle="Schedule your visit, send a product inquiry, or reach out — we're here to help."
        bannerKey="banner_contact"
      />

      <section className="border-b border-border bg-muted/20">
        <div className="mx-auto flex max-w-7xl justify-center gap-2 px-4 py-6 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setTab('booking')}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
              tab === 'booking'
                ? 'bg-primary text-primary-foreground shadow'
                : 'border border-border bg-white text-muted-foreground hover:border-primary hover:text-primary'
            }`}
          >
            Book Appointment
          </button>
          <button
            type="button"
            onClick={() => setTab('inquiry')}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
              tab === 'inquiry'
                ? 'bg-primary text-primary-foreground shadow'
                : 'border border-border bg-white text-muted-foreground hover:border-primary hover:text-primary'
            }`}
          >
            Product & Other Inquiries
          </button>
        </div>
      </section>

      {tab === 'booking' ? <ContactSection /> : <InquirySection />}

      <div className="website-section bg-white">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm text-muted-foreground">
            Prefer the other option?{' '}
            <button
              type="button"
              onClick={() => setTab(tab === 'booking' ? 'inquiry' : 'booking')}
              className="font-semibold text-primary hover:underline"
            >
              {tab === 'booking' ? 'Send an inquiry instead' : 'Book an appointment instead'}
            </button>
            {' · '}
            <Link to="/shop" className="font-semibold text-primary hover:underline">
              Browse our shop
            </Link>
          </p>
        </div>
      </div>

      <FAQSection />
    </>
  )
}
