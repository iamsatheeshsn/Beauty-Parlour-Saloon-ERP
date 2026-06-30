import api from '@/services/api'
import type { ApiResponse, PaginatedResponse } from '@/types'
import type { AppUser, UserPayload } from './adminService'
import type { ListParams } from './masterService'

export type Gender = 'female' | 'male' | 'other' | 'prefer_not_to_say'
export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'freelance'
export type DocumentType = 'passport' | 'emirates_id' | 'visa' | 'labour_card' | 'contract' | 'certificate' | 'other'
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'half_day' | 'on_leave'
export type LeaveType = 'annual' | 'sick' | 'unpaid' | 'emergency' | 'maternity' | 'other'
export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled'
export type CommissionRateType = 'percentage' | 'fixed'

export interface StaffMember extends AppUser {
  avatar?: string | null
  date_of_birth?: string | null
  gender?: Gender | null
  nationality?: string | null
  joining_date?: string | null
  employment_type?: EmploymentType | null
  emirates_id?: string | null
  visa_number?: string | null
  visa_expiry?: string | null
  address?: string | null
  emergency_contact_name?: string | null
  emergency_contact_phone?: string | null
  staff_notes?: string | null
}

export interface StaffPayload extends UserPayload {
  date_of_birth?: string | null
  gender?: Gender | null
  nationality?: string | null
  joining_date?: string | null
  employment_type?: EmploymentType | null
  emirates_id?: string | null
  visa_number?: string | null
  visa_expiry?: string | null
  address?: string | null
  emergency_contact_name?: string | null
  emergency_contact_phone?: string | null
  staff_notes?: string | null
}

export interface StaffDocument {
  id: number
  user_id: number
  document_type: DocumentType
  title: string
  file_url?: string | null
  document_number?: string | null
  issue_date?: string | null
  expiry_date?: string | null
  notes?: string | null
}

export interface StaffSalary {
  id: number
  user_id: number
  base_salary: number
  housing_allowance: number
  transport_allowance: number
  other_allowance: number
  total_salary: number
  currency: string
  effective_from: string
  effective_to?: string | null
  notes?: string | null
}

export interface StaffAttendance {
  id: number
  user_id: number
  attendance_date: string
  check_in?: string | null
  check_out?: string | null
  status: AttendanceStatus
  notes?: string | null
  branch?: { id: number; name: string }
}

export interface StaffLeave {
  id: number
  user_id: number
  leave_type: LeaveType
  start_date: string
  end_date: string
  days: number
  status: LeaveStatus
  reason?: string | null
  admin_notes?: string | null
  approver?: { id: number; name: string }
  approved_at?: string | null
}

export interface StaffCommission {
  id: number
  user_id: number
  service_category_id?: number | null
  name: string
  rate_type: CommissionRateType
  rate_value: number
  min_sale_amount?: number | null
  is_active: boolean
  notes?: string | null
  service_category?: { id: number; name: string }
}

export interface StaffCompanyDashboard {
  active_staff: number
  pending_leave: number
  expiring_documents: number
  attendance_today: number
}

export interface StaffMemberDashboard {
  staff: StaffMember
  attendance_summary: Record<string, number>
  current_salary: StaffSalary | null
  commission_rules_count: number
  pending_leave: number
  approved_leave_days: number
  recent_attendance: StaffAttendance[]
  expiring_documents: number
}

export const EMPLOYMENT_OPTIONS = [
  { value: 'full_time', label: 'Full Time' },
  { value: 'part_time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'freelance', label: 'Freelance' },
]

export const DOCUMENT_TYPE_OPTIONS = [
  { value: 'passport', label: 'Passport' },
  { value: 'emirates_id', label: 'Emirates ID' },
  { value: 'visa', label: 'Visa' },
  { value: 'labour_card', label: 'Labour Card' },
  { value: 'contract', label: 'Employment Contract' },
  { value: 'certificate', label: 'Certificate' },
  { value: 'other', label: 'Other' },
]

export const ATTENDANCE_STATUS_OPTIONS = [
  { value: 'present', label: 'Present' },
  { value: 'absent', label: 'Absent' },
  { value: 'late', label: 'Late' },
  { value: 'half_day', label: 'Half Day' },
  { value: 'on_leave', label: 'On Leave' },
]

export const LEAVE_TYPE_OPTIONS = [
  { value: 'annual', label: 'Annual Leave' },
  { value: 'sick', label: 'Sick Leave' },
  { value: 'unpaid', label: 'Unpaid Leave' },
  { value: 'emergency', label: 'Emergency Leave' },
  { value: 'maternity', label: 'Maternity Leave' },
  { value: 'other', label: 'Other' },
]

export const LEAVE_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'cancelled', label: 'Cancelled' },
]

