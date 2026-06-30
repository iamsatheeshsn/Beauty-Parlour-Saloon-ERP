import api from '@/services/api'
import type { ApiResponse, PaginatedResponse } from '@/types'

export interface BlogPost {
  id: number
  slug: string
  title: string
  excerpt?: string | null
  content: string
  featured_image?: string | null
  featured_image_url?: string | null
  author_name?: string | null
  category?: string | null
  tags?: string[]
  is_published: boolean
  published_at?: string | null
  sort_order: number
  created_at?: string
  updated_at?: string
}

export interface BlogPostPayload {
  title: string
  slug?: string
  excerpt?: string | null
  content: string
  author_name?: string | null
  category?: string | null
  tags?: string[]
  is_published?: boolean
  published_at?: string | null
  sort_order?: number
}

export const blogPostService = {
  list: async (params?: { page?: number; per_page?: number }) => {
    const { data } = await api.get<ApiResponse<PaginatedResponse<BlogPost>>>('/blog-posts', { params })
    return data.data
  },

  get: async (id: number) => {
    const { data } = await api.get<ApiResponse<BlogPost>>(`/blog-posts/${id}`)
    return data.data
  },

  create: async (payload: BlogPostPayload) => {
    const { data } = await api.post<ApiResponse<BlogPost>>('/blog-posts', payload)
    return data.data
  },

  update: async (id: number, payload: Partial<BlogPostPayload>) => {
    const { data } = await api.put<ApiResponse<BlogPost>>(`/blog-posts/${id}`, payload)
    return data.data
  },

  remove: async (id: number) => {
    await api.delete(`/blog-posts/${id}`)
  },

  uploadFeaturedImage: async (id: number, file: File) => {
    const form = new FormData()
    form.append('image', file)
    const { data } = await api.post<ApiResponse<BlogPost>>(`/blog-posts/${id}/featured-image`, form)
    return data.data
  },

  deleteFeaturedImage: async (id: number) => {
    const { data } = await api.delete<ApiResponse<BlogPost>>(`/blog-posts/${id}/featured-image`)
    return data.data
  },
}
