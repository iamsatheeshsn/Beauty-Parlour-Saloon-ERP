import api from '@/services/api'
import type { ApiResponse, PaginatedResponse } from '@/types'
import type { ListParams } from './masterService'

export type SaleLineType = 'service' | 'package' | 'package_redemption'
export type DiscountType = 'none' | 'percentage' | 'fixed'

export interface SaleItem {
  id: number
  line_type: SaleLineType
  salon_service_id?: number | null
  service_package_id?: number | null
  staff_id?: number | null
  customer_package_id?: number | null
  description: string
  quantity: number
  unit_price: number
  vat_rate: number
  vat_inclusive: boolean
  line_subtotal: number
  line_vat: number
  line_total: number
  points_redeemed: number
  service?: { id: number; name: string; code?: string }
  staff?: { id: number; name: string }
}

export interface SalePayment {
  id: number
  payment_method_id: number
  amount: number
  reference?: string | null
  payment_method?: { id: number; name: string; code?: string }
}

export interface Sale {
  id: number
  code: string
  type: string
  status: string
  customer_id: number
  discount_type: DiscountType
  discount_value: number
  subtotal: number
  discount_amount: number
  vat_amount: number
  total_amount: number
  amount_paid: number
  currency: string
  trn_snapshot?: string | null
  points_redeemed: number
  notes?: string | null
  paid_at?: string
  customer?: { id: number; name: string; phone?: string; code?: string }
  branch?: { id: number; name: string; address?: string }
  sold_by?: { id: number; name: string }
  items?: SaleItem[]
  payments?: SalePayment[]
  created_at?: string
}

export interface CartItemPayload {
  line_type: SaleLineType
  service_id?: number
  service_package_id?: number
  staff_id?: number | null
  customer_package_id?: number | null
  quantity?: number
  points?: number
}

export interface CheckoutPayload {
  customer_id: number
  appointment_id?: number
  discount_type?: DiscountType
  discount_value?: number
  notes?: string
  items: CartItemPayload[]
  payments: { payment_method_id: number; amount: number; reference?: string }[]
}

export interface SalePreview {
  lines: unknown[]
  subtotal: number
  discount_type: DiscountType
  discount_value: number
  discount_amount: number
  vat_amount: number
  total_amount: number
  points_redeemed: number
  vat_rate: number
  vat_enabled: boolean
}

export interface ReceiptData {
  sale: Sale
  company?: {
    name: string
    trade_name?: string
    address?: string
    phone?: string
    email?: string
    trn_number?: string
  } | null
  settings?: { currency: string; vat_enabled: boolean }
}

export const saleService = {
  stats: async () => {
    const { data } = await api.get<ApiResponse<{ total_revenue: number; today_revenue: number }>>('/sales/stats')
    return data.data
  },

  preview: async (payload: { items: CartItemPayload[]; discount_type?: DiscountType; discount_value?: number }) => {
    const { data } = await api.post<ApiResponse<SalePreview>>('/sales/preview', payload)
    return data.data
  },

  checkout: async (payload: CheckoutPayload) => {
    const { data } = await api.post<ApiResponse<Sale>>('/sales/checkout', payload)
    return data.data
  },

  list: async (params?: ListParams) => {
    const { data } = await api.get<ApiResponse<PaginatedResponse<Sale>>>('/sales', { params })
    return data.data
  },

  get: async (id: number) => {
    const { data } = await api.get<ApiResponse<Sale>>(`/sales/${id}`)
    return data.data
  },

  receipt: async (id: number) => {
    const { data } = await api.get<ApiResponse<ReceiptData>>(`/sales/${id}/receipt`)
    return data.data
  },
}
