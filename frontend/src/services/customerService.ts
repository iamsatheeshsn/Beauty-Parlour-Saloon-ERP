import api from '@/services/api'
import type { ApiResponse, PaginatedResponse } from '@/types'
import type { ListParams } from './masterService'

export type Gender = 'female' | 'male' | 'other' | 'prefer_not_to_say'

export interface Customer {
  id: number
  company_id?: number
  branch_id?: number | null
  code: string
  name: string
  phone: string
  email?: string | null
  gender?: Gender | null
  date_of_birth?: string | null
  address?: string | null
  emirate_id?: number | null
  city_id?: number | null
  photo?: string | null
  summary?: string | null
  total_visits: number
  total_spent: number
  last_visit_at?: string | null
  is_active: boolean
  branch?: { id: number; name: string }
  emirate?: { id: number; name: string }
  city?: { id: number; name: string }
  notes?: CustomerNote[]
  visits?: CustomerVisit[]
  created_at?: string
  updated_at?: string
}

export interface CustomerPayload {
  name: string
  phone: string
  email?: string | null
  gender?: Gender | null
  date_of_birth?: string | null
  address?: string | null
  branch_id?: number | null
  emirate_id?: number | null
  city_id?: number | null
  summary?: string | null
  is_active?: boolean
}

export interface CustomerNote {
  id: number
  customer_id: number
  note: string
  is_pinned: boolean
  user?: { id: number; name: string }
  created_at?: string
  updated_at?: string
}

export interface CustomerVisit {
  id: number
  customer_id: number
  branch_id?: number | null
  staff_id?: number | null
  visited_at: string
  purpose?: string | null
  services_summary?: string | null
  amount_spent?: number | null
  notes?: string | null
  branch?: { id: number; name: string }
  staff?: { id: number; name: string }
  created_at?: string
}

export interface CustomerSearchResult {
  found: boolean
  customer: Customer | null
}

export interface CustomerHistoryItem {
  type: 'visit' | 'note'
  id: number
  title: string
  description?: string | null
  amount_spent?: number | null
  author?: string | null
  occurred_at?: string
}

export interface CustomerHistoryResponse {
  customer: Customer
  timeline: CustomerHistoryItem[]
}

export const GENDER_OPTIONS = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'other', label: 'Other' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
] as const

export const customerService = {
  list: async (params?: ListParams) => {
    const { data } = await api.get<ApiResponse<PaginatedResponse<Customer> | Customer[]>>('/customers', { params })
    return data.data
  },

  get: async (id: number) => {
    const { data } = await api.get<ApiResponse<Customer>>(`/customers/${id}`)
    return data.data
  },

  searchByPhone: async (phone: string) => {
    const { data } = await api.get<ApiResponse<CustomerSearchResult>>('/customers/search-by-phone', {
      params: { phone },
    })
    return data.data
  },

  create: async (payload: CustomerPayload) => {
    const { data } = await api.post<ApiResponse<Customer>>('/customers', payload)
    return data.data
  },

  update: async (id: number, payload: Partial<CustomerPayload>) => {
    const { data } = await api.put<ApiResponse<Customer>>(`/customers/${id}`, payload)
    return data.data
  },

  remove: async (id: number) => {
    await api.delete(`/customers/${id}`)
  },

  uploadPhoto: async (id: number, file: File) => {
    const form = new FormData()
    form.append('photo', file)
    const { data } = await api.post<ApiResponse<Customer>>(`/customers/${id}/photo`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.data
  },

  deletePhoto: async (id: number) => {
    const { data } = await api.delete<ApiResponse<Customer>>(`/customers/${id}/photo`)
    return data.data
  },

  history: async (id: number) => {
    const { data } = await api.get<ApiResponse<CustomerHistoryResponse>>(`/customers/${id}/history`)
    return data.data
  },

  listNotes: async (customerId: number) => {
    const { data } = await api.get<ApiResponse<CustomerNote[]>>(`/customers/${customerId}/notes`)
    return data.data
  },

  createNote: async (customerId: number, payload: { note: string; is_pinned?: boolean }) => {
    const { data } = await api.post<ApiResponse<CustomerNote>>(`/customers/${customerId}/notes`, payload)
    return data.data
  },

  updateNote: async (id: number, payload: { note?: string; is_pinned?: boolean }) => {
    const { data } = await api.put<ApiResponse<CustomerNote>>(`/customer-notes/${id}`, payload)
    return data.data
  },

  deleteNote: async (id: number) => {
    await api.delete(`/customer-notes/${id}`)
  },

  listVisits: async (customerId: number, params?: ListParams) => {
    const { data } = await api.get<ApiResponse<PaginatedResponse<CustomerVisit> | CustomerVisit[]>>(
      `/customers/${customerId}/visits`,
      { params }
    )
    return data.data
  },

  createVisit: async (
    customerId: number,
    payload: {
      visited_at: string
      branch_id?: number | null
      staff_id?: number | null
      purpose?: string | null
      services_summary?: string | null
      amount_spent?: number | null
      notes?: string | null
    }
  ) => {
    const { data } = await api.post<ApiResponse<CustomerVisit>>(`/customers/${customerId}/visits`, payload)
    return data.data
  },

  updateVisit: async (
    id: number,
    payload: Partial<{
      visited_at: string
      branch_id: number | null
      staff_id: number | null
      purpose: string | null
      services_summary: string | null
      amount_spent: number | null
      notes: string | null
    }>
  ) => {
    const { data } = await api.put<ApiResponse<CustomerVisit>>(`/customer-visits/${id}`, payload)
    return data.data
  },

  deleteVisit: async (id: number) => {
    await api.delete(`/customer-visits/${id}`)
  },
}
