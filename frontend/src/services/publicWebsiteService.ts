import publicApi from '@/services/publicApi'
import type { ApiResponse } from '@/types'
import type {
  PublicBlogPost,
  PublicBookingPayload,
  PublicBookingResult,
  PublicHomepageSlide,
  PublicInquiryPayload,
  PublicInquiryResult,
  PublicGalleryItem,
  PublicFaq,
  PublicTestimonial,
  PublicProduct,
  PublicService,
  PublicServiceCategory,
  PublicServicePackage,
  PublicSettings,
  PublicStaffMember,
} from '@/types/publicWebsite'

export const publicWebsiteService = {
  async getSettings(): Promise<PublicSettings> {
    const { data } = await publicApi.get<ApiResponse<PublicSettings>>('/public/settings')
    return data.data
  },

  async getServices(): Promise<PublicService[]> {
    const { data } = await publicApi.get<ApiResponse<PublicService[]>>('/public/services')
    return data.data
  },

  async getServiceCategories(): Promise<PublicServiceCategory[]> {
    const { data } = await publicApi.get<ApiResponse<PublicServiceCategory[]>>(
      '/public/service-categories',
    )
    return data.data
  },

  async getServicePackages(): Promise<PublicServicePackage[]> {
    const { data } = await publicApi.get<ApiResponse<PublicServicePackage[]>>(
      '/public/service-packages',
    )
    return data.data
  },

  async getProducts(): Promise<PublicProduct[]> {
    const { data } = await publicApi.get<ApiResponse<PublicProduct[]>>('/public/products')
    return data.data
  },

  async getTeam(): Promise<PublicStaffMember[]> {
    const { data } = await publicApi.get<ApiResponse<PublicStaffMember[]>>('/public/team')
    return data.data
  },

  async getFeaturedTeam(): Promise<PublicStaffMember[]> {
    const { data } = await publicApi.get<ApiResponse<PublicStaffMember[]>>('/public/team/featured')
    return data.data
  },

  async getBlogPosts(): Promise<PublicBlogPost[]> {
    const { data } = await publicApi.get<ApiResponse<PublicBlogPost[]>>('/public/blog-posts')
    return data.data
  },

  async getBlogPost(slug: string): Promise<PublicBlogPost> {
    const { data } = await publicApi.get<ApiResponse<PublicBlogPost>>(`/public/blog-posts/${slug}`)
    return data.data
  },

  async createBooking(payload: PublicBookingPayload): Promise<PublicBookingResult> {
    const { data } = await publicApi.post<ApiResponse<PublicBookingResult>>(
      '/public/bookings',
      payload,
    )
    return data.data
  },

  async getHomepageSlides(): Promise<PublicHomepageSlide[]> {
    const { data } = await publicApi.get<ApiResponse<PublicHomepageSlide[]>>('/public/homepage-slides')
    return data.data
  },

  async getTestimonials(): Promise<PublicTestimonial[]> {
    const { data } = await publicApi.get<ApiResponse<PublicTestimonial[]>>('/public/testimonials')
    return data.data
  },

  async getGallery(): Promise<PublicGalleryItem[]> {
    const { data } = await publicApi.get<ApiResponse<PublicGalleryItem[]>>('/public/gallery')
    return data.data
  },

  async getFaqs(): Promise<PublicFaq[]> {
    const { data } = await publicApi.get<ApiResponse<PublicFaq[]>>('/public/faqs')
    return data.data
  },

  async createInquiry(payload: PublicInquiryPayload): Promise<PublicInquiryResult> {
    const { data } = await publicApi.post<ApiResponse<PublicInquiryResult>>(
      '/public/inquiries',
      payload,
    )
    return data.data
  },
}
