export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data: T
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export interface User {
  id: number
  name: string
  email: string
  phone?: string
  avatar?: string
  is_active: boolean
  last_login_at?: string
  roles?: string[]
  permissions?: string[]
}

export interface AuthData {
  user: User
  token: string
  token_type: string
}

export interface LoginPayload {
  email: string
  password: string
  device_name?: string
}

export interface DashboardStats {
  total_appointments: number
  today_appointments: number
  pending_appointments?: number
  total_customers: number
  total_revenue: number
  today_revenue?: number
  pending_payments: number
  active_staff: number
  low_stock_count?: number
}

export interface DashboardAppointment {
  id: number
  code: string
  scheduled_at: string
  status: string
  customer?: { id: number; name: string }
  staff?: { id: number; name: string }
  total_amount?: number
}

export interface DashboardData {
  company: {
    id: number
    name: string
    trade_name?: string
    currency: string
    vat_rate: number
  } | null
  stats: DashboardStats
  recent_activity: ActivityLog[]
  upcoming_appointments?: DashboardAppointment[]
  charts: {
    revenue: ChartData
    appointments: ChartData
    services: ChartData
  }
}

export interface ChartData {
  labels: string[]
  data: number[]
}

export interface ActivityLog {
  id: number
  action: string
  action_label: string
  description?: string
  created_at: string
  user?: User
}
