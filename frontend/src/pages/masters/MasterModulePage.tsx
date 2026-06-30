import { Navigate, useParams } from 'react-router-dom'
import { MasterDataPage } from '@/components/masters/MasterDataPage'
import {
  branchConfig,
  cityConfig,
  countryConfig,
  departmentConfig,
  emirateConfig,
  expenseCategoryConfig,
  paymentMethodConfig,
  productCategoryConfig,
  brandConfig,
  supplierConfig,
  serviceCategoryConfig,
  staffDesignationConfig,
} from '@/config/masterConfigs'
import type { MasterModuleConfig } from '@/config/masterModules'

const moduleMap: Record<string, MasterModuleConfig> = {
  countries: countryConfig,
  emirates: emirateConfig,
  cities: cityConfig,
  branches: branchConfig,
  departments: departmentConfig,
  'staff-designations': staffDesignationConfig,
  'expense-categories': expenseCategoryConfig,
  'payment-methods': paymentMethodConfig,
  'service-categories': serviceCategoryConfig,
  'product-categories': productCategoryConfig,
  brands: brandConfig,
  suppliers: supplierConfig,
}

export default function MasterModulePage() {
  const { module } = useParams<{ module: string }>()
  const config = module ? moduleMap[module] : undefined

  if (!config) {
    return <Navigate to="/masters/branches" replace />
  }

  return <MasterDataPage config={config} />
}
