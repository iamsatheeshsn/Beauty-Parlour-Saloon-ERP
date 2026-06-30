import { Navigate } from 'react-router-dom'
import { masterNavItems } from '@/config/masterConfigs'
import { usePermission } from '@/hooks/usePermission'

export default function MastersIndexPage() {
  const { hasPermission } = usePermission()
  const first = masterNavItems.find((item) => hasPermission(item.permission))

  return <Navigate to={first?.to ?? '/dashboard'} replace />
}
