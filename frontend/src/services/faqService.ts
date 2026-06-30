import api from '@/services/api'
import type { ApiResponse, PaginatedResponse } from '@/types'

export interface Faq {
  id: number
  question: string
  answer: string
  sort_order: number
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export interface FaqPayload {
  question: string
  answer: string
  sort_order?: number
  is_active?: boolean
}

export const faqService = {
  list: async (params?: { page?: number; per_page?: number; all?: boolean }) => {
    const { data } = await api.get<ApiResponse<PaginatedResponse<Faq> | Faq[]>>('/faqs', { params })
    return data.data
  },

  get: async (id: number) => {
    const { data } = await api.get<ApiResponse<Faq>>(`/faqs/${id}`)
    return data.data
  },

  create: async (payload: FaqPayload) => {
    const { data } = await api.post<ApiResponse<Faq>>('/faqs', payload)
    return data.data
  },

  update: async (id: number, payload: Partial<FaqPayload>) => {
    const { data } = await api.put<ApiResponse<Faq>>(`/faqs/${id}`, payload)
    return data.data
  },

  remove: async (id: number) => {
    await api.delete(`/faqs/${id}`)
  },
}
