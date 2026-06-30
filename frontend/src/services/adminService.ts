import api from '@/services/api'
import type { ApiResponse, PaginatedResponse } from '@/types'
import type { ListParams } from './masterService'

export interface AppUser {
  id: number
  company_id?: number
  branch_id?: number
  department_id?: number
  staff_designation_id?: number
  employee_code?: string
  name: string
  email: string
  phone?: string
  is_active: boolean
  role?: string
  roles?: string[]
  branch?: { id: number; name: string }
  department?: { id: number; name: string }
  staff_designation?: { id: number; name: string }
  last_login_at?: string
  created_at?: string
}

export interface UserPayload {
  name: string
  email: string
  password?: string
  phone?: string
  employee_code?: string
  branch_id?: number | null
  department_id?: number | null
  staff_designation_id?: number | null
  role: string
  is_active?: boolean
}

export const userService = {
  list: async (params?: ListParams) => {
    const { data } = await api.get<ApiResponse<PaginatedResponse<AppUser>>>('/users', { params })
    return data.data
  },
  get: async (id: number) => {
    const { data } = await api.get<ApiResponse<AppUser>>(`/users/${id}`)
    return data.data
  },
  create: async (payload: UserPayload) => {
    const { data } = await api.post<ApiResponse<AppUser>>('/users', payload)
    return data.data
  },
  update: async (id: number, payload: Partial<UserPayload>) => {
    const { data } = await api.put<ApiResponse<AppUser>>(`/users/${id}`, payload)
    return data.data
  },
  remove: async (id: number) => {
    await api.delete(`/users/${id}`)
  },
}

export interface AppRole {
  id: number
  name: string
  permissions?: string[]
}

export interface PermissionItem {
  id: number
  name: string
}

export const roleService = {
  list: async () => {
    const { data } = await api.get<ApiResponse<AppRole[]>>('/roles')
    return data.data
  },
  get: async (id: number) => {
    const { data } = await api.get<ApiResponse<AppRole>>(`/roles/${id}`)
    return data.data
  },
  create: async (payload: { name: string; permissions: string[] }) => {
    const { data } = await api.post<ApiResponse<AppRole>>('/roles', payload)
    return data.data
  },
  update: async (id: number, payload: { name?: string; permissions: string[] }) => {
    const { data } = await api.put<ApiResponse<AppRole>>(`/roles/${id}`, payload)
    return data.data
  },
  remove: async (id: number) => {
    await api.delete(`/roles/${id}`)
  },
  permissions: async () => {
    const { data } = await api.get<ApiResponse<PermissionItem[]>>('/permissions')
    return data.data
  },
}

export const activityLogService = {
  list: async (params?: ListParams & { user_id?: number }) => {
    const { data } = await api.get<ApiResponse<PaginatedResponse<ActivityLogItem>>>('/activity-logs', { params })
    return data.data
  },
}

export interface ActivityLogItem {
  id: number
  action: string
  action_label: string
  description?: string
  created_at: string
  user?: { id: number; name: string; email: string }
}
