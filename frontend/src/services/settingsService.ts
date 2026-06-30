import api from '@/services/api'
import type { ApiResponse } from '@/types'

export interface SettingRecord {
  id: number
  group: string
  key: string
  value: string
  value_url?: string | null
  casted_value?: unknown
  type?: string
  description?: string | null
}

export const settingsService = {
  uploadLogo: async (file: File): Promise<SettingRecord> => {
    const form = new FormData()
    form.append('logo', file)
    const { data } = await api.post<ApiResponse<SettingRecord>>('/settings/app-logo', form)
    return data.data
  },

  deleteLogo: async (): Promise<SettingRecord> => {
    const { data } = await api.delete<ApiResponse<SettingRecord>>('/settings/app-logo')
    return data.data
  },

  uploadFavicon: async (file: File): Promise<SettingRecord> => {
    const form = new FormData()
    form.append('favicon', file)
    const { data } = await api.post<ApiResponse<SettingRecord>>('/settings/app-favicon', form)
    return data.data
  },

  deleteFavicon: async (): Promise<SettingRecord> => {
    const { data } = await api.delete<ApiResponse<SettingRecord>>('/settings/app-favicon')
    return data.data
  },

  uploadSalonInteriorImage: async (file: File): Promise<SettingRecord> => {
    const form = new FormData()
    form.append('image', file)
    const { data } = await api.post<ApiResponse<SettingRecord>>('/settings/salon-interior-image', form)
    return data.data
  },

  deleteSalonInteriorImage: async (): Promise<SettingRecord> => {
    const { data } = await api.delete<ApiResponse<SettingRecord>>('/settings/salon-interior-image')
    return data.data
  },

  uploadPageBanner: async (key: string, file: File): Promise<SettingRecord> => {
    const form = new FormData()
    form.append('image', file)
    const { data } = await api.post<ApiResponse<SettingRecord>>(`/settings/page-banner/${key}`, form)
    return data.data
  },

  deletePageBanner: async (key: string): Promise<SettingRecord> => {
    const { data } = await api.delete<ApiResponse<SettingRecord>>(`/settings/page-banner/${key}`)
    return data.data
  },
}
