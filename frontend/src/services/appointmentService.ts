import api from '@/services/api'
import type { ApiResponse, PaginatedResponse } from '@/types'
import type { Customer, CustomerPayload } from './customerService'
import type { ListParams } from './masterService'

export type AppointmentType = 'walk_in' | 'scheduled'
export type AppointmentStatus =
  | 'scheduled'
  | 'confirmed'
  | 'checked_in'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show'

export interface AppointmentItem {
  id: number
  salon_service_id?: number | null
  staff_id?: number | null
  service_name: string
  duration_minutes: number
  price: number
  sort_order?: number
  service?: { id: number; name: string; code?: string }
  staff?: { id: number; name: string }
}

export interface Appointment {
  id: number
  company_id?: number
  branch_id?: number | null
  customer_id: number
  staff_id?: number | null
  code: string
  type: AppointmentType
  status: AppointmentStatus
  scheduled_at: string
  ends_at?: string | null
  duration_minutes: number
  total_amount: number
  notes?: string | null
  cancellation_reason?: string | null
  checked_in_at?: string | null
  completed_at?: string | null
  customer?: { id: number; name: string; phone?: string; code?: string }
  staff?: { id: number; name: string }
  branch?: { id: number; name: string }
  booked_by?: { id: number; name: string }
  items?: AppointmentItem[]
  created_at?: string
  updated_at?: string
}

export interface AppointmentItemPayload {
  service_id: number
  staff_id?: number | null
}

export interface AppointmentPayload {
  customer_id: number
  branch_id?: number | null
  staff_id?: number | null
  scheduled_at?: string
  notes?: string | null
  items: AppointmentItemPayload[]
  status?: AppointmentStatus
}

export interface CalendarParams {
  start: string
  end: string
  staff_id?: number
  status?: AppointmentStatus
  type?: AppointmentType
}

export const APPOINTMENT_STATUS_OPTIONS: { value: AppointmentStatus; label: string }[] = [
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'checked_in', label: 'Checked In' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'no_show', label: 'No Show' },
]

export const APPOINTMENT_TYPE_OPTIONS: { value: AppointmentType; label: string }[] = [
  { value: 'walk_in', label: 'Walk-in' },
  { value: 'scheduled', label: 'Scheduled' },
]

export function appointmentStatusLabel(status: AppointmentStatus): string {
  return APPOINTMENT_STATUS_OPTIONS.find((o) => o.value === status)?.label ?? status
}

export function appointmentStatusVariant(
  status: AppointmentStatus
): 'default' | 'success' | 'warning' | 'destructive' {
  switch (status) {
    case 'completed':
      return 'success'
    case 'in_progress':
    case 'checked_in':
      return 'warning'
    case 'cancelled':
    case 'no_show':
      return 'destructive'
    default:
      return 'default'
  }
}

export const appointmentService = {
  calendar: async (params: CalendarParams) => {
    const { data } = await api.get<ApiResponse<Appointment[]>>('/appointments/calendar', { params })
    return data.data
  },

  list: async (params?: ListParams & { status?: string; type?: string; staff_id?: number; date?: string }) => {
    const { data } = await api.get<ApiResponse<PaginatedResponse<Appointment>>>('/appointments', { params })
    return data.data
  },

  get: async (id: number) => {
    const { data } = await api.get<ApiResponse<Appointment>>(`/appointments/${id}`)
    return data.data
  },

  walkIn: async (payload: AppointmentPayload) => {
    const { data } = await api.post<ApiResponse<Appointment>>('/appointments/walk-in', payload)
    return data.data
  },

  book: async (payload: AppointmentPayload & { scheduled_at: string }) => {
    const { data } = await api.post<ApiResponse<Appointment>>('/appointments', payload)
    return data.data
  },

  update: async (id: number, payload: Partial<AppointmentPayload>) => {
    const { data } = await api.put<ApiResponse<Appointment>>(`/appointments/${id}`, payload)
    return data.data
  },

  updateStatus: async (id: number, status: AppointmentStatus, cancellation_reason?: string) => {
    const { data } = await api.patch<ApiResponse<Appointment>>(`/appointments/${id}/status`, {
      status,
      cancellation_reason,
    })
    return data.data
  },

  assignStaff: async (id: number, staff_id: number) => {
    const { data } = await api.patch<ApiResponse<Appointment>>(`/appointments/${id}/assign-staff`, { staff_id })
    return data.data
  },

  remove: async (id: number) => {
    await api.delete(`/appointments/${id}`)
  },
}

export type { Customer, CustomerPayload }
