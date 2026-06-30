import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { type ColumnDef } from '@tanstack/react-table'
import {
  AlertTriangle,
  ArrowDownUp,
  Boxes,
  Camera,
  History,
  Minus,
  Package,
  Pencil,
  Plus,
  ShoppingCart,
  Trash2,
} from 'lucide-react'
import {
  Badge,
  Breadcrumb,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  ConfirmDialog,
  DataTable,
  Form,
  Input,
  Modal,
  PageLoader,
  PageTabs,
  Pagination,
  SearchInput,
  Select,
  Textarea,
  buttonVariants,
} from '@/components'
import { StatCard } from '@/components/dashboard/StatCard'
import { useDebounce } from '@/hooks/useDebounce'
import { usePermission } from '@/hooks/usePermission'
import { useAppSettings } from '@/contexts/SettingsContext'
import {
  brandService,
  productCategoryService,
  supplierService,
} from '@/services/masterService'
import {
  inventoryService,
  movementTypeLabel,
  purchaseStatusLabel,
  purchaseStatusVariant,
  STOCK_MOVEMENT_TYPE_OPTIONS,
  STOCK_PURCHASE_STATUS_OPTIONS,
  type ProductItem,
  type ProductPayload,
  type StockMovement,
  type StockPurchase,
  type BranchStockLevel,
} from '@/services/inventoryService'
import { formatCurrency, formatDate } from '@/utils/format'
import { isPaginated } from '@/utils/master'
import { cn } from '@/utils/cn'

type Tab = 'products' | 'purchases' | 'ledger' | 'consume' | 'alerts'

function extractError(err: unknown): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const res = (err as { response?: { data?: { message?: string } } }).response
    return res?.data?.message ?? 'Something went wrong.'
  }
  return 'Something went wrong.'
}

const emptyProductForm = (): ProductPayload => ({
  name: '',
  unit: 'pcs',
  cost_price: 0,
  retail_price: 0,
  vat_rate: 0,
  vat_inclusive: false,
  track_inventory: true,
  is_sellable: false,
  is_consumable: true,
  reorder_level: 0,
  is_active: true,
})

