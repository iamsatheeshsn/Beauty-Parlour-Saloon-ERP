import api from './api'
import type { ApiResponse, AuthData, DashboardData, LoginPayload, User } from '@/types'

export const authService = {
  login: async (payload: LoginPayload) => {
    const { data } = await api.post<ApiResponse<AuthData>>('/auth/login', {
      ...payload,
      device_name: payload.device_name || 'web',
    })
    return data
  },

  logout: async () => {
    const { data } = await api.post<ApiResponse<null>>('/auth/logout')
    return data
  },

  me: async () => {
    const { data } = await api.get<ApiResponse<User>>('/auth/me')
    return data
  },
}

export const dashboardService = {
  getData: async () => {
    const { data } = await api.get<ApiResponse<DashboardData>>('/dashboard')
    return data
  },
}
