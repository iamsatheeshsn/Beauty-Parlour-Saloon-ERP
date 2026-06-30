import api from '@/services/api'
import type { ApiResponse, PaginatedResponse } from '@/types'

export interface GalleryItem {
  id: number
  title?: string | null
  alt_text?: string | null
  image?: string | null
  image_url?: string | null
  sort_order: number
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export interface GalleryItemPayload {
  title?: string | null
  alt_text?: string | null
  sort_order?: number
  is_active?: boolean
}

export const galleryItemService = {
  list: async (params?: { page?: number; per_page?: number; all?: boolean }) => {
    const { data } = await api.get<ApiResponse<PaginatedResponse<GalleryItem> | GalleryItem[]>>(
      '/gallery-items',
      { params },
    )
    return data.data
  },

  get: async (id: number) => {
    const { data } = await api.get<ApiResponse<GalleryItem>>(`/gallery-items/${id}`)
    return data.data
  },

  create: async (payload: GalleryItemPayload) => {
    const { data } = await api.post<ApiResponse<GalleryItem>>('/gallery-items', payload)
    return data.data
  },

  update: async (id: number, payload: Partial<GalleryItemPayload>) => {
    const { data } = await api.put<ApiResponse<GalleryItem>>(`/gallery-items/${id}`, payload)
    return data.data
  },

  remove: async (id: number) => {
    await api.delete(`/gallery-items/${id}`)
  },

  uploadImage: async (id: number, file: File) => {
    const form = new FormData()
    form.append('image', file)
    const { data } = await api.post<ApiResponse<GalleryItem>>(`/gallery-items/${id}/image`, form)
    return data.data
  },

  deleteImage: async (id: number) => {
    const { data } = await api.delete<ApiResponse<GalleryItem>>(`/gallery-items/${id}/image`)
    return data.data
  },
}
