import api from '@/services/api'
import type { ApiResponse, PaginatedResponse } from '@/types'

export interface Testimonial {
  id: number
  quote: string
  name: string
  role?: string | null
  sort_order: number
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export interface TestimonialPayload {
  quote: string
  name: string
  role?: string | null
  sort_order?: number
  is_active?: boolean
}

export const testimonialService = {
  list: async (params?: { page?: number; per_page?: number; all?: boolean }) => {
    const { data } = await api.get<ApiResponse<PaginatedResponse<Testimonial> | Testimonial[]>>(
      '/testimonials',
      { params },
    )
    return data.data
  },

  get: async (id: number) => {
    const { data } = await api.get<ApiResponse<Testimonial>>(`/testimonials/${id}`)
    return data.data
  },

  create: async (payload: TestimonialPayload) => {
    const { data } = await api.post<ApiResponse<Testimonial>>('/testimonials', payload)
    return data.data
  },

  update: async (id: number, payload: Partial<TestimonialPayload>) => {
    const { data } = await api.put<ApiResponse<Testimonial>>(`/testimonials/${id}`, payload)
    return data.data
  },

  remove: async (id: number) => {
    await api.delete(`/testimonials/${id}`)
  },
}
