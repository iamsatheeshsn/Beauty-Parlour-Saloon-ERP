import api from '@/services/api'
import type { ApiResponse, PaginatedResponse } from '@/types'

export type WebsiteInquiryType = 'product' | 'general' | 'other'
export type WebsiteInquiryStatus = 'new' | 'read' | 'responded' | 'archived'

export interface WebsiteInquiry {
  id: number
  code: string
  type: WebsiteInquiryType
  status: WebsiteInquiryStatus
  name: string
  phone?: string | null
  email?: string | null
  subject?: string | null
  product_name?: string | null
  message: string
  read_at?: string | null
  responded_at?: string | null
  created_at?: string
  updated_at?: string
}

export interface WebsiteInquiryStats {
  new_count: number
}

export const INQUIRY_TYPE_OPTIONS = [
  { value: 'product', label: 'Product Inquiry' },
  { value: 'general', label: 'General Inquiry' },
  { value: 'other', label: 'Other' },
] as const

export const INQUIRY_STATUS_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'read', label: 'Read' },
  { value: 'responded', label: 'Responded' },
  { value: 'archived', label: 'Archived' },
] as const

export function inquiryTypeLabel(type: WebsiteInquiryType): string {
  return INQUIRY_TYPE_OPTIONS.find((o) => o.value === type)?.label ?? type
}

export function inquiryStatusLabel(status: WebsiteInquiryStatus): string {
  return INQUIRY_STATUS_OPTIONS.find((o) => o.value === status)?.label ?? status
}

export function inquiryStatusVariant(status: WebsiteInquiryStatus): 'default' | 'success' | 'warning' | 'destructive' {
  if (status === 'new') return 'warning'
  if (status === 'responded') return 'success'
  if (status === 'archived') return 'default'
  return 'default'
}

export const websiteInquiryService = {
  list: async (params?: {
    page?: number
    per_page?: number
    search?: string
    type?: string
    status?: string
  }) => {
    const { data } = await api.get<ApiResponse<PaginatedResponse<WebsiteInquiry>>>(
      '/website-inquiries',
      { params },
    )
    return data.data
  },

  stats: async () => {
    const { data } = await api.get<ApiResponse<WebsiteInquiryStats>>('/website-inquiries/stats')
    return data.data
  },

  get: async (id: number) => {
    const { data } = await api.get<ApiResponse<WebsiteInquiry>>(`/website-inquiries/${id}`)
    return data.data
  },

  updateStatus: async (id: number, status: WebsiteInquiryStatus) => {
    const { data } = await api.patch<ApiResponse<WebsiteInquiry>>(
      `/website-inquiries/${id}/status`,
      { status },
    )
    return data.data
  },

  remove: async (id: number) => {
    await api.delete(`/website-inquiries/${id}`)
  },
}
