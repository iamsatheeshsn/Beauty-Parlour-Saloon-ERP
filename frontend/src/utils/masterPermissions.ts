import type { MasterModulePermissions } from '@/config/masterModules'

export function canViewMaster(
  permissions: MasterModulePermissions,
  hasPermission: (p: string) => boolean,
): boolean {
  return hasPermission(permissions.view)
}

export function canCreateMaster(
  permissions: MasterModulePermissions,
  hasPermission: (p: string) => boolean,
): boolean {
  if (permissions.create) return hasPermission(permissions.create)
  if (permissions.manage) return hasPermission(permissions.manage)
  return false
}

export function canUpdateMaster(
  permissions: MasterModulePermissions,
  hasPermission: (p: string) => boolean,
): boolean {
  if (permissions.update) return hasPermission(permissions.update)
  if (permissions.manage) return hasPermission(permissions.manage)
  return false
}

export function canDeleteMaster(
  permissions: MasterModulePermissions,
  hasPermission: (p: string) => boolean,
): boolean {
  if (permissions.delete) return hasPermission(permissions.delete)
  if (permissions.manage) return hasPermission(permissions.manage)
  return false
}
