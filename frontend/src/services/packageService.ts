import api from '@/services/api'
import type { ApiResponse, PaginatedResponse } from '@/types'
import type { ListParams } from './masterService'

export type CustomerPackageStatus = 'active' | 'exhausted' | 'expired' | 'cancelled'
export type PointTransactionType =
  | 'purchase'
  | 'allocation'
  | 'consumption'
  | 'refund'
  | 'expiry'
  | 'adjustment'

export interface ServicePackageItem {
  id?: number
  service_package_id?: number
  service_id: number
  points_cost: number
  quantity_included?: number | null
  sort_order?: number
  service?: { id: number; code?: string; name: string; duration_minutes?: number; total_price?: number }
}

export interface ServicePackage {
  id: number
  company_id?: number
  code: string
  name: string
  description?: string | null
  price: number
  points_included: number
  validity_days?: number | null
  vat_rate: number
  vat_inclusive: boolean
  vat_amount?: number
  total_price: number
  is_active: boolean
  sort_order?: number
  items?: ServicePackageItem[]
  created_at?: string
  updated_at?: string
}

export interface ServicePackagePayload {
  name: string
  description?: string | null
  price: number
  points_included: number
  validity_days?: number | null
  vat_rate?: number
  vat_inclusive?: boolean
  is_active?: boolean
  sort_order?: number
  items?: { service_id: number; points_cost: number; quantity_included?: number | null }[]
}

export interface CustomerPackage {
  id: number
  company_id?: number
  customer_id: number
  service_package_id: number
  branch_id?: number | null
  code: string
  purchase_amount: number
  points_allocated: number
  points_remaining: number
  points_consumed: number
  status: CustomerPackageStatus
  purchased_at: string
  expires_at?: string | null
  notes?: string | null
  customer?: { id: number; name: string; phone?: string; code?: string }
  service_package?: { id: number; code?: string; name: string; points_included?: number }
  branch?: { id: number; name: string }
  sold_by?: { id: number; name: string }
}

export interface PointTransaction {
  id: number
  customer_id: number
  customer_package_id?: number | null
  appointment_id?: number | null
  service_id?: number | null
  type: PointTransactionType
  type_label: string
  points: number
  balance_after: number
  reference?: string | null
  description?: string | null
  customer?: { id: number; name: string; phone?: string }
  customer_package?: { id: number; code: string }
  service?: { id: number; name: string }
  created_by?: { id: number; name: string }
  created_at?: string
}

export interface CustomerPackageSummary {
  balance: number
  packages: CustomerPackage[]
}

export const PACKAGE_STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'exhausted', label: 'Exhausted' },
  { value: 'expired', label: 'Expired' },
  { value: 'cancelled', label: 'Cancelled' },
] as const

export const TRANSACTION_TYPE_OPTIONS = [
  { value: 'purchase', label: 'Package Purchase' },
  { value: 'allocation', label: 'Point Allocation' },
  { value: 'consumption', label: 'Point Consumption' },
  { value: 'refund', label: 'Refund' },
  { value: 'expiry', label: 'Expiry' },
  { value: 'adjustment', label: 'Adjustment' },
] as const

export function packageStatusLabel(status: CustomerPackageStatus): string {
  return PACKAGE_STATUS_OPTIONS.find((o) => o.value === status)?.label ?? status
}

export function packageStatusVariant(
  status: CustomerPackageStatus
): 'default' | 'success' | 'warning' | 'destructive' {
  switch (status) {
    case 'active':
      return 'success'
    case 'exhausted':
      return 'default'
    case 'expired':
      return 'warning'
    case 'cancelled':
      return 'destructive'
  }
}

export const packageService = {
  stats: async () => {
    const { data } = await api.get<ApiResponse<{ total: number; inactive: number }>>('/service-packages/stats')
    return data.data
  },

  list: async (params?: ListParams & { is_active?: boolean }) => {
    const { data } = await api.get<ApiResponse<PaginatedResponse<ServicePackage>>>('/service-packages', { params })
    return data.data
  },

  listActive: async () => {
    const { data } = await api.get<ApiResponse<ServicePackage[]>>('/service-packages/active')
    return data.data
  },

  get: async (id: number) => {
    const { data } = await api.get<ApiResponse<ServicePackage>>(`/service-packages/${id}`)
    return data.data
  },

  create: async (payload: ServicePackagePayload) => {
    const { data } = await api.post<ApiResponse<ServicePackage>>('/service-packages', payload)
    return data.data
  },

  update: async (id: number, payload: Partial<ServicePackagePayload>) => {
    const { data } = await api.put<ApiResponse<ServicePackage>>(`/service-packages/${id}`, payload)
    return data.data
  },

  remove: async (id: number) => {
    await api.delete(`/service-packages/${id}`)
  },

  listPurchases: async (params?: ListParams & { status?: string; customer_id?: number }) => {
    const { data } = await api.get<ApiResponse<PaginatedResponse<CustomerPackage>>>('/customer-packages', { params })
    return data.data
  },

  getPurchase: async (id: number) => {
    const { data } = await api.get<ApiResponse<CustomerPackage>>(`/customer-packages/${id}`)
    return data.data
  },

  forCustomer: async (customerId: number) => {
    const { data } = await api.get<ApiResponse<CustomerPackageSummary>>(`/customers/${customerId}/packages`)
    return data.data
  },

  balance: async (customerId: number) => {
    const { data } = await api.get<ApiResponse<{ balance: number }>>(`/customers/${customerId}/point-balance`)
    return data.data.balance
  },

  transactions: async (params?: ListParams & { customer_id?: number; type?: string }) => {
    const { data } = await api.get<ApiResponse<PaginatedResponse<PointTransaction>>>('/customer-packages/transactions', {
      params,
    })
    return data.data
  },

  purchase: async (payload: { customer_id: number; service_package_id: number; branch_id?: number; notes?: string }) => {
    const { data } = await api.post<ApiResponse<CustomerPackage>>('/customer-packages/purchase', payload)
    return data.data
  },

  consume: async (payload: {
    customer_id: number
    customer_package_id?: number
    service_id: number
    points?: number
    appointment_id?: number
    description?: string
  }) => {
    const { data } = await api.post<ApiResponse<CustomerPackage>>('/customer-packages/consume', payload)
    return data.data
  },

  allocate: async (payload: {
    customer_id: number
    customer_package_id: number
    points: number
    description?: string
  }) => {
    const { data } = await api.post<ApiResponse<CustomerPackage>>('/customer-packages/allocate', payload)
    return data.data
  },
}
