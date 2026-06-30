import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { SectionHeading } from '@/components/website/SectionHeading'
import { publicWebsiteService } from '@/services/publicWebsiteService'
import { extractApiError } from '@/utils/apiError'
import type { PublicInquiryType } from '@/types/publicWebsite'

interface InquirySectionProps {
  compact?: boolean
}

function resolveInitialType(subject: string | null, product: string | null): PublicInquiryType {
  if (product || subject?.toLowerCase().includes('product')) {
    return 'product'
  }
  return 'general'
}

export function InquirySection({ compact = false }: InquirySectionProps) {
  const [searchParams] = useSearchParams()
  const productParam = searchParams.get('product')
  const subjectParam = searchParams.get('subject')

  const [type, setType] = useState<PublicInquiryType>(() =>
    resolveInitialType(subjectParam, productParam),
  )
  const [productName, setProductName] = useState(productParam ?? '')
  const [submitted, setSubmitted] = useState<{ reference: string } | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (productParam) {
      setType('product')
      setProductName(productParam)
    } else if (subjectParam?.toLowerCase().includes('product')) {
      setType('product')
    }
  }, [productParam, subjectParam])

  const inquiryMutation = useMutation({
    mutationFn: publicWebsiteService.createInquiry,
    onSuccess: (result) => {
      setSubmitted({ reference: result.reference })
      setFormError(null)
    },
    onError: (err) => setFormError(extractApiError(err, 'Unable to send inquiry. Please try again.')),
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError(null)
    const form = new FormData(e.currentTarget)

    inquiryMutation.mutate({
      type,
      name: String(form.get('name') ?? ''),
      phone: String(form.get('phone') ?? '') || undefined,
      email: String(form.get('email') ?? '') || undefined,
      subject: String(form.get('subject') ?? '') || undefined,
      product_name: type === 'product' ? productName || undefined : undefined,
      message: String(form.get('message') ?? ''),
    })
  }

  return (
    <section className={compact ? 'py-12' : 'website-section bg-white'}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {!compact && (
          <SectionHeading
            eyebrow="Inquiry"
            title="Send Us a Message"
            subtitle="Ask about products, services, packages, or anything else — we'll reply within one business day."
          />
        )}

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border bg-card p-6 polishe-card-glow md:p-8"
        >
          {submitted ? (
            <div className="rounded-xl bg-success/10 px-6 py-8 text-center">
              <p className="font-semibold text-success">Thank you!</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Reference <strong>{submitted.reference}</strong>. We&apos;ve received your inquiry and will
                get back to you shortly.
              </p>
            </div>
          ) : (
            <>
              {formError && (
                <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {formError}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                  <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    Inquiry Type
                  </span>
                  <select
                    className="website-input"
                    value={type}
                    onChange={(e) => setType(e.target.value as PublicInquiryType)}
                  >
                    <option value="product">Product Inquiry</option>
                    <option value="general">General Inquiry</option>
                    <option value="other">Other</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    Full Name
                  </span>
                  <input required type="text" name="name" className="website-input" placeholder="Your name" />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Phone</span>
                  <input type="tel" name="phone" className="website-input" placeholder="+971 ..." />
                </label>

                <label className="block sm:col-span-2">
                  <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Email</span>
                  <input type="email" name="email" className="website-input" placeholder="you@email.com" />
                </label>

                {type === 'product' && (
                  <label className="block sm:col-span-2">
                    <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      Product Name
                    </span>
                    <input
                      type="text"
                      className="website-input"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder="Which product are you interested in?"
                    />
                  </label>
                )}

                <label className="block sm:col-span-2">
                  <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    Subject (optional)
                  </span>
                  <input
                    type="text"
                    name="subject"
                    className="website-input"
                    defaultValue={subjectParam ?? ''}
                    placeholder="Brief subject line"
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Message</span>
                  <textarea
                    required
                    name="message"
                    rows={5}
                    className="website-input resize-none"
                    placeholder="Tell us how we can help..."
                  />
                </label>

                <p className="sm:col-span-2 text-xs text-muted-foreground">
                  Please provide at least a phone number or email so we can reach you.
                </p>

                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    disabled={inquiryMutation.isPending}
                    className="w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60 sm:w-auto sm:px-10"
                  >
                    {inquiryMutation.isPending ? 'Sending...' : 'Send Inquiry'}
                  </button>
                </div>
              </div>
            </>
          )}
        </form>
      </div>
    </section>
  )
}
