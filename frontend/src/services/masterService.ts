import api from '@/services/api'
import type { ApiResponse, PaginatedResponse } from '@/types'

export interface ListParams {
  page?: number
  per_page?: number
  search?: string
  all?: boolean
  country_id?: number | string
  emirate_id?: number | string
  department_id?: number | string
  parent_id?: number | string
  group?: string
}

export function createMasterService<T, CreatePayload = Partial<T>, UpdatePayload = Partial<T>>(
  endpoint: string
) {
  return {
    list: async (params?: ListParams) => {
      const { data } = await api.get<ApiResponse<PaginatedResponse<T> | T[]>>(endpoint, { params })
      return data.data
    },

    get: async (id: number) => {
      const { data } = await api.get<ApiResponse<T>>(`${endpoint}/${id}`)
      return data.data
    },

    create: async (payload: CreatePayload) => {
      const { data } = await api.post<ApiResponse<T>>(endpoint, payload)
      return data.data
    },

    update: async (id: number, payload: UpdatePayload) => {
      const { data } = await api.put<ApiResponse<T>>(`${endpoint}/${id}`, payload)
      return data.data
    },

    remove: async (id: number) => {
      await api.delete(`${endpoint}/${id}`)
    },
  }
}

export const countryService = createMasterService('/countries')
export const emirateService = createMasterService('/emirates')
export const cityService = createMasterService('/cities')
export const branchService = createMasterService('/branches')
export const departmentService = createMasterService('/departments')
export const staffDesignationService = createMasterService('/staff-designations')
export const expenseCategoryService = createMasterService('/expense-categories')
export const paymentMethodService = createMasterService('/payment-methods')
export const serviceCategoryService = createMasterService('/service-categories')
export const productCategoryService = createMasterService('/product-categories')
export const brandService = createMasterService('/brands')
export const supplierService = createMasterService('/suppliers')
export const settingService = createMasterService('/settings')

export const companyService = {
  get: async () => {
    const { data } = await api.get<ApiResponse<Company>>('/company')
    return data.data
  },
  update: async (payload: Partial<Company>) => {
    const { data } = await api.put<ApiResponse<Company>>('/company', payload)
    return data.data
  },
}

export const enumService = {
  paymentMethodTypes: async () => {
    const { data } = await api.get<ApiResponse<EnumOption[]>>('/enums/payment-method-types')
    return data.data
  },
  settingTypes: async () => {
    const { data } = await api.get<ApiResponse<EnumOption[]>>('/enums/setting-types')
    return data.data
  },
}

export interface EnumOption {
  value: string
  label: string
}

export interface MasterRecord {
  id: number
  name?: string
  code?: string
  is_active?: boolean
  created_at?: string
  [key: string]: unknown
}

export interface Company {
  id: number
  code: string
  name: string
  trade_name?: string
  email?: string
  phone?: string
  website?: string
  address?: string
  postal_code?: string
  country_id?: number
  emirate_id?: number
  city_id?: number
  trn_number?: string
  timezone?: string
  currency?: string
  vat_rate?: number
  is_active?: boolean
}
