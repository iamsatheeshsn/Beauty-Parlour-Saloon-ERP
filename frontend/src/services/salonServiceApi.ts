import api from '@/services/api'
import type { ApiResponse, PaginatedResponse } from '@/types'
import type { ListParams } from './masterService'

export type CommissionType = 'percentage' | 'fixed'

export interface SalonServiceItem {
  id: number
  company_id?: number
  service_category_id?: number | null
  code: string
  name: string
  description?: string | null
  image_url?: string | null
  duration_minutes: number
  price: number
  vat_rate: number
  vat_inclusive: boolean
  vat_amount: number
  total_price: number
  commission_rate?: number | null
  commission_type: CommissionType
  is_active: boolean
  sort_order?: number
  category?: { id: number; name: string; code?: string; color?: string }
  created_at?: string
  updated_at?: string
}

export interface SalonServicePayload {
  name: string
  service_category_id?: number | null
  description?: string | null
  duration_minutes: number
  price: number
  vat_rate?: number
  vat_inclusive?: boolean
  commission_rate?: number | null
  commission_type?: CommissionType
  is_active?: boolean
  sort_order?: number
}

export interface ServiceStats {
  total: number
  inactive: number
}

export const salonServiceApi = {
  list: async (params?: ListParams & { service_category_id?: number; is_active?: boolean }) => {
    const { data } = await api.get<ApiResponse<PaginatedResponse<SalonServiceItem> | SalonServiceItem[]>>('/services', { params })
    return data.data
  },

  get: async (id: number) => {
    const { data } = await api.get<ApiResponse<SalonServiceItem>>(`/services/${id}`)
    return data.data
  },

  stats: async () => {
    const { data } = await api.get<ApiResponse<ServiceStats>>('/services/stats')
    return data.data
  },

  create: async (payload: SalonServicePayload) => {
    const { data } = await api.post<ApiResponse<SalonServiceItem>>('/services', payload)
    return data.data
  },

  update: async (id: number, payload: Partial<SalonServicePayload>) => {
    const { data } = await api.put<ApiResponse<SalonServiceItem>>(`/services/${id}`, payload)
    return data.data
  },

  remove: async (id: number) => {
    await api.delete(`/services/${id}`)
  },

  uploadImage: async (id: number, file: File) => {
    const form = new FormData()
    form.append('image', file)
    const { data } = await api.post<ApiResponse<SalonServiceItem>>(`/services/${id}/image`, form)
    return data.data
  },

  deleteImage: async (id: number) => {
    const { data } = await api.delete<ApiResponse<SalonServiceItem>>(`/services/${id}/image`)
    return data.data
  },
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}
