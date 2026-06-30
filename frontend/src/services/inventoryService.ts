import api from '@/services/api'
import type { ApiResponse, PaginatedResponse } from '@/types'
import type { ListParams } from './masterService'

export type StockPurchaseStatus = 'draft' | 'ordered' | 'partial' | 'received' | 'cancelled'
export type StockMovementType = 'purchase' | 'sale' | 'consumption' | 'adjustment' | 'transfer_in' | 'transfer_out' | 'wastage'

export interface ProductItem {
  id: number
  company_id?: number
  product_category_id?: number | null
  brand_id?: number | null
  default_supplier_id?: number | null
  code: string
  barcode?: string | null
  name: string
  description?: string | null
  image?: string | null
  image_url?: string | null
  unit: string
  cost_price: number
  retail_price: number
  vat_rate: number
  vat_inclusive: boolean
  track_inventory: boolean
  is_sellable: boolean
  is_consumable: boolean
  reorder_level: number
  reorder_quantity?: number | null
  is_active: boolean
  sort_order?: number
  category?: { id: number; name: string; code?: string }
  brand?: { id: number; name: string; code?: string }
  default_supplier?: { id: number; name: string; code?: string }
}

export interface ProductPayload {
  product_category_id?: number | null
  brand_id?: number | null
  default_supplier_id?: number | null
  barcode?: string | null
  name: string
  description?: string | null
  unit?: string
  cost_price: number
  retail_price?: number
  vat_rate?: number
  vat_inclusive?: boolean
  track_inventory?: boolean
  is_sellable?: boolean
  is_consumable?: boolean
  reorder_level?: number
  reorder_quantity?: number | null
  is_active?: boolean
  sort_order?: number
}

export interface StockPurchaseItem {
  id: number
  product_id: number
  quantity_ordered: number
  quantity_received: number
  unit_cost: number
  vat_rate: number
  line_total: number
  remaining: number
  product?: ProductItem
}

export interface StockPurchase {
  id: number
  code: string
  status: StockPurchaseStatus
  reference?: string | null
  subtotal: number
  vat_amount: number
  total_amount: number
  notes?: string | null
  ordered_at?: string
  received_at?: string | null
  supplier?: { id: number; name: string; code?: string }
  branch?: { id: number; name: string; code?: string }
  items?: StockPurchaseItem[]
}

export interface StockMovement {
  id: number
  type: StockMovementType
  quantity: number
  balance_after: number
  unit_cost?: number
  reference?: string | null
  description?: string | null
  created_at?: string
  product?: ProductItem
  branch?: { id: number; name: string }
  created_by?: { id: number; name: string }
  purchase?: { id: number; code: string }
}

export interface BranchStockLevel {
  id: number
  branch_id: number
  product_id: number
  quantity_on_hand: number
  reorder_level: number
  is_low_stock: boolean
  product?: ProductItem
  branch?: { id: number; name: string }
}

export interface InventoryStats {
  total_products: number
  low_stock_count: number
  pending_purchases: number
}

export interface ProductStats {
  total: number
  inactive: number
}

export interface PurchasePayload {
  supplier_id: number
  branch_id?: number
  reference?: string
  notes?: string
  items: {
    product_id: number
    quantity_ordered: number
    unit_cost: number
    vat_rate?: number
  }[]
}

export interface ReceivePayload {
  items: { item_id: number; quantity_received: number }[]
}

export interface ConsumePayload {
  product_id: number
  quantity: number
  branch_id?: number
  description?: string
}

export const STOCK_PURCHASE_STATUS_OPTIONS = [
  { value: 'ordered', label: 'Ordered' },
  { value: 'partial', label: 'Partially Received' },
  { value: 'received', label: 'Received' },
  { value: 'cancelled', label: 'Cancelled' },
]

export const STOCK_MOVEMENT_TYPE_OPTIONS = [
  { value: 'purchase', label: 'Purchase' },
  { value: 'consumption', label: 'Consumption' },
  { value: 'adjustment', label: 'Adjustment' },
  { value: 'sale', label: 'Sale' },
  { value: 'wastage', label: 'Wastage' },
]

