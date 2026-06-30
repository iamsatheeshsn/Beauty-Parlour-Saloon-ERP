import api from '@/services/api'
import type { ApiResponse, PaginatedResponse } from '@/types'
import type { ListParams } from './masterService'

export interface ExpenseItem {
  id: number
  company_id?: number
  branch_id?: number | null
  expense_category_id: number
  payment_method_id?: number | null
  code: string
  vendor_name?: string | null
  reference?: string | null
  description?: string | null
  amount: number
  vat_rate: number
  vat_amount: number
  total_amount: number
  vat_inclusive: boolean
  expense_date: string
  receipt_url?: string | null
  receipt_original_name?: string | null
  has_receipt: boolean
  notes?: string | null
  category?: { id: number; name: string; code?: string }
  branch?: { id: number; name: string; code?: string }
  payment_method?: { id: number; name: string; code?: string }
  created_by?: { id: number; name: string }
  created_at?: string
}

export interface ExpensePayload {
  expense_category_id: number
  branch_id?: number | null
  payment_method_id?: number | null
  vendor_name?: string | null
  reference?: string | null
  description?: string | null
  amount: number
  vat_rate?: number
  vat_inclusive?: boolean
  expense_date: string
  notes?: string | null
}

export interface ExpenseStats {
  today_total: number
  month_total: number
  year_total: number
  month_count: number
}

export interface ExpenseCategoryReport {
  category_id: number
  category_name?: string
  category_code?: string
  total: number
  count: number
}

export interface ExpenseReport {
  date_from: string
  date_to: string
  total: number
  count: number
  by_category: ExpenseCategoryReport[]
  monthly: { labels: string[]; data: number[] }
}

function appendPayload(form: FormData, payload: ExpensePayload): void {
  form.append('expense_category_id', String(payload.expense_category_id))
  form.append('amount', String(payload.amount))
  form.append('expense_date', payload.expense_date)
  if (payload.branch_id) form.append('branch_id', String(payload.branch_id))
  if (payload.payment_method_id) form.append('payment_method_id', String(payload.payment_method_id))
  if (payload.vendor_name) form.append('vendor_name', payload.vendor_name)
  if (payload.reference) form.append('reference', payload.reference)
  if (payload.description) form.append('description', payload.description)
  if (payload.vat_rate != null) form.append('vat_rate', String(payload.vat_rate))
  if (payload.vat_inclusive != null) form.append('vat_inclusive', payload.vat_inclusive ? '1' : '0')
  if (payload.notes) form.append('notes', payload.notes)
}

export const expenseService = {
  list: async (params?: ListParams & {
    expense_category_id?: number
    branch_id?: number
    payment_method_id?: number
    date_from?: string
    date_to?: string
  }) => {
    const { data } = await api.get<ApiResponse<PaginatedResponse<ExpenseItem> | ExpenseItem[]>>('/expenses', { params })
    return data.data
  },

  get: async (id: number) => {
    const { data } = await api.get<ApiResponse<ExpenseItem>>(`/expenses/${id}`)
    return data.data
  },

  stats: async (branchId?: number) => {
    const { data } = await api.get<ApiResponse<ExpenseStats>>('/expenses/stats', {
      params: branchId ? { branch_id: branchId } : undefined,
    })
    return data.data
  },

  report: async (params?: { date_from?: string; date_to?: string; branch_id?: number }) => {
    const { data } = await api.get<ApiResponse<ExpenseReport>>('/expenses/report', { params })
    return data.data
  },

  create: async (payload: ExpensePayload, receipt?: File) => {
    if (receipt) {
      const form = new FormData()
      appendPayload(form, payload)
      form.append('receipt', receipt)
      const { data } = await api.post<ApiResponse<ExpenseItem>>('/expenses', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return data.data
    }
    const { data } = await api.post<ApiResponse<ExpenseItem>>('/expenses', payload)
    return data.data
  },

  update: async (id: number, payload: Partial<ExpensePayload>, receipt?: File) => {
    if (receipt) {
      const form = new FormData()
      form.append('_method', 'PUT')
      Object.entries(payload).forEach(([key, value]) => {
        if (value != null && value !== '') {
          form.append(key, typeof value === 'boolean' ? (value ? '1' : '0') : String(value))
        }
      })
      form.append('receipt', receipt)
      const { data } = await api.post<ApiResponse<ExpenseItem>>(`/expenses/${id}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return data.data
    }
    const { data } = await api.put<ApiResponse<ExpenseItem>>(`/expenses/${id}`, payload)
    return data.data
  },

  remove: async (id: number) => {
    await api.delete(`/expenses/${id}`)
  },

  uploadReceipt: async (id: number, receipt: File) => {
    const form = new FormData()
    form.append('receipt', receipt)
    const { data } = await api.post<ApiResponse<ExpenseItem>>(`/expenses/${id}/receipt`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.data
  },

  deleteReceipt: async (id: number) => {
    const { data } = await api.delete<ApiResponse<ExpenseItem>>(`/expenses/${id}/receipt`)
    return data.data
  },
}
