import api from '@/services/api'
import type { ApiResponse, PaginatedResponse } from '@/types'
import type { ListParams } from './masterService'

export type PayslipStatus = 'draft' | 'approved' | 'paid'

export interface PayslipItem {
  id: number
  type: string
  description: string
  amount: number
  is_deduction: boolean
}

export interface Payslip {
  id: number
  user_id: number
  code: string
  period_start: string
  period_end: string
  base_salary: number
  housing_allowance: number
  transport_allowance: number
  other_allowance: number
  gross_salary: number
  commission_amount: number
  leave_days: number
  leave_deduction: number
  other_deductions: number
  other_additions: number
  net_pay: number
  currency: string
  status: PayslipStatus
  notes?: string | null
  approved_at?: string | null
  paid_at?: string | null
  user?: { id: number; name: string; employee_code?: string; email?: string }
  branch?: { id: number; name: string }
  items?: PayslipItem[]
  calculation_snapshot?: {
    commission?: { total: number; lines: { description: string; amount: number; sale_code?: string }[] }
    leave?: { days: number; amount: number; daily_rate: number; leaves: unknown[] }
  }
}

export interface PayrollPreview {
  user_id: number
  base_salary: number
  housing_allowance: number
  transport_allowance: number
  other_allowance: number
  gross_salary: number
  commission_amount: number
  leave_days: number
  leave_deduction: number
  currency: string
  net_pay: number
  items: PayslipItem[]
  snapshot?: Payslip['calculation_snapshot']
}

export interface StaffPayrollOverview {
  user_id: number
  name: string
  employee_code?: string
  branch?: { id: number; name: string }
  current_salary?: { base_salary: number; total_salary: number; currency: string }
  payslip?: { id: number; code: string; status: PayslipStatus; net_pay: number }
}

export interface PayrollStats {
  total: number
  draft: number
  approved: number
  paid: number
  total_net_pay: number
}

export interface PendingLeave {
  id: number
  user_id: number
  user_name?: string
  leave_type: string
  start_date: string
  end_date: string
  days: number
  reason?: string
}

export const PAYSLIP_STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'approved', label: 'Approved' },
  { value: 'paid', label: 'Paid' },
]

export function payslipStatusLabel(status: PayslipStatus): string {
  return PAYSLIP_STATUS_OPTIONS.find((o) => o.value === status)?.label ?? status
}

export function payslipStatusVariant(status: PayslipStatus): 'default' | 'success' | 'warning' {
  if (status === 'paid') return 'success'
  if (status === 'approved') return 'warning'
  return 'default'
}

export function monthPeriod(date = new Date()): { period_start: string; period_end: string } {
  const y = date.getFullYear()
  const m = date.getMonth()
  const start = new Date(y, m, 1)
  const end = new Date(y, m + 1, 0)
  return {
    period_start: start.toISOString().slice(0, 10),
    period_end: end.toISOString().slice(0, 10),
  }
}

export const payrollService = {
  stats: async (params?: { period_start?: string; period_end?: string }) => {
    const { data } = await api.get<ApiResponse<PayrollStats>>('/payroll/stats', { params })
    return data.data
  },

  staffOverview: async (period_start: string, period_end: string) => {
    const { data } = await api.get<ApiResponse<StaffPayrollOverview[]>>('/payroll/staff-overview', {
      params: { period_start, period_end },
    })
    return data.data
  },

  pendingLeave: async () => {
    const { data } = await api.get<ApiResponse<PendingLeave[]>>('/payroll/pending-leave')
    return data.data
  },

  preview: async (payload: { user_id: number; period_start: string; period_end: string }) => {
    const { data } = await api.post<ApiResponse<PayrollPreview>>('/payroll/preview', payload)
    return data.data
  },

  generate: async (payload: {
    user_id?: number
    period_start: string
    period_end: string
    notes?: string
    other_deductions?: number
    other_additions?: number
  }) => {
    const { data } = await api.post<ApiResponse<Payslip | { generated_count: number; payslips: Payslip[] }>>('/payroll/generate', payload)
    return data.data
  },

  listPayslips: async (params?: ListParams & { user_id?: number; status?: string; period_start?: string; period_end?: string }) => {
    const { data } = await api.get<ApiResponse<PaginatedResponse<Payslip> | Payslip[]>>('/payroll/payslips', { params })
    return data.data
  },

  getPayslip: async (id: number) => {
    const { data } = await api.get<ApiResponse<Payslip>>(`/payroll/payslips/${id}`)
    return data.data
  },

  approve: async (id: number) => {
    const { data } = await api.patch<ApiResponse<Payslip>>(`/payroll/payslips/${id}/approve`)
    return data.data
  },

  markPaid: async (id: number) => {
    const { data } = await api.patch<ApiResponse<Payslip>>(`/payroll/payslips/${id}/mark-paid`)
    return data.data
  },

  remove: async (id: number) => {
    await api.delete(`/payroll/payslips/${id}`)
  },
}
