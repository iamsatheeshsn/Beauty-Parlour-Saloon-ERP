import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { type ColumnDef } from '@tanstack/react-table'
import { Coins, Gift, History, Minus, Package, Pencil, Plus, ShoppingBag, Trash2 } from 'lucide-react'
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
  Pagination,
  SearchInput,
  Select,
  Textarea,
} from '@/components'
import { CustomerSearchInput } from '@/components/customers/CustomerSearchInput'
import { StatCard } from '@/components/dashboard/StatCard'
import { useDebounce } from '@/hooks/useDebounce'
import { usePermission } from '@/hooks/usePermission'
import { useAppSettings } from '@/contexts/SettingsContext'
import { customerService, type Customer, type CustomerPayload } from '@/services/customerService'
import {
  packageService,
  packageStatusLabel,
  packageStatusVariant,
  PACKAGE_STATUS_OPTIONS,
  type CustomerPackage,
  type PointTransaction,
  type ServicePackage,
  type ServicePackagePayload,
} from '@/services/packageService'
import { salonServiceApi } from '@/services/salonServiceApi'
import { formatCurrency, formatDate } from '@/utils/format'
import { isPaginated } from '@/utils/master'
import { cn } from '@/utils/cn'

type Tab = 'catalog' | 'purchases' | 'ledger'

interface CustomerPicker {
  phone: string
  customer: Customer | null
  registerMode: boolean
  registerForm: CustomerPayload
}

const emptyPicker = (): CustomerPicker => ({
  phone: '',
  customer: null,
  registerMode: false,
  registerForm: { name: '', phone: '', is_active: true },
})

function extractError(err: unknown): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const res = (err as { response?: { data?: { message?: string } } }).response
    return res?.data?.message ?? 'Something went wrong.'
  }
  return 'Something went wrong.'
}