export function purchaseStatusLabel(status: StockPurchaseStatus): string {
  const map: Record<StockPurchaseStatus, string> = {
    draft: 'Draft',
    ordered: 'Ordered',
    partial: 'Partially Received',
    received: 'Received',
    cancelled: 'Cancelled',
  }
  return map[status] ?? status
}

export function purchaseStatusVariant(status: StockPurchaseStatus): 'default' | 'success' | 'warning' | 'destructive' {
  if (status === 'received') return 'success'
  if (status === 'partial') return 'warning'
  if (status === 'cancelled') return 'destructive'
  return 'default'
}

export function movementTypeLabel(type: StockMovementType): string {
  return STOCK_MOVEMENT_TYPE_OPTIONS.find((o) => o.value === type)?.label ?? type
}

export const inventoryService = {
  stats: async () => {
    const { data } = await api.get<ApiResponse<InventoryStats>>('/inventory/stats')
    return data.data
  },

  lowStock: async (branchId?: number) => {
    const { data } = await api.get<ApiResponse<BranchStockLevel[]>>('/inventory/low-stock', {
      params: branchId ? { branch_id: branchId } : undefined,
    })
    return data.data
  },

  stockLevels: async (branchId?: number) => {
    const { data } = await api.get<ApiResponse<BranchStockLevel[]>>('/inventory/stock-levels', {
      params: branchId ? { branch_id: branchId } : undefined,
    })
    return data.data
  },

  products: {
    list: async (params?: ListParams & { product_category_id?: number; brand_id?: number; is_active?: boolean }) => {
      const { data } = await api.get<ApiResponse<PaginatedResponse<ProductItem> | ProductItem[]>>('/products', { params })
      return data.data
    },
    stats: async () => {
      const { data } = await api.get<ApiResponse<ProductStats>>('/products/stats')
      return data.data
    },
    create: async (payload: ProductPayload) => {
      const { data } = await api.post<ApiResponse<ProductItem>>('/products', payload)
      return data.data
    },
    update: async (id: number, payload: Partial<ProductPayload>) => {
      const { data } = await api.put<ApiResponse<ProductItem>>(`/products/${id}`, payload)
      return data.data
    },
    remove: async (id: number) => {
      await api.delete(`/products/${id}`)
    },
    uploadImage: async (id: number, file: File) => {
      const form = new FormData()
      form.append('image', file)
      const { data } = await api.post<ApiResponse<ProductItem>>(`/products/${id}/image`, form)
      return data.data
    },
    deleteImage: async (id: number) => {
      const { data } = await api.delete<ApiResponse<ProductItem>>(`/products/${id}/image`)
      return data.data
    },
  },

  purchases: {
    list: async (params?: ListParams & { status?: string; supplier_id?: number }) => {
      const { data } = await api.get<ApiResponse<PaginatedResponse<StockPurchase> | StockPurchase[]>>('/stock-purchases', { params })
      return data.data
    },
    get: async (id: number) => {
      const { data } = await api.get<ApiResponse<StockPurchase>>(`/stock-purchases/${id}`)
      return data.data
    },
    create: async (payload: PurchasePayload) => {
      const { data } = await api.post<ApiResponse<StockPurchase>>('/stock-purchases', payload)
      return data.data
    },
    receive: async (id: number, payload: ReceivePayload) => {
      const { data } = await api.post<ApiResponse<StockPurchase>>(`/stock-purchases/${id}/receive`, payload)
      return data.data
    },
  },

  movements: {
    list: async (params?: ListParams & { branch_id?: number; product_id?: number; type?: string }) => {
      const { data } = await api.get<ApiResponse<PaginatedResponse<StockMovement> | StockMovement[]>>('/stock-movements', { params })
      return data.data
    },
    consume: async (payload: ConsumePayload) => {
      const { data } = await api.post<ApiResponse<StockMovement>>('/stock-movements/consume', payload)
      return data.data
    },
    adjust: async (payload: ConsumePayload) => {
      const { data } = await api.post<ApiResponse<StockMovement>>('/stock-movements/adjust', payload)
      return data.data
    },
  },
}