export default function InventoryPage() {
  const queryClient = useQueryClient()
  const { hasPermission } = usePermission()
  const { settings } = useAppSettings()
  const currency = settings?.currency ?? 'AED'

  const [tab, setTab] = useState<Tab>('products')
  const [page, setPage] = useState(1)
  const [purchasePage, setPurchasePage] = useState(1)
  const [ledgerPage, setLedgerPage] = useState(1)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [purchaseStatusFilter, setPurchaseStatusFilter] = useState('')
  const [movementTypeFilter, setMovementTypeFilter] = useState('')
  const debouncedSearch = useDebounce(search, 300)

  const [productFormOpen, setProductFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null)
  const [productImageUrl, setProductImageUrl] = useState<string | null>(null)
  const productImageRef = useRef<HTMLInputElement>(null)
  const [deleteProduct, setDeleteProduct] = useState<ProductItem | null>(null)
  const [productForm, setProductForm] = useState<ProductPayload>(emptyProductForm())
  const [formError, setFormError] = useState<string | null>(null)

  const [purchaseOpen, setPurchaseOpen] = useState(false)
  const [supplierId, setSupplierId] = useState('')
  const [purchaseReference, setPurchaseReference] = useState('')
  const [purchaseNotes, setPurchaseNotes] = useState('')
  const [purchaseLines, setPurchaseLines] = useState<{ product_id: string; quantity_ordered: string; unit_cost: string }[]>([
    { product_id: '', quantity_ordered: '', unit_cost: '' },
  ])

  const [receiveOpen, setReceiveOpen] = useState(false)
  const [receiveTarget, setReceiveTarget] = useState<StockPurchase | null>(null)
  const [receiveLines, setReceiveLines] = useState<{ item_id: number; quantity_received: string; remaining: number; name: string }[]>([])

  const [consumeOpen, setConsumeOpen] = useState(false)
  const [consumeProductId, setConsumeProductId] = useState('')
  const [consumeQty, setConsumeQty] = useState('')
  const [consumeDescription, setConsumeDescription] = useState('')

  const canManageProducts = hasPermission('products.create')
  const canPurchase = hasPermission('stock-purchases.create')
  const canReceive = hasPermission('stock-purchases.update')
  const canConsume = hasPermission('stock-movements.consume')

  const { data: stats } = useQuery({
    queryKey: ['inventory-stats'],
    queryFn: () => inventoryService.stats(),
  })

  const { data: productStats } = useQuery({
    queryKey: ['products-stats'],
    queryFn: () => inventoryService.products.stats(),
  })

  const { data: categories } = useQuery({
    queryKey: ['product-categories-options'],
    queryFn: () => productCategoryService.list({ all: true }),
  })

  const { data: brands } = useQuery({
    queryKey: ['brands-options'],
    queryFn: () => brandService.list({ all: true }),
  })

  const { data: suppliers } = useQuery({
    queryKey: ['suppliers-options'],
    queryFn: () => supplierService.list({ all: true }),
  })

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['inventory-products', page, debouncedSearch, categoryFilter, statusFilter],
    queryFn: () =>
      inventoryService.products.list({
        page,
        per_page: 15,
        search: debouncedSearch || undefined,
        product_category_id: categoryFilter ? Number(categoryFilter) : undefined,
        is_active: statusFilter === '' ? undefined : statusFilter === 'active',
      }),
    enabled: tab === 'products' || purchaseOpen || consumeOpen,
  })

  const { data: purchasesData, isLoading: purchasesLoading } = useQuery({
    queryKey: ['stock-purchases', purchasePage, debouncedSearch, purchaseStatusFilter],
    queryFn: () =>
      inventoryService.purchases.list({
        page: purchasePage,
        per_page: 15,
        search: debouncedSearch || undefined,
        status: purchaseStatusFilter || undefined,
      }),
    enabled: tab === 'purchases',
  })

  const { data: ledgerData, isLoading: ledgerLoading } = useQuery({
    queryKey: ['stock-movements', ledgerPage, movementTypeFilter],
    queryFn: () =>
      inventoryService.movements.list({
        page: ledgerPage,
        per_page: 15,
        type: movementTypeFilter || undefined,
      }),
    enabled: tab === 'ledger',
  })

  const { data: lowStockData, isLoading: alertsLoading } = useQuery({
    queryKey: ['inventory-low-stock'],
    queryFn: () => inventoryService.lowStock(),
    enabled: tab === 'alerts',
  })

  const productList = useMemo(() => {
    if (!productsData) return { rows: [] as ProductItem[], meta: null }
    if (isPaginated<ProductItem>(productsData)) return { rows: productsData.data, meta: productsData.meta }
    return { rows: productsData as ProductItem[], meta: null }
  }, [productsData])

  const purchaseList = useMemo(() => {
    if (!purchasesData) return { rows: [] as StockPurchase[], meta: null }
    if (isPaginated<StockPurchase>(purchasesData)) return { rows: purchasesData.data, meta: purchasesData.meta }
    return { rows: purchasesData as StockPurchase[], meta: null }
  }, [purchasesData])

  const ledgerList = useMemo(() => {
    if (!ledgerData) return { rows: [] as StockMovement[], meta: null }
    if (isPaginated<StockMovement>(ledgerData)) return { rows: ledgerData.data, meta: ledgerData.meta }
    return { rows: ledgerData as StockMovement[], meta: null }
  }, [ledgerData])

  const categoryOptions = (Array.isArray(categories) ? categories : []).map((c: { id: number; name: string }) => ({
    value: c.id,
    label: c.name,
  }))

  const brandOptions = (Array.isArray(brands) ? brands : []).map((b: { id: number; name: string }) => ({
    value: b.id,
    label: b.name,
  }))

  const supplierOptions = (Array.isArray(suppliers) ? suppliers : []).map((s: { id: number; name: string }) => ({
    value: s.id,
    label: s.name,
  }))

  const allProducts = useMemo(() => {
    if (!productsData) return [] as ProductItem[]
    if (isPaginated<ProductItem>(productsData)) return productsData.data
    return productsData as ProductItem[]
  }, [productsData])

  const productOptions = allProducts
    .filter((p) => p.track_inventory && p.is_active)
    .map((p) => ({ value: p.id, label: `${p.code} — ${p.name}` }))

  const createProductMutation = useMutation({
    mutationFn: inventoryService.products.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-products'] })
      queryClient.invalidateQueries({ queryKey: ['products-stats'] })
      queryClient.invalidateQueries({ queryKey: ['inventory-stats'] })
      closeProductForm()
    },
    onError: (err) => setFormError(extractError(err)),
  })

  const updateProductMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<ProductPayload> }) =>
      inventoryService.products.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-products'] })
      queryClient.invalidateQueries({ queryKey: ['products-stats'] })
      closeProductForm()
    },
    onError: (err) => setFormError(extractError(err)),
  })

  const deleteProductMutation = useMutation({
    mutationFn: inventoryService.products.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-products'] })
      queryClient.invalidateQueries({ queryKey: ['products-stats'] })
      setDeleteProduct(null)
    },
  })

  const productImageUploadMutation = useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) => inventoryService.products.uploadImage(id, file),
    onSuccess: (product) => {
      setProductImageUrl(product.image_url ?? null)
      queryClient.invalidateQueries({ queryKey: ['inventory-products'] })
      queryClient.invalidateQueries({ queryKey: ['public-products'] })
    },
    onError: (err) => setFormError(extractError(err)),
  })

  const productImageDeleteMutation = useMutation({
    mutationFn: (id: number) => inventoryService.products.deleteImage(id),
    onSuccess: () => {
      setProductImageUrl(null)
      queryClient.invalidateQueries({ queryKey: ['inventory-products'] })
      queryClient.invalidateQueries({ queryKey: ['public-products'] })
    },
    onError: (err) => setFormError(extractError(err)),
  })

  const createPurchaseMutation = useMutation({
    mutationFn: inventoryService.purchases.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock-purchases'] })
      queryClient.invalidateQueries({ queryKey: ['inventory-stats'] })
      setPurchaseOpen(false)
      setFormError(null)
    },
    onError: (err) => setFormError(extractError(err)),
  })

  const receiveMutation = useMutation({
    mutationFn: ({ id, items }: { id: number; items: { item_id: number; quantity_received: number }[] }) =>
      inventoryService.purchases.receive(id, { items }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock-purchases'] })
      queryClient.invalidateQueries({ queryKey: ['stock-movements'] })
      queryClient.invalidateQueries({ queryKey: ['inventory-low-stock'] })
      queryClient.invalidateQueries({ queryKey: ['inventory-stats'] })
      setReceiveOpen(false)
      setReceiveTarget(null)
    },
    onError: (err) => setFormError(extractError(err)),
  })

  const consumeMutation = useMutation({
    mutationFn: inventoryService.movements.consume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock-movements'] })
      queryClient.invalidateQueries({ queryKey: ['inventory-low-stock'] })
      queryClient.invalidateQueries({ queryKey: ['inventory-stats'] })
      setConsumeOpen(false)
      setConsumeProductId('')
      setConsumeQty('')
      setConsumeDescription('')
      setFormError(null)
    },
    onError: (err) => setFormError(extractError(err)),
  })

  const openCreateProduct = () => {
    setEditingProduct(null)
    setProductImageUrl(null)
    setProductForm(emptyProductForm())
    setFormError(null)
    setProductFormOpen(true)
  }

  const openEditProduct = (row: ProductItem) => {
    setEditingProduct(row)
    setProductImageUrl(row.image_url ?? null)
    setProductForm({
      product_category_id: row.product_category_id,
      brand_id: row.brand_id,
      default_supplier_id: row.default_supplier_id,
      barcode: row.barcode,
      name: row.name,
      description: row.description,
      unit: row.unit,
      cost_price: row.cost_price,
      retail_price: row.retail_price,
      vat_rate: row.vat_rate,
      vat_inclusive: row.vat_inclusive,
      track_inventory: row.track_inventory,
      is_sellable: row.is_sellable,
      is_consumable: row.is_consumable,
      reorder_level: row.reorder_level,
      reorder_quantity: row.reorder_quantity,
      is_active: row.is_active,
    })
    setFormError(null)
    setProductFormOpen(true)
  }

  const closeProductForm = () => {
    setProductFormOpen(false)
    setEditingProduct(null)
    setProductImageUrl(null)
    setFormError(null)
  }

  const submitProduct = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, payload: productForm })
    } else {
      createProductMutation.mutate(productForm)
    }
  }

  const openReceive = async (purchase: StockPurchase) => {
    setFormError(null)
    const full = purchase.items?.length ? purchase : await inventoryService.purchases.get(purchase.id)
    setReceiveTarget(full)
    setReceiveLines(
      (full.items ?? [])
        .filter((i) => i.remaining > 0)
        .map((i) => ({
          item_id: i.id,
          quantity_received: String(i.remaining),
          remaining: i.remaining,
          name: i.product?.name ?? `Product #${i.product_id}`,
        }))
    )
    setReceiveOpen(true)
  }

  const submitPurchase = (e: React.FormEvent) => {
    e.preventDefault()
    const items = purchaseLines
      .filter((l) => l.product_id && l.quantity_ordered && l.unit_cost)
      .map((l) => ({
        product_id: Number(l.product_id),
        quantity_ordered: Number(l.quantity_ordered),
        unit_cost: Number(l.unit_cost),
      }))
    if (!supplierId || items.length === 0) {
      setFormError('Supplier and at least one line item are required.')
      return
    }
    createPurchaseMutation.mutate({
      supplier_id: Number(supplierId),
      reference: purchaseReference || undefined,
      notes: purchaseNotes || undefined,
      items,
    })
  }

  const submitReceive = (e: React.FormEvent) => {
    e.preventDefault()
    if (!receiveTarget) return
    const items = receiveLines
      .filter((l) => Number(l.quantity_received) > 0)
      .map((l) => ({ item_id: l.item_id, quantity_received: Number(l.quantity_received) }))
    receiveMutation.mutate({ id: receiveTarget.id, items })
  }

  const submitConsume = (e: React.FormEvent) => {
    e.preventDefault()
    consumeMutation.mutate({
      product_id: Number(consumeProductId),
      quantity: Number(consumeQty),
      description: consumeDescription || undefined,
    })
  }

  const productColumns: ColumnDef<ProductItem, unknown>[] = [
    { accessorKey: 'code', header: 'Code' },
    { accessorKey: 'name', header: 'Name' },
    {
      id: 'category',
      header: 'Category',
      cell: ({ row }) => row.original.category?.name ?? '—',
    },
    {
      id: 'brand',
      header: 'Brand',
      cell: ({ row }) => row.original.brand?.name ?? '—',
    },
    {
      accessorKey: 'cost_price',
      header: 'Cost',
      cell: ({ getValue }) => formatCurrency(Number(getValue()), currency),
    },
    {
      accessorKey: 'reorder_level',
      header: 'Reorder',
    },
    {
      accessorKey: 'is_active',
      header: 'Status',
      cell: ({ getValue }) => (
        <Badge variant={getValue() ? 'success' : 'warning'}>{getValue() ? 'Active' : 'Inactive'}</Badge>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          {hasPermission('products.update') && (
            <Button variant="ghost" size="icon" onClick={() => openEditProduct(row.original)}>
              <Pencil className="h-4 w-4" />
            </Button>
          )}
          {hasPermission('products.delete') && (
            <Button variant="ghost" size="icon" onClick={() => setDeleteProduct(row.original)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          )}
        </div>
      ),
    },
  ]

  const purchaseColumns: ColumnDef<StockPurchase, unknown>[] = [
    { accessorKey: 'code', header: 'PO #' },
    {
      id: 'supplier',
      header: 'Supplier',
      cell: ({ row }) => row.original.supplier?.name ?? '—',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => (
        <Badge variant={purchaseStatusVariant(getValue() as StockPurchase['status'])}>
          {purchaseStatusLabel(getValue() as StockPurchase['status'])}
        </Badge>
      ),
    },
    {
      accessorKey: 'total_amount',
      header: 'Total',
      cell: ({ getValue }) => formatCurrency(Number(getValue()), currency),
    },
    {
      accessorKey: 'ordered_at',
      header: 'Ordered',
      cell: ({ getValue }) => (getValue() ? formatDate(String(getValue())) : '—'),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) =>
        canReceive && ['ordered', 'partial'].includes(row.original.status) ? (
          <Button variant="outline" size="sm" onClick={() => openReceive(row.original)}>
            Receive
          </Button>
        ) : null,
    },
  ]

  const ledgerColumns: ColumnDef<StockMovement, unknown>[] = [
    {
      accessorKey: 'created_at',
      header: 'Date',
      cell: ({ getValue }) => (getValue() ? formatDate(String(getValue())) : '—'),
    },
    {
      id: 'product',
      header: 'Product',
      cell: ({ row }) => row.original.product?.name ?? '—',
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ getValue }) => movementTypeLabel(getValue() as StockMovement['type']),
    },
    {
      accessorKey: 'quantity',
      header: 'Qty',
      cell: ({ getValue }) => {
        const v = Number(getValue())
        return <span className={cn(v < 0 ? 'text-destructive' : 'text-green-700')}>{v > 0 ? `+${v}` : v}</span>
      },
    },
    { accessorKey: 'balance_after', header: 'Balance' },
    { accessorKey: 'description', header: 'Notes' },
  ]

  const alertColumns: ColumnDef<BranchStockLevel, unknown>[] = [
    {
      id: 'product',
      header: 'Product',
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.product?.name}</p>
          <p className="text-xs text-muted-foreground">{row.original.product?.code}</p>
        </div>
      ),
    },
    {
      accessorKey: 'quantity_on_hand',
      header: 'On Hand',
      cell: ({ getValue }) => <span className="font-semibold text-destructive">{String(getValue())}</span>,
    },
    { accessorKey: 'reorder_level', header: 'Reorder Level' },
    {
      id: 'branch',
      header: 'Branch',
      cell: ({ row }) => row.original.branch?.name ?? '—',
    },
  ]

  const tabs: { key: Tab; label: string; icon: typeof Package }[] = [
    { key: 'products', label: 'Products', icon: Package },
    { key: 'purchases', label: 'Purchases', icon: ShoppingCart },
    { key: 'ledger', label: 'Stock Ledger', icon: History },
    { key: 'consume', label: 'Consumption', icon: Minus },
    { key: 'alerts', label: 'Alerts', icon: AlertTriangle },
  ]

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Inventory' }]} />

      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground">Products, purchases, stock movements & alerts</p>
        </div>
        <div className="flex shrink-0 flex-nowrap items-center gap-1.5 overflow-x-auto">
          <Link to="/masters/product-categories" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
            Categories
          </Link>
          <Link to="/masters/brands" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
            Brands
          </Link>
          <Link to="/masters/suppliers" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
            Suppliers
          </Link>
          {tab === 'products' && canManageProducts && (
            <Button onClick={openCreateProduct}>
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          )}
          {tab === 'purchases' && canPurchase && (
            <Button onClick={() => { setFormError(null); setPurchaseOpen(true) }}>
              <Plus className="mr-2 h-4 w-4" /> New Purchase
            </Button>
          )}
          {tab === 'consume' && canConsume && (
            <Button onClick={() => setConsumeOpen(true)}>
              <Minus className="mr-2 h-4 w-4" /> Record Consumption
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Active Products" value={productStats?.total ?? stats?.total_products ?? 0} icon={Boxes} />
        <StatCard title="Low Stock" value={stats?.low_stock_count ?? 0} icon={AlertTriangle} gradient="from-amber-600 via-amber-500 to-amber-400" />
        <StatCard title="Pending POs" value={stats?.pending_purchases ?? 0} icon={ShoppingCart} />
        <StatCard title="Inactive Products" value={productStats?.inactive ?? 0} icon={ArrowDownUp} />
      </div>

      <PageTabs
        tabs={tabs.map((t) => ({
          ...t,
          badge: t.key === 'alerts' ? stats?.low_stock_count : undefined,
        }))}
        active={tab}
        onChange={(key) => { setTab(key); setSearch(''); setPage(1) }}
      />

      {tab === 'products' && (
        <Card>
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 flex-wrap gap-2">
              <SearchInput value={search} onChange={setSearch} placeholder="Search products…" className="max-w-xs" />
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                options={[{ value: '', label: 'All categories' }, ...categoryOptions.map((o) => ({ value: String(o.value), label: o.label }))]}
                className="w-44"
              />
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: '', label: 'All status' },
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                ]}
                className="w-36"
              />
            </div>
          </CardHeader>
          <CardContent>
            {productsLoading ? <PageLoader /> : (
              <>
                <DataTable columns={productColumns} data={productList.rows} />
                {productList.meta && (
                  <Pagination currentPage={productList.meta.current_page} totalPages={productList.meta.last_page} onPageChange={setPage} />
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}

      {tab === 'purchases' && (
        <Card>
          <CardHeader className="flex flex-wrap gap-2">
            <SearchInput value={search} onChange={setSearch} placeholder="Search PO…" className="max-w-xs" />
            <Select
              value={purchaseStatusFilter}
              onChange={(e) => setPurchaseStatusFilter(e.target.value)}
              options={[{ value: '', label: 'All status' }, ...STOCK_PURCHASE_STATUS_OPTIONS.map((o) => ({ value: o.value, label: o.label }))]}
              className="w-44"
            />
          </CardHeader>
          <CardContent>
            {purchasesLoading ? <PageLoader /> : (
              <>
                <DataTable columns={purchaseColumns} data={purchaseList.rows} />
                {purchaseList.meta && (
                  <Pagination currentPage={purchaseList.meta.current_page} totalPages={purchaseList.meta.last_page} onPageChange={setPurchasePage} />
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}

      {tab === 'ledger' && (
        <Card>
          <CardHeader>
            <Select
              value={movementTypeFilter}
              onChange={(e) => setMovementTypeFilter(e.target.value)}
              options={[{ value: '', label: 'All types' }, ...STOCK_MOVEMENT_TYPE_OPTIONS.map((o) => ({ value: o.value, label: o.label }))]}
              className="w-44"
            />
          </CardHeader>
          <CardContent>
            {ledgerLoading ? <PageLoader /> : (
              <>
                <DataTable columns={ledgerColumns} data={ledgerList.rows} />
                {ledgerList.meta && (
                  <Pagination currentPage={ledgerList.meta.current_page} totalPages={ledgerList.meta.last_page} onPageChange={setLedgerPage} />
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}

      {tab === 'consume' && (
        <Card>
          <CardContent className="py-12 text-center">
            <Minus className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-semibold">Record Product Consumption</h3>
            <p className="mb-4 text-sm text-muted-foreground">Deduct stock used during services or internal use.</p>
            {canConsume ? (
              <Button onClick={() => setConsumeOpen(true)}>Record Consumption</Button>
            ) : (
              <p className="text-sm text-muted-foreground">You do not have permission to record consumption.</p>
            )}
          </CardContent>
        </Card>
      )}

      {tab === 'alerts' && (
        <Card>
          <CardHeader>
            <h3 className="font-semibold">Low Stock Alerts</h3>
            <p className="text-sm text-muted-foreground">Products at or below reorder level</p>
          </CardHeader>
          <CardContent>
            {alertsLoading ? <PageLoader /> : (
              lowStockData && lowStockData.length > 0 ? (
                <DataTable columns={alertColumns} data={lowStockData} />
              ) : (
                <p className="py-8 text-center text-muted-foreground">No low stock alerts — all levels are healthy.</p>
              )
            )}
          </CardContent>
        </Card>
      )}

      <Modal open={productFormOpen} onOpenChange={(open) => !open && closeProductForm()} title={editingProduct ? 'Edit Product' : 'Add Product'} className="max-w-2xl">
        <Form onSubmit={submitProduct} className="space-y-4">
          {formError && <p className="text-sm text-destructive">{formError}</p>}
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Name" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} required />
            <Input label="Barcode" value={productForm.barcode ?? ''} onChange={(e) => setProductForm({ ...productForm, barcode: e.target.value })} />
            <Select label="Category" value={String(productForm.product_category_id ?? '')} onChange={(e) => setProductForm({ ...productForm, product_category_id: e.target.value ? Number(e.target.value) : null })} options={[{ value: '', label: '—' }, ...categoryOptions.map((o) => ({ value: String(o.value), label: o.label }))]} />
            <Select label="Brand" value={String(productForm.brand_id ?? '')} onChange={(e) => setProductForm({ ...productForm, brand_id: e.target.value ? Number(e.target.value) : null })} options={[{ value: '', label: '—' }, ...brandOptions.map((o) => ({ value: String(o.value), label: o.label }))]} />
            <Select label="Default Supplier" value={String(productForm.default_supplier_id ?? '')} onChange={(e) => setProductForm({ ...productForm, default_supplier_id: e.target.value ? Number(e.target.value) : null })} options={[{ value: '', label: '—' }, ...supplierOptions.map((o) => ({ value: String(o.value), label: o.label }))]} />
            <Input label="Unit" value={productForm.unit ?? 'pcs'} onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })} />
            <Input label="Cost Price" type="number" step="0.01" value={productForm.cost_price} onChange={(e) => setProductForm({ ...productForm, cost_price: Number(e.target.value) })} required />
            <Input label="Retail Price" type="number" step="0.01" value={productForm.retail_price ?? 0} onChange={(e) => setProductForm({ ...productForm, retail_price: Number(e.target.value) })} />
            <Input label="VAT Rate % (optional)" type="number" step="0.01" value={productForm.vat_rate ?? 0} onChange={(e) => setProductForm({ ...productForm, vat_rate: Number(e.target.value) })} />
            <Input label="Reorder Level" type="number" step="0.001" value={productForm.reorder_level ?? 0} onChange={(e) => setProductForm({ ...productForm, reorder_level: Number(e.target.value) })} />
          </div>
          <Textarea label="Description" value={productForm.description ?? ''} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} />
          {editingProduct && canManageProducts && productForm.is_sellable && (
            <div className="rounded-xl border border-border bg-muted/20 p-4">
              <p className="text-sm font-semibold text-foreground">Product Image</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Shown on the public shop page for sellable products.</p>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative h-28 w-40 shrink-0 overflow-hidden rounded-lg border border-border bg-muted/40">
                  {productImageUrl ? (
                    <img src={productImageUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      <Package className="h-8 w-8 opacity-40" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => productImageRef.current?.click()}
                    className="absolute bottom-1 right-1 rounded-full bg-primary p-1.5 text-primary-foreground shadow"
                    title="Upload product image"
                  >
                    <Camera className="h-3.5 w-3.5" />
                  </button>
                  <input
                    ref={productImageRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file && editingProduct) {
                        productImageUploadMutation.mutate({ id: editingProduct.id, file })
                      }
                      e.target.value = ''
                    }}
                  />
                </div>
                {productImageUrl && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-destructive"
                    loading={productImageDeleteMutation.isPending}
                    onClick={() => productImageDeleteMutation.mutate(editingProduct.id)}
                  >
                    Remove image
                  </Button>
                )}
              </div>
            </div>
          )}
          <div className="flex flex-wrap gap-4">
            <Checkbox label="Track inventory" checked={productForm.track_inventory ?? true} onChange={(e) => setProductForm({ ...productForm, track_inventory: e.target.checked })} />
            <Checkbox label="Consumable" checked={productForm.is_consumable ?? true} onChange={(e) => setProductForm({ ...productForm, is_consumable: e.target.checked })} />
            <Checkbox label="Sellable" checked={productForm.is_sellable ?? false} onChange={(e) => setProductForm({ ...productForm, is_sellable: e.target.checked })} />
            <Checkbox label="Active" checked={productForm.is_active ?? true} onChange={(e) => setProductForm({ ...productForm, is_active: e.target.checked })} />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={closeProductForm}>Cancel</Button>
            <Button type="submit" loading={createProductMutation.isPending || updateProductMutation.isPending}>
              {editingProduct ? 'Save Changes' : 'Create Product'}
            </Button>
          </div>
        </Form>
      </Modal>

      <Modal open={purchaseOpen} onOpenChange={setPurchaseOpen} title="New Purchase Order" className="max-w-2xl">
        <Form onSubmit={submitPurchase} className="space-y-4">
          {formError && <p className="text-sm text-destructive">{formError}</p>}
          <Select label="Supplier" value={supplierId} onChange={(e) => setSupplierId(e.target.value)} options={[{ value: '', label: 'Select supplier' }, ...supplierOptions.map((o) => ({ value: String(o.value), label: o.label }))]} required />
          <Input label="Reference" value={purchaseReference} onChange={(e) => setPurchaseReference(e.target.value)} />
          <Textarea label="Notes" value={purchaseNotes} onChange={(e) => setPurchaseNotes(e.target.value)} />
          <div className="space-y-2">
            <p className="text-sm font-medium">Line Items</p>
            {purchaseLines.map((line, idx) => (
              <div key={idx} className="grid gap-2 sm:grid-cols-4">
                <Select value={line.product_id} onChange={(e) => { const next = [...purchaseLines]; next[idx].product_id = e.target.value; setPurchaseLines(next) }} options={[{ value: '', label: 'Product' }, ...productOptions.map((o) => ({ value: String(o.value), label: o.label }))]} />
                <Input placeholder="Qty" type="number" step="0.001" value={line.quantity_ordered} onChange={(e) => { const next = [...purchaseLines]; next[idx].quantity_ordered = e.target.value; setPurchaseLines(next) }} />
                <Input placeholder="Unit cost" type="number" step="0.01" value={line.unit_cost} onChange={(e) => { const next = [...purchaseLines]; next[idx].unit_cost = e.target.value; setPurchaseLines(next) }} />
                <Button type="button" variant="ghost" size="icon" onClick={() => setPurchaseLines(purchaseLines.filter((_, i) => i !== idx))} disabled={purchaseLines.length === 1}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => setPurchaseLines([...purchaseLines, { product_id: '', quantity_ordered: '', unit_cost: '' }])}>
              <Plus className="mr-1 h-4 w-4" /> Add Line
            </Button>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setPurchaseOpen(false)}>Cancel</Button>
            <Button type="submit" loading={createPurchaseMutation.isPending}>Create PO</Button>
          </div>
        </Form>
      </Modal>

      <Modal open={receiveOpen} onOpenChange={setReceiveOpen} title={`Receive Stock — ${receiveTarget?.code ?? ''}`} className="max-w-lg">
        <Form onSubmit={submitReceive} className="space-y-4">
          {formError && <p className="text-sm text-destructive">{formError}</p>}
          {receiveLines.map((line, idx) => (
            <div key={line.item_id} className="grid gap-2 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium">{line.name}</p>
                <p className="text-xs text-muted-foreground">Remaining: {line.remaining}</p>
              </div>
              <Input label="Receive Qty" type="number" step="0.001" value={line.quantity_received} onChange={(e) => { const next = [...receiveLines]; next[idx].quantity_received = e.target.value; setReceiveLines(next) }} />
            </div>
          ))}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setReceiveOpen(false)}>Cancel</Button>
            <Button type="submit" loading={receiveMutation.isPending}>Confirm Receive</Button>
          </div>
        </Form>
      </Modal>

      <Modal open={consumeOpen} onOpenChange={setConsumeOpen} title="Record Consumption" className="max-w-md">
        <Form onSubmit={submitConsume} className="space-y-4">
          {formError && <p className="text-sm text-destructive">{formError}</p>}
          <Select label="Product" value={consumeProductId} onChange={(e) => setConsumeProductId(e.target.value)} options={[{ value: '', label: 'Select product' }, ...productOptions.map((o) => ({ value: String(o.value), label: o.label }))]} required />
          <Input label="Quantity" type="number" step="0.001" value={consumeQty} onChange={(e) => setConsumeQty(e.target.value)} required />
          <Textarea label="Description" value={consumeDescription} onChange={(e) => setConsumeDescription(e.target.value)} />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setConsumeOpen(false)}>Cancel</Button>
            <Button type="submit" loading={consumeMutation.isPending}>Record</Button>
          </div>
        </Form>
      </Modal>

      <ConfirmDialog
        open={!!deleteProduct}
        onOpenChange={(open) => !open && setDeleteProduct(null)}
        title="Delete Product"
        description={`Delete "${deleteProduct?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        loading={deleteProductMutation.isPending}
        onConfirm={() => deleteProduct && deleteProductMutation.mutate(deleteProduct.id)}
      />
    </div>
  )
}
