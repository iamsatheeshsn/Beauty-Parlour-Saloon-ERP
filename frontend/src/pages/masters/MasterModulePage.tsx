import { Navigate, useParams } from 'react-router-dom'
import { MasterDataPage } from '@/components/masters/MasterDataPage'
import { masterModuleMap } from '@/config/masterConfigs'
import { usePermission } from '@/hooks/usePermission'
import { canViewMaster } from '@/utils/masterPermissions'
import MastersIndexPage from '@/pages/masters/MastersIndexPage'

export default function MasterModulePage() {
  const { module } = useParams<{ module: string }>()
  const { hasPermission } = usePermission()
  const config = module ? masterModuleMap[module] : undefined

  if (!config) {
    return <MastersIndexPage />
  }

  if (!canViewMaster(config.permissions, hasPermission)) {
    return <Navigate to="/masters" replace />
  }

  return <MasterDataPage config={config} />
}
