import api from '@/services/api'
import type { ApiResponse } from '@/types'

export interface ReportFilters {
  date_from?: string
  date_to?: string
  branch_id?: number
}

export interface ReportPeriod {
  from: string
  to: string
}

export interface SalesSummary {
  invoice_count: number
  total_revenue: number
  subtotal: number
  discount_amount: number
  vat_collected: number
  average_ticket: number
}

export interface ChartSeries {
  labels: string[]
  data: number[]
}

export interface PaymentMethodBreakdown {
  payment_method_id: number
  name: string
  total: number
  count: number
}

export interface BranchSalesBreakdown {
  branch_id: number
  name: string
  invoice_count: number
  revenue: number
}

export interface TopService {
  service_id: number
  name: string
  quantity: number
  revenue: number
}

export interface SalesReport {
  period: ReportPeriod
  summary: SalesSummary
  by_day: ChartSeries
  by_payment_method: PaymentMethodBreakdown[]
  by_branch: BranchSalesBreakdown[]
  top_services: TopService[]
}

export interface CustomersSummary {
  total_customers: number
  active_customers: number
  new_customers: number
  customers_with_purchases: number
}

export interface TopCustomer {
  customer_id: number
  name: string
  phone?: string | null
  visits: number
  spent: number
}

export interface CustomersReport {
  period: ReportPeriod
  summary: CustomersSummary
  new_by_day: ChartSeries
  top_customers: TopCustomer[]
}

export interface StaffSummary {
  active_staff: number
  appointments: number
  payroll_paid: number
}

export interface StaffRevenue {
  staff_id: number
  name: string
  sales_count: number
  revenue: number
}

export interface StaffAppointments {
  staff_id: number
  name: string
  appointments: number
}

export interface StaffReport {
  period: ReportPeriod
  summary: StaffSummary
  revenue_by_staff: StaffRevenue[]
  appointments_by_staff: StaffAppointments[]
}

export interface InventorySummary {
  product_count: number
  stock_value: number
  low_stock_count: number
  purchases_total: number
  consumption_units: number
}

export interface StockMovementBreakdown {
  type: string
  count: number
  quantity: number
}

export interface InventoryReport {
  period: ReportPeriod
  summary: InventorySummary
  movements_by_type: StockMovementBreakdown[]
}

export interface FinancialSummary {
  revenue: number
  expenses: number
  payroll: number
  inventory_purchases: number
  total_outflow: number
  net_profit: number
  profit_margin: number
}

export interface FinancialMonthly {
  labels: string[]
  revenue: number[]
  expenses: number[]
}

export interface FinancialReport {
  period: ReportPeriod
  summary: FinancialSummary
  monthly: FinancialMonthly
}

export interface VatSummary {
  output_vat: number
  output_taxable: number
  input_vat_expenses: number
  input_vat_purchases: number
  total_input_vat: number
  net_vat_payable: number
}

export interface VatMonthly {
  labels: string[]
  output: number[]
  input: number[]
}

export interface VatByRate {
  vat_rate: number
  taxable_amount: number
  vat_amount: number
}

export interface VatReport {
  period: ReportPeriod
  summary: VatSummary
  monthly: VatMonthly
  sales_by_rate: VatByRate[]
}

export interface ReportSummary {
  period: ReportPeriod
  sales: SalesSummary
  customers: CustomersSummary
  financial: FinancialSummary
  inventory: InventorySummary
  vat: VatSummary
}

function params(filters?: ReportFilters): Record<string, string | number> {
  const p: Record<string, string | number> = {}
  if (filters?.date_from) p.date_from = filters.date_from
  if (filters?.date_to) p.date_to = filters.date_to
  if (filters?.branch_id) p.branch_id = filters.branch_id
  return p
}

export const reportsService = {
  async summary(filters?: ReportFilters): Promise<ReportSummary> {
    const { data } = await api.get<ApiResponse<ReportSummary>>('/reports/summary', { params: params(filters) })
    return data.data
  },

  async sales(filters?: ReportFilters): Promise<SalesReport> {
    const { data } = await api.get<ApiResponse<SalesReport>>('/reports/sales', { params: params(filters) })
    return data.data
  },

  async customers(filters?: ReportFilters): Promise<CustomersReport> {
    const { data } = await api.get<ApiResponse<CustomersReport>>('/reports/customers', { params: params(filters) })
    return data.data
  },

  async staff(filters?: ReportFilters): Promise<StaffReport> {
    const { data } = await api.get<ApiResponse<StaffReport>>('/reports/staff', { params: params(filters) })
    return data.data
  },

  async inventory(filters?: ReportFilters): Promise<InventoryReport> {
    const { data } = await api.get<ApiResponse<InventoryReport>>('/reports/inventory', { params: params(filters) })
    return data.data
  },

  async financial(filters?: ReportFilters): Promise<FinancialReport> {
    const { data } = await api.get<ApiResponse<FinancialReport>>('/reports/financial', { params: params(filters) })
    return data.data
  },

  async vat(filters?: ReportFilters): Promise<VatReport> {
    const { data } = await api.get<ApiResponse<VatReport>>('/reports/vat', { params: params(filters) })
    return data.data
  },
}
