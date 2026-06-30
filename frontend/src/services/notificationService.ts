import api from '@/services/api'
import type { ApiResponse } from '@/types'
import type { ActivityLog } from '@/types'

export interface NotificationAlert {
  type: string
  title: string
  message: string
  href: string
}

export interface NotificationPayload {
  items: ActivityLog[]
  count: number
  alerts: NotificationAlert[]
}

export const notificationService = {
  list: async (): Promise<NotificationPayload> => {
    const { data } = await api.get<ApiResponse<NotificationPayload>>('/notifications')
    return data.data
  },
}
