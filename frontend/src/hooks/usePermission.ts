import { useAuth } from '@/contexts/AuthContext'

export function usePermission() {
  const { user } = useAuth()

  const permissions = user?.permissions ?? []

  const hasPermission = (permission: string) => permissions.includes(permission)

  const hasAnyPermission = (perms: string[]) => perms.some((p) => permissions.includes(p))

  const hasAllPermissions = (perms: string[]) => perms.every((p) => permissions.includes(p))

  return { permissions, hasPermission, hasAnyPermission, hasAllPermissions }
}