export const COMMISSION_RATE_OPTIONS = [
  { value: 'percentage', label: 'Percentage (%)' },
  { value: 'fixed', label: 'Fixed Amount' },
]

export const staffService = {
  dashboard: async () => {
    const { data } = await api.get<ApiResponse<StaffCompanyDashboard>>('/staff/dashboard')
    return data.data
  },

  list: async (params?: ListParams & { branch_id?: number; role?: string }) => {
    const { data } = await api.get<ApiResponse<PaginatedResponse<StaffMember>>>('/staff', { params })
    return data.data
  },

  get: async (id: number) => {
    const { data } = await api.get<ApiResponse<StaffMember>>(`/staff/${id}`)
    return data.data
  },

  memberDashboard: async (id: number) => {
    const { data } = await api.get<ApiResponse<StaffMemberDashboard>>(`/staff/${id}/dashboard`)
    return data.data
  },

  create: async (payload: StaffPayload) => {
    const { data } = await api.post<ApiResponse<StaffMember>>('/staff', payload)
    return data.data
  },

  update: async (id: number, payload: Partial<StaffPayload>) => {
    const { data } = await api.put<ApiResponse<StaffMember>>(`/staff/${id}`, payload)
    return data.data
  },

  remove: async (id: number) => {
    await api.delete(`/staff/${id}`)
  },

  uploadAvatar: async (id: number, file: File) => {
    const form = new FormData()
    form.append('avatar', file)
    const { data } = await api.post<ApiResponse<StaffMember>>(`/staff/${id}/avatar`, form)
    return data.data
  },

  deleteAvatar: async (id: number) => {
    const { data } = await api.delete<ApiResponse<StaffMember>>(`/staff/${id}/avatar`)
    return data.data
  },

  listDocuments: async (userId: number) => {
    const { data } = await api.get<ApiResponse<StaffDocument[]>>(`/staff/${userId}/documents`)
    return data.data
  },

  createDocument: async (userId: number, form: FormData) => {
    const { data } = await api.post<ApiResponse<StaffDocument>>(`/staff/${userId}/documents`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.data
  },

  deleteDocument: async (id: number) => {
    await api.delete(`/staff-documents/${id}`)
  },

  listSalaries: async (userId: number) => {
    const { data } = await api.get<ApiResponse<StaffSalary[]>>(`/staff/${userId}/salaries`)
    return data.data
  },

  currentSalary: async (userId: number) => {
    const { data } = await api.get<ApiResponse<StaffSalary | null>>(`/staff/${userId}/salaries/current`)
    return data.data
  },

  createSalary: async (userId: number, payload: Partial<StaffSalary>) => {
    const { data } = await api.post<ApiResponse<StaffSalary>>(`/staff/${userId}/salaries`, payload)
    return data.data
  },

  deleteSalary: async (id: number) => {
    await api.delete(`/staff-salaries/${id}`)
  },

  listAttendance: async (userId: number, params?: { all?: boolean; month?: string }) => {
    const { data } = await api.get<ApiResponse<StaffAttendance[] | PaginatedResponse<StaffAttendance>>>(
      `/staff/${userId}/attendance`,
      { params: { all: true, ...params } }
    )
    return data.data
  },

  createAttendance: async (userId: number, payload: Partial<StaffAttendance>) => {
    const { data } = await api.post<ApiResponse<StaffAttendance>>(`/staff/${userId}/attendance`, payload)
    return data.data
  },

  deleteAttendance: async (id: number) => {
    await api.delete(`/staff-attendance/${id}`)
  },

  listLeave: async (userId: number) => {
    const { data } = await api.get<ApiResponse<StaffLeave[]>>(`/staff/${userId}/leave`, { params: { all: true } })
    return data.data
  },

  createLeave: async (userId: number, payload: Partial<StaffLeave>) => {
    const { data } = await api.post<ApiResponse<StaffLeave>>(`/staff/${userId}/leave`, payload)
    return data.data
  },

  updateLeave: async (id: number, payload: Partial<StaffLeave>) => {
    const { data } = await api.put<ApiResponse<StaffLeave>>(`/staff-leave/${id}`, payload)
    return data.data
  },

  deleteLeave: async (id: number) => {
    await api.delete(`/staff-leave/${id}`)
  },

  listCommission: async (userId: number) => {
    const { data } = await api.get<ApiResponse<StaffCommission[]>>(`/staff/${userId}/commission`)
    return data.data
  },

  createCommission: async (userId: number, payload: Partial<StaffCommission>) => {
    const { data } = await api.post<ApiResponse<StaffCommission>>(`/staff/${userId}/commission`, payload)
    return data.data
  },

  deleteCommission: async (id: number) => {
    await api.delete(`/staff-commission/${id}`)
  },
}
