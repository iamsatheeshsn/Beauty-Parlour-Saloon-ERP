import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { SectionHeading } from '@/components/website/SectionHeading'
import { SALON } from '@/constants/websiteContent'
import { usePublicWebsite } from '@/contexts/PublicWebsiteContext'
import { publicWebsiteService } from '@/services/publicWebsiteService'
import {
  combineDateAndTime,
  isSalonDateTimeInPast,
  nextSalonTimeSlot,
  salonLocalDateString,
} from '@/utils/website'
import { extractApiError } from '@/utils/apiError'
import { PageLoader } from '@/components/ui/Loader'

interface ContactSectionProps {
  compact?: boolean
}

export function ContactSection({ compact = false }: ContactSectionProps) {
  const { settings } = usePublicWebsite()
  const salonTimezone = settings.timezone || 'Asia/Dubai'
  const minDate = salonLocalDateString(salonTimezone)
  const [preferredDate, setPreferredDate] = useState(minDate)
  const [preferredTime, setPreferredTime] = useState(() => nextSalonTimeSlot(salonTimezone))
  const [submitted, setSubmitted] = useState<{ reference: string; service?: string } | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const phone = settings.phone || SALON.phone
  const email = settings.email || SALON.email
  const location = settings.location || settings.address || SALON.location
  const address = settings.address || location
  const hours = settings.business_hours || SALON.hours
  const mapEmbedUrl =
    settings.map_embed_url ||
    'https://maps.google.com/maps?q=Dubai%20Marina&t=&z=13&ie=UTF8&iwloc=&output=embed'

  const { data: services = [], isLoading: servicesLoading } = useQuery({
    queryKey: ['public-services'],
    queryFn: () => publicWebsiteService.getServices(),
    staleTime: 5 * 60 * 1000,
  })

  const bookingMutation = useMutation({
    mutationFn: publicWebsiteService.createBooking,
    onSuccess: (result) => {
      setSubmitted(result)
      setFormError(null)
    },
    onError: (err) => setFormError(extractApiError(err, 'Unable to submit booking. Please try again.')),
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError(null)
    const form = new FormData(e.currentTarget)
    const date = String(form.get('date') ?? '')
    const time = String(form.get('time') ?? preferredTime)
    const serviceId = Number(form.get('service_id'))

    if (!date || !serviceId) return

    if (isSalonDateTimeInPast(date, time, salonTimezone)) {
      setFormError('Please choose a date and time in the future.')
      return
    }

    bookingMutation.mutate({
      name: String(form.get('name') ?? ''),
      phone: String(form.get('phone') ?? ''),
      email: String(form.get('email') ?? '') || undefined,
      service_id: serviceId,
      scheduled_at: combineDateAndTime(date, time),
      message: String(form.get('message') ?? '') || undefined,
    })
  }

  const minTime = preferredDate === minDate ? nextSalonTimeSlot(salonTimezone) : undefined

  return (
    <section id="book" className={compact ? 'py-12' : 'website-section bg-white'}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {!compact && (
          <SectionHeading
            eyebrow="Contact"
            title="Get in Touch"
            subtitle="We'd love to hear from you. Send us a message or visit our salon in Dubai Marina."
          />
        )}
        <div className="grid gap-8 lg:grid-cols-5 lg:gap-10">
          <div className="min-w-0 space-y-6 lg:col-span-2">
            <div className="rounded-2xl border border-border bg-muted/30 p-6">
              <h3 className="font-serif text-xl font-semibold text-foreground">Visit Us</h3>
              <ul className="mt-4 space-y-4 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span>
                    {settings.branch_name && (
                      <span className="block font-medium text-foreground">{settings.branch_name}</span>
                    )}
                    {address}
                  </span>
                </li>
                <li className="flex gap-3">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <a href={`tel:${phone.replace(/\s/g, '')}`} className="hover:text-primary">
                    {phone}
                  </a>
                </li>
                <li className="flex gap-3">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <a href={`mailto:${email}`} className="hover:text-primary">
                    {email}
                  </a>
                </li>
                <li className="flex gap-3">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  {hours}
                </li>
              </ul>
            </div>
            <div className="overflow-hidden rounded-2xl polishe-card-glow">
              <iframe
                title="Salon location map"
                src={mapEmbedUrl}
                className="h-56 w-full border-0 grayscale-[30%]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div className="min-w-0 lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-border bg-card p-6 polishe-card-glow md:p-8"
            >
              <h3 className="font-serif text-2xl font-semibold text-foreground">
                Book an Appointment
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Fill in your details and we&apos;ll confirm your booking within 2 hours.
              </p>

              {submitted ? (
                <div className="mt-8 rounded-xl bg-success/10 px-6 py-8 text-center">
                  <p className="font-semibold text-success">Thank you!</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Reference <strong>{submitted.reference}</strong>
                    {submitted.service ? ` · ${submitted.service}` : ''}. We&apos;ll contact you shortly
                    to confirm.
                  </p>
                </div>
              ) : (
                <>
                  {formError && (
                    <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                      {formError}
                    </div>
                  )}
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                        Full Name
                      </span>
                      <input required type="text" name="name" className="website-input" placeholder="Your name" />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                        Phone
                      </span>
                      <input required type="tel" name="phone" className="website-input" placeholder="+971 ..." />
                    </label>
                    <label className="block sm:col-span-2">
                      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                        Email
                      </span>
                      <input type="email" name="email" className="website-input" placeholder="you@email.com" />
                    </label>
                    <label className="block sm:col-span-2">
                      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                        Service
                      </span>
                      {servicesLoading ? (
                        <div className="py-3">
                          <PageLoader />
                        </div>
                      ) : (
                        <select name="service_id" className="website-input" required defaultValue="">
                          <option value="" disabled>
                            Select a service
                          </option>
                          {services.map((service) => (
                            <option key={service.id} value={service.id}>
                              {service.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                        Preferred Date
                      </span>
                      <input
                        required
                        type="date"
                        name="date"
                        min={minDate}
                        value={preferredDate}
                        onChange={(e) => {
                          const value = e.target.value
                          setPreferredDate(value)
                          if (value === minDate) {
                            setPreferredTime(nextSalonTimeSlot(salonTimezone))
                          }
                        }}
                        className="website-input"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                        Preferred Time
                      </span>
                      <input
                        required
                        type="time"
                        name="time"
                        min={minTime}
                        value={preferredTime}
                        onChange={(e) => setPreferredTime(e.target.value)}
                        className="website-input"
                      />
                    </label>
                    <label className="block sm:col-span-2">
                      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                        Message
                      </span>
                      <textarea
                        name="message"
                        rows={4}
                        className="website-input resize-none"
                        placeholder="Any special requests..."
                      />
                    </label>
                    <div className="sm:col-span-2">
                      <button
                        type="submit"
                        disabled={bookingMutation.isPending || servicesLoading}
                        className="w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60 sm:w-auto sm:px-10"
                      >
                        {bookingMutation.isPending ? 'Sending...' : 'Send Request'}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
