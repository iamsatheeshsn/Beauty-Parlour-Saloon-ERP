import { useEffect, useMemo, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { type ColumnDef } from '@tanstack/react-table'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Pencil, Plus, Scissors, Trash2, Archive, Camera } from 'lucide-react'
import {
  Badge,
  Breadcrumb,
  Button,
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
  buttonVariants,
} from '@/components'
import { StatCard } from '@/components/dashboard/StatCard'
import { useDebounce } from '@/hooks/useDebounce'
import { usePermission } from '@/hooks/usePermission'
import { useAppSettings } from '@/contexts/SettingsContext'
import { serviceCategoryService } from '@/services/masterService'
import {
  formatDuration,
  salonServiceApi,
  type SalonServiceItem,
  type SalonServicePayload,
} from '@/services/salonServiceApi'
import { formatCurrency } from '@/utils/format'
import { isPaginated } from '@/utils/master'

const DURATION_PRESETS = [
  { value: 15, label: '15 min' },
  { value: 30, label: '30 min' },
  { value: 45, label: '45 min' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' },
  { value: 180, label: '3 hours' },
]

export default function ServicesPage() {
  const queryClient = useQueryClient()
  const { hasPermission } = usePermission()
  const { settings } = useAppSettings()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const debouncedSearch = useDebounce(search, 300)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<SalonServiceItem | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<SalonServiceItem | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [serviceImageUrl, setServiceImageUrl] = useState<string | null>(null)
  const serviceImageRef = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, reset, watch, setValue, formState: { isSubmitting } } = useForm<SalonServicePayload & { duration_preset?: string }>()

  const { data: categories } = useQuery({
    queryKey: ['service-categories-options'],
    queryFn: () => serviceCategoryService.list({ all: true }),
  })

  const { data: stats } = useQuery({
    queryKey: ['services-stats'],
    queryFn: () => salonServiceApi.stats(),
  })

  const { data, isLoading, isError } = useQuery({
    queryKey: ['services', page, debouncedSearch, categoryFilter, statusFilter],
    queryFn: () =>
      salonServiceApi.list({
        page,
        per_page: 15,
        search: debouncedSearch || undefined,
        service_category_id: categoryFilter ? Number(categoryFilter) : undefined,
        is_active: statusFilter === '' ? undefined : statusFilter === 'active',
      }),
  })

  const listData = useMemo(() => {
    if (!data) return { rows: [] as SalonServiceItem[], meta: null }
    if (isPaginated<SalonServiceItem>(data)) return { rows: data.data, meta: data.meta }
    return { rows: data as SalonServiceItem[], meta: null }
  }, [data])

  const categoryOptions = (Array.isArray(categories) ? categories : [])
    .filter((c: { parent_id?: number | null }) => !c.parent_id)
    .map((c: { id: number; name: string }) => ({ value: c.id, label: c.name }))

  const createMutation = useMutation({
    mutationFn: salonServiceApi.create,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['services'] }); queryClient.invalidateQueries({ queryKey: ['services-stats'] }); closeModal() },
    onError: (err: unknown) => setFormError(extractError(err)),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<SalonServicePayload> }) => salonServiceApi.update(id, payload),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['services'] }); queryClient.invalidateQueries({ queryKey: ['services-stats'] }); closeModal() },
    onError: (err: unknown) => setFormError(extractError(err)),
  })

  const deleteMutation = useMutation({
    mutationFn: salonServiceApi.remove,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['services'] }); queryClient.invalidateQueries({ queryKey: ['services-stats'] }); setDeleteTarget(null) },
  })

  const imageUploadMutation = useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) => salonServiceApi.uploadImage(id, file),
    onSuccess: (service) => {
      setServiceImageUrl(service.image_url ?? null)
      queryClient.invalidateQueries({ queryKey: ['services'] })
      queryClient.invalidateQueries({ queryKey: ['public-services'] })
    },
    onError: (err: unknown) => setFormError(extractError(err)),
  })

  const imageDeleteMutation = useMutation({
    mutationFn: (id: number) => salonServiceApi.deleteImage(id),
    onSuccess: () => {
      setServiceImageUrl(null)
      queryClient.invalidateQueries({ queryKey: ['services'] })
      queryClient.invalidateQueries({ queryKey: ['public-services'] })
    },
    onError: (err: unknown) => setFormError(extractError(err)),
  })

  const openCreate = () => {
    setEditing(null)
    setFormError(null)
    setServiceImageUrl(null)
    reset({
      duration_minutes: 60,
      duration_preset: '60',
      price: 0,
      vat_rate: 0,
      vat_inclusive: false,
      commission_rate: 15,
      commission_type: 'percentage',
      is_active: true,
    })
    setModalOpen(true)
  }

  const openEdit = (row: SalonServiceItem) => {
    setEditing(row)
    setFormError(null)
    setServiceImageUrl(row.image_url ?? null)
    reset({
      name: row.name,
      service_category_id: row.service_category_id,
      description: row.description,
      duration_minutes: row.duration_minutes,
      duration_preset: String(row.duration_minutes),
      price: row.price,
      vat_rate: row.vat_rate,
      vat_inclusive: row.vat_inclusive,
      commission_rate: row.commission_rate,
      commission_type: row.commission_type,
      is_active: row.is_active,
      sort_order: row.sort_order,
    })
    setModalOpen(true)
  }

  const closeModal = () => { setModalOpen(false); setEditing(null); setFormError(null); setServiceImageUrl(null) }

  const onSubmit = (values: SalonServicePayload & { duration_preset?: string }) => {
    setFormError(null)
    const { duration_preset, ...payload } = values
    if (duration_preset) payload.duration_minutes = Number(duration_preset)
    if (editing) {
      updateMutation.mutate({ id: editing.id, payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  const columns: ColumnDef<SalonServiceItem, unknown>[] = [
    { accessorKey: 'code', header: 'Code' },
    { accessorKey: 'name', header: 'Service' },
    {
      id: 'category',
      header: 'Category',
      cell: ({ row }) => row.original.category?.name ?? '—',
    },
    {
      accessorKey: 'duration_minutes',
      header: 'Duration',
      cell: ({ getValue }) => formatDuration(getValue() as number),
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: ({ row }) => (
        <div>
          <span>{formatCurrency(row.original.price, settings.currency)}</span>
          {row.original.vat_inclusive && <span className="ml-1 text-xs text-muted-foreground">(incl. VAT)</span>}
        </div>
      ),
    },
    {
      accessorKey: 'total_price',
      header: 'Total',
      cell: ({ row }) => formatCurrency(row.original.total_price, settings.currency),
    },
    {
      accessorKey: 'commission_rate',
      header: 'Commission',
      cell: ({ row }) => (row.original.commission_rate != null ? `${row.original.commission_rate}%` : '—'),
    },
    {
      accessorKey: 'is_active',
      header: 'Status',
      cell: ({ getValue }) => (
        <Badge variant={getValue() ? 'success' : 'warning'}>{getValue() ? 'Active' : 'Inactive'}</Badge>
      ),
    },
    ...(hasPermission('services.update') || hasPermission('services.delete')
      ? [{
          id: 'actions',
          header: 'Actions',
          cell: ({ row }: { row: { original: SalonServiceItem } }) => (
            <div className="flex gap-1">
              {hasPermission('services.update') && (
                <Button variant="ghost" size="icon" onClick={() => openEdit(row.original)}><Pencil className="h-4 w-4" /></Button>
              )}
              {hasPermission('services.delete') && (
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setDeleteTarget(row.original)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ),
        }]
      : []),
  ]

  useEffect(() => setPage(1), [debouncedSearch, categoryFilter, statusFilter])

  if (isLoading && !data) return <PageLoader />

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Services' }]} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold">Service Catalog</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage salon services, pricing, VAT, and commission</p>
        </div>
        <div className="flex gap-2">
          <Link to="/masters/service-categories" className={buttonVariants({ variant: 'outline' })}>
            Categories
          </Link>
          {hasPermission('services.create') && (
            <Button onClick={openCreate}><Plus className="h-4 w-4" /> Add Service</Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard title="Active Services" value={stats?.total ?? 0} icon={Scissors} />
        <StatCard title="Inactive" value={stats?.inactive ?? 0} icon={Archive} gradient="from-amber-600 via-amber-500 to-amber-400" />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchInput value={search} onChange={setSearch} placeholder="Search services..." className="max-w-sm" />
        <Select
          options={[{ value: '', label: 'All categories' }, ...categoryOptions]}
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="max-w-xs"
        />
        <Select
          options={[
            { value: '', label: 'All statuses' },
            { value: 'active', label: 'Active only' },
            { value: 'inactive', label: 'Inactive only' },
          ]}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="max-w-xs"
        />
      </div>

      {isError ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">Failed to load services.</div>
      ) : (
        <>
          <DataTable columns={columns} data={listData.rows} />
          {listData.meta && listData.meta.last_page > 1 && (
            <Pagination currentPage={listData.meta.current_page} totalPages={listData.meta.last_page} onPageChange={setPage} />
          )}
        </>
      )}

      <Modal
        open={modalOpen}
        onOpenChange={(o) => !o && closeModal()}
        title={editing ? 'Edit Service' : 'Add Service'}
        className="max-w-2xl"
        footer={
          <>
            <Button variant="outline" onClick={closeModal}>Cancel</Button>
            <Button loading={isSubmitting || createMutation.isPending || updateMutation.isPending} onClick={handleSubmit(onSubmit)}>
              {editing ? 'Update' : 'Create'}
            </Button>
          </>
        }
      >
        {formError && <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{formError}</div>}
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Service Name" {...register('name', { required: true })} />
            <Select label="Category" options={categoryOptions} placeholder="Select category" {...register('service_category_id')} />
            <Select
              label="Duration"
              options={DURATION_PRESETS}
              value={watch('duration_preset') ?? '60'}
              onChange={(e) => {
                setValue('duration_preset', e.target.value)
                setValue('duration_minutes', Number(e.target.value))
              }}
            />
            <Input label="Price (AED)" type="number" step="0.01" min="0" {...register('price', { required: true, valueAsNumber: true })} />
            <Input label="VAT Rate % (optional)" type="number" step="0.01" {...register('vat_rate', { valueAsNumber: true })} />
            <Input label="Commission (%)" type="number" step="0.01" {...register('commission_rate', { valueAsNumber: true })} />
            <Input label="Sort Order" type="number" {...register('sort_order', { valueAsNumber: true })} />
            <div className="sm:col-span-2 flex flex-wrap gap-6">
              <Checkbox label="Price includes VAT" {...register('vat_inclusive')} />
              <Checkbox label="Active" {...register('is_active')} />
            </div>
            <div className="sm:col-span-2">
              <Textarea label="Description" {...register('description')} />
            </div>
            {editing && hasPermission('services.update') && (
              <div className="sm:col-span-2 rounded-xl border border-border bg-muted/20 p-4">
                <p className="text-sm font-semibold text-foreground">Service Image</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Shown on the public website services grid.</p>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="relative h-28 w-40 shrink-0 overflow-hidden rounded-lg border border-border bg-muted/40">
                    {serviceImageUrl ? (
                      <img src={serviceImageUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted-foreground">
                        <Scissors className="h-8 w-8 opacity-40" />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => serviceImageRef.current?.click()}
                      className="absolute bottom-1 right-1 rounded-full bg-primary p-1.5 text-primary-foreground shadow"
                      title="Upload service image"
                    >
                      <Camera className="h-3.5 w-3.5" />
                    </button>
                    <input
                      ref={serviceImageRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file && editing) imageUploadMutation.mutate({ id: editing.id, file })
                        e.target.value = ''
                      }}
                    />
                  </div>
                  {serviceImageUrl && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-destructive"
                      loading={imageDeleteMutation.isPending}
                      onClick={() => imageDeleteMutation.mutate(editing.id)}
                    >
                      Remove image
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </Form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete Service"
        description={`Delete "${deleteTarget?.name}"?`}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        loading={deleteMutation.isPending}
      />
    </div>
  )
}

function extractError(err: unknown): string {
  if (err && typeof err === 'object' && 'response' in err) {
    return (err as { response?: { data?: { message?: string } } }).response?.data?.message ?? 'An error occurred'
  }
  return 'An error occurred'
}