export default function PackagesPage() {
  const queryClient = useQueryClient()
  const { hasPermission } = usePermission()
  const { settings } = useAppSettings()
  const currency = settings?.currency ?? 'AED'

  const [tab, setTab] = useState<Tab>('catalog')
  const [page, setPage] = useState(1)
  const [purchasePage, setPurchasePage] = useState(1)
  const [ledgerPage, setLedgerPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const debouncedSearch = useDebounce(search, 300)

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<ServicePackage | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ServicePackage | null>(null)
  const [purchaseOpen, setPurchaseOpen] = useState(false)
  const [consumeOpen, setConsumeOpen] = useState(false)
  const [allocateOpen, setAllocateOpen] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const [form, setForm] = useState<ServicePackagePayload>({
    name: '',
    description: '',
    price: 0,
    points_included: 100,
    validity_days: 90,
    vat_rate: 0,
    vat_inclusive: false,
    is_active: true,
    items: [],
  })
  const [itemRows, setItemRows] = useState<{ service_id: string; points_cost: string }[]>([
    { service_id: '', points_cost: '' },
  ])

  const [picker, setPicker] = useState<CustomerPicker>(emptyPicker)
  const [purchasePackageId, setPurchasePackageId] = useState('')
  const [purchaseNotes, setPurchaseNotes] = useState('')

  const [consumePicker, setConsumePicker] = useState<CustomerPicker>(emptyPicker)
  const [consumePackageId, setConsumePackageId] = useState('')
  const [consumeServiceId, setConsumeServiceId] = useState('')
  const [consumePoints, setConsumePoints] = useState('')
  const [consumeDescription, setConsumeDescription] = useState('')

  const [allocatePicker, setAllocatePicker] = useState<CustomerPicker>(emptyPicker)
  const [allocatePackageId, setAllocatePackageId] = useState('')
  const [allocatePoints, setAllocatePoints] = useState('')
  const [allocateDescription, setAllocateDescription] = useState('')

  const { data: stats } = useQuery({ queryKey: ['package-stats'], queryFn: () => packageService.stats() })

  const { data: catalogData, isLoading: catalogLoading } = useQuery({
    queryKey: ['service-packages', page, debouncedSearch],
    queryFn: () => packageService.list({ page, per_page: 15, search: debouncedSearch || undefined }),
    enabled: tab === 'catalog',
  })

  const { data: activePackages } = useQuery({
    queryKey: ['service-packages-active'],
    queryFn: () => packageService.listActive(),
  })

  const { data: servicesList } = useQuery({
    queryKey: ['services-for-packages'],
    queryFn: () => salonServiceApi.list({ all: true, is_active: true }),
  })

  const serviceOptions = useMemo(() => {
    const rows = Array.isArray(servicesList) ? servicesList : servicesList?.data ?? []
    return rows.map((s) => ({ value: s.id, label: s.name }))
  }, [servicesList])

  const { data: purchasesData, isLoading: purchasesLoading } = useQuery({
    queryKey: ['customer-packages', purchasePage, statusFilter, debouncedSearch],
    queryFn: () =>
      packageService.listPurchases({
        page: purchasePage,
        per_page: 15,
        status: statusFilter || undefined,
        search: debouncedSearch || undefined,
      }),
    enabled: tab === 'purchases',
  })

  const { data: ledgerData, isLoading: ledgerLoading } = useQuery({
    queryKey: ['point-transactions', ledgerPage, debouncedSearch],
    queryFn: () => packageService.transactions({ page: ledgerPage, per_page: 15 }),
    enabled: tab === 'ledger',
  })

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['package-stats'] })
    queryClient.invalidateQueries({ queryKey: ['service-packages'] })
    queryClient.invalidateQueries({ queryKey: ['service-packages-active'] })
    queryClient.invalidateQueries({ queryKey: ['customer-packages'] })
    queryClient.invalidateQueries({ queryKey: ['point-transactions'] })
    queryClient.invalidateQueries({ queryKey: ['customer-packages-summary'] })
  }

  const createMutation = useMutation({
    mutationFn: (payload: ServicePackagePayload) => packageService.create(payload),
    onSuccess: () => { invalidate(); closeForm() },
    onError: (err) => setFormError(extractError(err)),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<ServicePackagePayload> }) =>
      packageService.update(id, payload),
    onSuccess: () => { invalidate(); closeForm() },
    onError: (err) => setFormError(extractError(err)),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => packageService.remove(id),
    onSuccess: () => { invalidate(); setDeleteTarget(null) },
  })

  const purchaseMutation = useMutation({
    mutationFn: packageService.purchase,
    onSuccess: () => { invalidate(); closePurchase() },
    onError: (err) => setFormError(extractError(err)),
  })

  const consumeMutation = useMutation({
    mutationFn: packageService.consume,
    onSuccess: () => { invalidate(); closeConsume() },
    onError: (err) => setFormError(extractError(err)),
  })

  const allocateMutation = useMutation({
    mutationFn: packageService.allocate,
    onSuccess: () => { invalidate(); closeAllocate() },
    onError: (err) => setFormError(extractError(err)),
  })

  const searchMutation = useMutation({
    mutationFn: (phone: string) => customerService.searchByPhone(phone),
  })

  const registerMutation = useMutation({
    mutationFn: (payload: CustomerPayload) => customerService.create(payload),
    onError: (err) => setFormError(extractError(err)),
  })

  const catalogRows = catalogData && isPaginated(catalogData) ? catalogData.data : []
  const catalogMeta = catalogData && isPaginated(catalogData) ? catalogData.meta : null
  const purchaseRows = purchasesData && isPaginated(purchasesData) ? purchasesData.data : []
  const purchaseMeta = purchasesData && isPaginated(purchasesData) ? purchasesData.meta : null
  const ledgerRows = ledgerData && isPaginated(ledgerData) ? ledgerData.data : []
  const ledgerMeta = ledgerData && isPaginated(ledgerData) ? ledgerData.meta : null

  const closeForm = () => {
    setFormOpen(false)
    setEditing(null)
    setFormError(null)
    setForm({ name: '', description: '', price: 0, points_included: 100, validity_days: 90, vat_rate: 5, vat_inclusive: false, is_active: true, items: [] })
    setItemRows([{ service_id: '', points_cost: '' }])
  }

  const openEdit = (pkg: ServicePackage) => {
    setEditing(pkg)
    setForm({
      name: pkg.name,
      description: pkg.description ?? '',
      price: pkg.price,
      points_included: pkg.points_included,
      validity_days: pkg.validity_days ?? undefined,
      vat_rate: pkg.vat_rate,
      vat_inclusive: pkg.vat_inclusive,
      is_active: pkg.is_active,
      items: pkg.items?.map((i) => ({ service_id: i.service_id, points_cost: i.points_cost })) ?? [],
    })
    setItemRows(
      pkg.items?.length
        ? pkg.items.map((i) => ({ service_id: String(i.service_id), points_cost: String(i.points_cost) }))
        : [{ service_id: '', points_cost: '' }]
    )
    setFormOpen(true)
  }

  const buildItems = () =>
    itemRows
      .filter((r) => r.service_id && r.points_cost)
      .map((r) => ({ service_id: Number(r.service_id), points_cost: Number(r.points_cost) }))

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    const payload = { ...form, items: buildItems() }
    if (editing) updateMutation.mutate({ id: editing.id, payload })
    else createMutation.mutate(payload)
  }

  const closePurchase = () => {
    setPurchaseOpen(false)
    setPicker(emptyPicker())
    setPurchasePackageId('')
    setPurchaseNotes('')
    setFormError(null)
  }

  const closeConsume = () => {
    setConsumeOpen(false)
    setConsumePicker(emptyPicker())
    setConsumePackageId('')
    setConsumeServiceId('')
    setConsumePoints('')
    setConsumeDescription('')
    setFormError(null)
  }

  const closeAllocate = () => {
    setAllocateOpen(false)
    setAllocatePicker(emptyPicker())
    setAllocatePackageId('')
    setAllocatePoints('')
    setAllocateDescription('')
    setFormError(null)
  }

  const resolveCustomer = async (
    p: CustomerPicker,
    setter: React.Dispatch<React.SetStateAction<CustomerPicker>>
  ): Promise<number | null> => {
    if (p.customer) return p.customer.id
    if (p.registerMode && p.registerForm.name.trim()) {
      const created = await registerMutation.mutateAsync({ ...p.registerForm, phone: p.phone.trim() })
      setter((prev) => ({ ...prev, customer: created, registerMode: false }))
      return created.id
    }
    setFormError('Please find or register a customer first.')
    return null
  }

  const handleSearch = async (
    p: CustomerPicker,
    setter: React.Dispatch<React.SetStateAction<CustomerPicker>>
  ) => {
    setFormError(null)
    if (p.phone.trim().length < 7) {
      setFormError('Enter a valid mobile number.')
      return
    }
    const result = await searchMutation.mutateAsync(p.phone.trim())
    setter((prev) => ({
      ...prev,
      customer: result.customer,
      registerMode: !result.found,
      registerForm: !result.found ? { ...prev.registerForm, phone: p.phone.trim(), name: '' } : prev.registerForm,
    }))
  }

  const renderCustomerBlock = (
    p: CustomerPicker,
    setter: React.Dispatch<React.SetStateAction<CustomerPicker>>
  ) => (
    <div className="space-y-3">
      <CustomerSearchInput
        value={p.phone}
        onChange={(v) => setter((prev) => ({ ...prev, phone: v }))}
        onSearch={() => handleSearch(p, setter)}
        isSearching={searchMutation.isPending}
      />
      {p.customer && (
        <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm">
          <p className="font-medium">{p.customer.name}</p>
          <p className="text-muted-foreground">{p.customer.phone}</p>
        </div>
      )}
      {p.registerMode && !p.customer && (
        <Input
          placeholder="New customer name"
          value={p.registerForm.name}
          onChange={(e) => setter((prev) => ({ ...prev, registerForm: { ...prev.registerForm, name: e.target.value } }))}
        />
      )}
    </div>
  )

  const catalogColumns: ColumnDef<ServicePackage>[] = [
    { accessorKey: 'code', header: 'Code' },
    { accessorKey: 'name', header: 'Package' },
    {
      accessorKey: 'points_included',
      header: 'Points',
      cell: ({ getValue }) => <span className="font-medium text-primary">{getValue() as number}</span>,
    },
    {
      accessorKey: 'total_price',
      header: 'Price',
      cell: ({ getValue }) => formatCurrency(Number(getValue()), currency),
    },
    {
      accessorKey: 'validity_days',
      header: 'Validity',
      cell: ({ getValue }) => (getValue() ? `${getValue()} days` : 'No expiry'),
    },
    {
      accessorKey: 'is_active',
      header: 'Status',
      cell: ({ getValue }) => (
        <Badge variant={getValue() ? 'success' : 'destructive'}>{getValue() ? 'Active' : 'Inactive'}</Badge>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex gap-1">
          {hasPermission('service-packages.update') && (
            <Button type="button" variant="ghost" size="sm" onClick={() => openEdit(row.original)}>
              <Pencil className="h-4 w-4" />
            </Button>
          )}
          {hasPermission('service-packages.delete') && (
            <Button type="button" variant="ghost" size="sm" onClick={() => setDeleteTarget(row.original)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          )}
        </div>
      ),
    },
  ]

  const purchaseColumns: ColumnDef<CustomerPackage>[] = [
    { accessorKey: 'code', header: 'Ref' },
    {
      accessorKey: 'customer.name',
      header: 'Customer',
      cell: ({ row }) => row.original.customer?.name ?? '—',
    },
    {
      accessorKey: 'service_package.name',
      header: 'Package',
      cell: ({ row }) => row.original.service_package?.name ?? '—',
    },
    {
      accessorKey: 'points_remaining',
      header: 'Balance',
      cell: ({ row }) => (
        <span className="font-semibold text-primary">
          {row.original.points_remaining} / {row.original.points_allocated}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => {
        const s = getValue() as CustomerPackage['status']
        return <Badge variant={packageStatusVariant(s)}>{packageStatusLabel(s)}</Badge>
      },
    },
    {
      accessorKey: 'purchased_at',
      header: 'Purchased',
      cell: ({ getValue }) => formatDate(String(getValue())),
    },
  ]

  const ledgerColumns: ColumnDef<PointTransaction>[] = [
    {
      accessorKey: 'created_at',
      header: 'When',
      cell: ({ getValue }) => (getValue() ? formatDate(String(getValue())) : '—'),
    },
    {
      accessorKey: 'customer.name',
      header: 'Customer',
      cell: ({ row }) => row.original.customer?.name ?? '—',
    },
    { accessorKey: 'type_label', header: 'Type' },
    {
      accessorKey: 'points',
      header: 'Points',
      cell: ({ getValue }) => {
        const v = Number(getValue())
        return <span className={cn('font-medium', v >= 0 ? 'text-green-600' : 'text-destructive')}>{v > 0 ? `+${v}` : v}</span>
      },
    },
    {
      accessorKey: 'balance_after',
      header: 'Balance After',
      cell: ({ getValue }) => getValue() as number,
    },
    {
      accessorKey: 'description',
      header: 'Details',
      cell: ({ getValue }) => <span className="text-sm text-muted-foreground">{String(getValue() ?? '')}</span>,
    },
  ]

  const packageSelectOptions = useMemo(
    () => (activePackages ?? []).map((p) => ({ value: p.id, label: `${p.name} (${p.points_included} pts)` })),
    [activePackages]
  )

  if (catalogLoading && tab === 'catalog') return <PageLoader />

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Packages & Points' }]} />

      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight">Packages & Points</h1>
          <p className="text-muted-foreground">Create packages, sell to customers, track point balance & history</p>
        </div>
        <div className="flex shrink-0 flex-nowrap items-center gap-1.5 overflow-x-auto">
          {hasPermission('customer-packages.purchase') && (
            <Button type="button" variant="outline" onClick={() => setPurchaseOpen(true)}>
              <ShoppingBag className="mr-2 h-4 w-4" />
              Sell Package
            </Button>
          )}
          {hasPermission('customer-packages.consume') && (
            <Button type="button" variant="outline" onClick={() => setConsumeOpen(true)}>
              <Minus className="mr-2 h-4 w-4" />
              Consume Points
            </Button>
          )}
          {hasPermission('customer-packages.allocate') && (
            <Button type="button" variant="outline" onClick={() => setAllocateOpen(true)}>
              <Coins className="mr-2 h-4 w-4" />
              Allocate Points
            </Button>
          )}
          {hasPermission('service-packages.create') && tab === 'catalog' && (
            <Button type="button" onClick={() => { setEditing(null); setFormOpen(true) }}>
              <Plus className="mr-2 h-4 w-4" />
              New Package
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Active Packages" value={stats?.total ?? 0} icon={Package} />
        <StatCard title="Inactive" value={stats?.inactive ?? 0} icon={Gift} />
        <StatCard title="Module" value="Points" icon={Coins} />
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex rounded-lg border border-border p-0.5">
            {(['catalog', 'purchases', 'ledger'] as Tab[]).map((t) => (
              <Button
                key={t}
                type="button"
                size="sm"
                variant={tab === t ? 'default' : 'ghost'}
                onClick={() => { setTab(t); setPage(1); setPurchasePage(1); setLedgerPage(1) }}
              >
                {t === 'catalog' && <Package className="mr-1 h-4 w-4" />}
                {t === 'purchases' && <ShoppingBag className="mr-1 h-4 w-4" />}
                {t === 'ledger' && <History className="mr-1 h-4 w-4" />}
                {t === 'catalog' ? 'Catalog' : t === 'purchases' ? 'Purchases' : 'Point Ledger'}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {tab === 'purchases' && (
              <Select
                options={[{ value: '', label: 'All statuses' }, ...PACKAGE_STATUS_OPTIONS.map((o) => ({ value: o.value, label: o.label }))]}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              />
            )}
            {(tab === 'catalog' || tab === 'purchases') && (
              <SearchInput value={search} onChange={setSearch} placeholder="Search…" className="w-48" />
            )}
          </div>
        </CardHeader>
        <CardContent>
          {tab === 'catalog' && (
            <>
              <DataTable columns={catalogColumns} data={catalogRows} />
              {catalogMeta && catalogMeta.last_page > 1 && (
                <Pagination currentPage={catalogMeta.current_page} totalPages={catalogMeta.last_page} onPageChange={setPage} className="mt-4" />
              )}
            </>
          )}
          {tab === 'purchases' && (
            purchasesLoading ? <PageLoader /> : (
              <>
                <DataTable columns={purchaseColumns} data={purchaseRows} />
                {purchaseMeta && purchaseMeta.last_page > 1 && (
                  <Pagination currentPage={purchaseMeta.current_page} totalPages={purchaseMeta.last_page} onPageChange={setPurchasePage} className="mt-4" />
                )}
              </>
            )
          )}
          {tab === 'ledger' && (
            ledgerLoading ? <PageLoader /> : (
              <>
                <DataTable columns={ledgerColumns} data={ledgerRows} />
                {ledgerMeta && ledgerMeta.last_page > 1 && (
                  <Pagination currentPage={ledgerMeta.current_page} totalPages={ledgerMeta.last_page} onPageChange={setLedgerPage} className="mt-4" />
                )}
              </>
            )
          )}
        </CardContent>
      </Card>

      <Modal open={formOpen} onOpenChange={(o) => !o && closeForm()} title={editing ? 'Edit Package' : 'New Package'} className="max-w-2xl">
        <Form onSubmit={submitForm}>
          <div className="space-y-4">
            {formError && <p className="text-sm text-destructive">{formError}</p>}
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
              <Input label="Price (AED)" type="number" min={0} step="0.01" value={form.price || ''} onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))} required />
              <Input label="Points included" type="number" min={1} value={form.points_included || ''} onChange={(e) => setForm((f) => ({ ...f, points_included: Number(e.target.value) }))} required />
              <Input label="Validity (days)" type="number" min={1} value={form.validity_days ?? ''} onChange={(e) => setForm((f) => ({ ...f, validity_days: e.target.value ? Number(e.target.value) : null }))} />
              <Input label="VAT % (optional)" type="number" min={0} value={form.vat_rate ?? 0} onChange={(e) => setForm((f) => ({ ...f, vat_rate: Number(e.target.value) }))} />
              <div className="flex items-end pb-2">
                <Checkbox label="Price includes VAT" checked={form.vat_inclusive} onChange={(e) => setForm((f) => ({ ...f, vat_inclusive: e.target.checked }))} />
              </div>
            </div>
            <Textarea label="Description" value={form.description ?? ''} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={2} />
            <div>
              <p className="mb-2 text-sm font-medium">Redeemable services (point cost)</p>
              <div className="space-y-2">
                {itemRows.map((row, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Select
                      className="flex-1"
                      options={serviceOptions}
                      placeholder="Service"
                      value={row.service_id}
                      onChange={(e) => setItemRows((rows) => rows.map((r, i) => (i === idx ? { ...r, service_id: e.target.value } : r)))}
                    />
                    <Input
                      className="w-28"
                      type="number"
                      min={1}
                      placeholder="Pts"
                      value={row.points_cost}
                      onChange={(e) => setItemRows((rows) => rows.map((r, i) => (i === idx ? { ...r, points_cost: e.target.value } : r)))}
                    />
                    <Button type="button" variant="ghost" size="sm" onClick={() => setItemRows((rows) => rows.filter((_, i) => i !== idx))}>×</Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => setItemRows((rows) => [...rows, { service_id: '', points_cost: '' }])}>
                  Add service
                </Button>
              </div>
            </div>
            <Checkbox label="Active" checked={form.is_active} onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))} />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={closeForm}>Cancel</Button>
              <Button type="submit" loading={createMutation.isPending || updateMutation.isPending}>{editing ? 'Update' : 'Create'}</Button>
            </div>
          </div>
        </Form>
      </Modal>

      <Modal open={purchaseOpen} onOpenChange={(o) => !o && closePurchase()} title="Sell Package" className="max-w-lg">
        <Form onSubmit={async (e) => {
          e.preventDefault()
          setFormError(null)
          if (!purchasePackageId) { setFormError('Select a package.'); return }
          const customerId = await resolveCustomer(picker, setPicker)
          if (!customerId) return
          purchaseMutation.mutate({ customer_id: customerId, service_package_id: Number(purchasePackageId), notes: purchaseNotes || undefined })
        }}>
          <div className="space-y-4">
            {formError && <p className="text-sm text-destructive">{formError}</p>}
            {renderCustomerBlock(picker, setPicker)}
            <Select options={packageSelectOptions} placeholder="Select package" value={purchasePackageId} onChange={(e) => setPurchasePackageId(e.target.value)} />
            <Textarea value={purchaseNotes} onChange={(e) => setPurchaseNotes(e.target.value)} placeholder="Notes (optional)" rows={2} />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={closePurchase}>Cancel</Button>
              <Button type="submit" loading={purchaseMutation.isPending || registerMutation.isPending}>Complete Purchase</Button>
            </div>
          </div>
        </Form>
      </Modal>

      <Modal open={consumeOpen} onOpenChange={(o) => !o && closeConsume()} title="Consume Points" className="max-w-lg">
        <Form onSubmit={async (e) => {
          e.preventDefault()
          setFormError(null)
          if (!consumeServiceId) { setFormError('Select a service.'); return }
          const customerId = await resolveCustomer(consumePicker, setConsumePicker)
          if (!customerId) return
          consumeMutation.mutate({
            customer_id: customerId,
            customer_package_id: consumePackageId ? Number(consumePackageId) : undefined,
            service_id: Number(consumeServiceId),
            points: consumePoints ? Number(consumePoints) : undefined,
            description: consumeDescription || undefined,
          })
        }}>
          <div className="space-y-4">
            {formError && <p className="text-sm text-destructive">{formError}</p>}
            {renderCustomerBlock(consumePicker, setConsumePicker)}
            <Select options={[{ value: '', label: 'Auto (FIFO oldest package)' }, ...purchaseRows.filter((p) => p.status === 'active').map((p) => ({ value: p.id, label: `${p.code} — ${p.points_remaining} pts left` }))]} value={consumePackageId} onChange={(e) => setConsumePackageId(e.target.value)} />
            <Select options={serviceOptions} placeholder="Service to redeem" value={consumeServiceId} onChange={(e) => setConsumeServiceId(e.target.value)} />
            <Input label="Points (optional if defined on package)" type="number" min={1} value={consumePoints} onChange={(e) => setConsumePoints(e.target.value)} />
            <Textarea value={consumeDescription} onChange={(e) => setConsumeDescription(e.target.value)} placeholder="Description" rows={2} />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={closeConsume}>Cancel</Button>
              <Button type="submit" loading={consumeMutation.isPending || registerMutation.isPending}>Consume</Button>
            </div>
          </div>
        </Form>
      </Modal>

      <Modal open={allocateOpen} onOpenChange={(o) => !o && closeAllocate()} title="Allocate Bonus Points" className="max-w-lg">
        <Form onSubmit={async (e) => {
          e.preventDefault()
          setFormError(null)
          if (!allocatePackageId || !allocatePoints) { setFormError('Package and points are required.'); return }
          const customerId = await resolveCustomer(allocatePicker, setAllocatePicker)
          if (!customerId) return
          allocateMutation.mutate({
            customer_id: customerId,
            customer_package_id: Number(allocatePackageId),
            points: Number(allocatePoints),
            description: allocateDescription || undefined,
          })
        }}>
          <div className="space-y-4">
            {formError && <p className="text-sm text-destructive">{formError}</p>}
            {renderCustomerBlock(allocatePicker, setAllocatePicker)}
            <Select options={purchaseRows.filter((p) => p.status === 'active').map((p) => ({ value: p.id, label: `${p.code} — ${p.customer?.name}` }))} placeholder="Customer package" value={allocatePackageId} onChange={(e) => setAllocatePackageId(e.target.value)} />
            <Input label="Points to add" type="number" min={1} value={allocatePoints} onChange={(e) => setAllocatePoints(e.target.value)} required />
            <Textarea value={allocateDescription} onChange={(e) => setAllocateDescription(e.target.value)} placeholder="Reason" rows={2} />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={closeAllocate}>Cancel</Button>
              <Button type="submit" loading={allocateMutation.isPending || registerMutation.isPending}>Allocate</Button>
            </div>
          </div>
        </Form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        title="Delete package?"
        description={`Remove ${deleteTarget?.name}? Existing customer purchases will be kept.`}
        confirmLabel="Delete"
        loading={deleteMutation.isPending}
      />
    </div>
  )
}
