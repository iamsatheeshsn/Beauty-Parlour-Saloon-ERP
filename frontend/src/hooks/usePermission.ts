import { useMemo } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { normalizePermissions } from '@/utils/permissions'

export function usePermission() {
  const { user, isLoading } = useAuth()

  const permissions = useMemo(
    () => normalizePermissions(user?.permissions),
    [user?.permissions],
  )

  const permissionsReady = !isLoading && user != null && user.permissions !== undefined

  const hasPermission = (permission: string) => permissions.includes(permission)

  const hasAnyPermission = (perms: string[]) => perms.some((p) => permissions.includes(p))

  const hasAllPermissions = (perms: string[]) => perms.every((p) => permissions.includes(p))

  return { permissions, permissionsReady, hasPermission, hasAnyPermission, hasAllPermissions }
}
