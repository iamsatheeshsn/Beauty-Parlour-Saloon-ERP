import { companyMasterEntry } from '@/config/masterConfigs'
import { usePermission } from '@/hooks/usePermission'

export function useCompanyMasterAccess() {
  const { hasPermission } = usePermission()

  return {
    canView: hasPermission(companyMasterEntry.permissions.view),
    canManage: hasPermission(companyMasterEntry.permissions.manage!),
  }
}
