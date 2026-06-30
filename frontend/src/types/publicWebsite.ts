export interface PublicSettings {
  app_name: string
  company_name?: string
  public_website_name?: string | null
  website_name?: string | null
  timezone: string
  currency: string
  currency_symbol: string
  vat_rate: number
  vat_enabled: boolean
  primary_color?: string
  secondary_color?: string
  app_logo?: string | null
  app_favicon?: string | null
  phone?: string | null
  email?: string | null
  address?: string | null
  website?: string | null
  location?: string | null
  branch_name?: string | null
  business_hours?: string | null
  map_url?: string | null
  map_embed_url?: string | null
  public_whatsapp?: string | null
  whatsapp_url?: string | null
  salon_interior_image?: string | null
  banner_home?: string | null
  banner_about?: string | null
  banner_services?: string | null
  banner_shop?: string | null
  banner_blog?: string | null
  banner_team?: string | null
  banner_contact?: string | null
  homepage_team_ids?: number[]
}

export interface PublicServiceCategory {
  id: number
  name: string
  code?: string
  description?: string | null
  icon?: string | null
  color?: string | null
}

export interface PublicService {
  id: number
  name: string
  description?: string | null
  image_url?: string | null
  duration_minutes: number
  price: string | number
  total_price?: string | number
  service_category_id?: number | null
  category?: PublicServiceCategory | null
}

export interface PublicServicePackage {
  id: number
  name: string
  description?: string | null
  price: string | number
  total_price?: string | number
  points_included: number
  validity_days?: number | null
  items?: Array<{
    id: number
    service_id: number
    points_cost: number
    quantity_included: number
    service?: { id: number; name: string; code?: string }
  }>
}

export interface PublicProduct {
  id: number
  name: string
  description?: string | null
  image_url?: string | null
  retail_price: string | number
  vat_rate?: number
  vat_inclusive?: boolean
  unit?: string | null
  category?: { id: number; name: string; code?: string } | null
  brand?: { id: number; name: string } | null
}

export interface PublicStaffMember {
  id: number
  name: string
  avatar?: string | null
  designation?: string | null
  department?: string | null
}

export interface PublicBlogPost {
  id: number
  slug: string
  title: string
  excerpt?: string | null
  content?: string
  featured_image?: string | null
  author_name?: string | null
  category?: string | null
  tags?: string[]
  published_at?: string | null
  reading_time?: number
}

export interface PublicBookingPayload {
  name: string
  phone: string
  email?: string
  service_id: number
  scheduled_at: string
  message?: string
}

export interface PublicBookingResult {
  reference: string
  scheduled_at?: string
  service?: string
}

export type PublicInquiryType = 'product' | 'general' | 'other'

export interface PublicInquiryPayload {
  type: PublicInquiryType
  name: string
  phone?: string
  email?: string
  subject?: string
  product_name?: string
  message: string
}

export interface PublicInquiryResult {
  reference: string
  type: PublicInquiryType
}

export interface PublicHomepageSlide {
  id: number
  eyebrow?: string | null
  title: string
  subtitle?: string | null
  cta_text?: string | null
  cta_link?: string | null
  secondary_cta_text?: string | null
  secondary_cta_link?: string | null
  image_url?: string | null
}

export interface PublicTestimonial {
  id: number
  quote: string
  name: string
  role?: string | null
}

export interface PublicGalleryItem {
  id: number
  title?: string | null
  alt_text?: string | null
  image_url?: string | null
}

export interface PublicFaq {
  id: number
  question: string
  answer: string
}
