import api from '@/services/api'
import type { ApiResponse, PaginatedResponse } from '@/types'

export interface HomepageSlide {
  id: number
  eyebrow?: string | null
  title: string
  subtitle?: string | null
  cta_text?: string | null
  cta_link?: string | null
  secondary_cta_text?: string | null
  secondary_cta_link?: string | null
  image?: string | null
  image_url?: string | null
  sort_order: number
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export interface HomepageSlidePayload {
  eyebrow?: string | null
  title: string
  subtitle?: string | null
  cta_text?: string | null
  cta_link?: string | null
  secondary_cta_text?: string | null
  secondary_cta_link?: string | null
  sort_order?: number
  is_active?: boolean
}

export const homepageSlideService = {
  list: async (params?: { page?: number; per_page?: number; all?: boolean }) => {
    const { data } = await api.get<ApiResponse<PaginatedResponse<HomepageSlide> | HomepageSlide[]>>(
      '/homepage-slides',
      { params },
    )
    return data.data
  },

  get: async (id: number) => {
    const { data } = await api.get<ApiResponse<HomepageSlide>>(`/homepage-slides/${id}`)
    return data.data
  },

  create: async (payload: HomepageSlidePayload) => {
    const { data } = await api.post<ApiResponse<HomepageSlide>>('/homepage-slides', payload)
    return data.data
  },

  update: async (id: number, payload: Partial<HomepageSlidePayload>) => {
    const { data } = await api.put<ApiResponse<HomepageSlide>>(`/homepage-slides/${id}`, payload)
    return data.data
  },

  remove: async (id: number) => {
    await api.delete(`/homepage-slides/${id}`)
  },

  uploadImage: async (id: number, file: File) => {
    const form = new FormData()
    form.append('image', file)
    const { data } = await api.post<ApiResponse<HomepageSlide>>(`/homepage-slides/${id}/image`, form)
    return data.data
  },

  deleteImage: async (id: number) => {
    const { data } = await api.delete<ApiResponse<HomepageSlide>>(`/homepage-slides/${id}/image`)
    return data.data
  },
}
