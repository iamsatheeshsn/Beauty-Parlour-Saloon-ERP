import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { type ColumnDef } from '@tanstack/react-table'
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Badge,
  Breadcrumb,
  Button,
  buttonVariants,
  ConfirmDialog,
  DataTable,
  Pagination,
  SearchInput,
  PageLoader,
} from '@/components'
import { useDebounce } from '@/hooks/useDebounce'
import { usePermission } from '@/hooks/usePermission'
import { customerService, type Customer } from '@/services/customerService'
import { formatCurrency, formatDate } from '@/utils/format'
import { useAppSettings } from '@/contexts/SettingsContext'
import { isPaginated } from '@/utils/master'

export default function CustomersPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { hasPermission } = usePermission()
  const { settings } = useAppSettings()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['customers', page, debouncedSearch],
    queryFn: () => customerService.list({ page, per_page: 15, search: debouncedSearch || undefined }),
  })

  const listData = useMemo(() => {
    if (!data) return { rows: [] as Customer[], meta: null }
    if (isPaginated<Customer>(data)) return { rows: data.data, meta: data.meta }
    return { rows: data as Customer[], meta: null }
  }, [data])

  const deleteMutation = useMutation({
    mutationFn: customerService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      setDeleteTarget(null)
    },
  })

  const columns: ColumnDef<Customer, unknown>[] = [
    { accessorKey: 'code', header: 'Code' },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'phone', header: 'Mobile' },
    {
      accessorKey: 'total_visits',
      header: 'Visits',
      cell: ({ getValue }) => getValue() ?? 0,
    },
    {
      accessorKey: 'total_spent',
      header: 'Spent',
      cell: ({ getValue }) => formatCurrency(Number(getValue() ?? 0), settings.currency),
    },
    {
      accessorKey: 'last_visit_at',
      header: 'Last Visit',
      cell: ({ getValue }) => {
        const v = getValue() as string | null
        return v ? formatDate(v) : '—'
      },
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
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Link
            to={`/customers/${row.original.id}`}
            title="View profile"
            className={buttonVariants({ variant: 'ghost', size: 'icon' })}
          >
            <Eye className="h-4 w-4" />
          </Link>
          {hasPermission('customers.update') && (
            <Button variant="ghost" size="icon" onClick={() => navigate(`/customers/${row.original.id}`)}>
              <Pencil className="h-4 w-4" />
            </Button>
          )}
          {hasPermission('customers.delete') && (
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive"
              onClick={() => setDeleteTarget(row.original)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ]

  useEffect(() => setPage(1), [debouncedSearch])

  if (isLoading && !data) return <PageLoader />

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: 'Customers', href: '/customers' },
          { label: 'Directory' },
        ]}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold">Customer Directory</h1>
          <p className="mt-1 text-sm text-muted-foreground">Browse and manage all registered customers</p>
        </div>
        <div className="flex gap-2">
          <Link to="/customers" className={buttonVariants({ variant: 'outline' })}>
            Mobile Search
          </Link>
          {hasPermission('customers.create') && (
            <Link to="/customers" className={buttonVariants()}>
              <Plus className="h-4 w-4" />
              New Customer
            </Link>
          )}
        </div>
      </div>

      <SearchInput value={search} onChange={setSearch} placeholder="Search by name, phone, or code..." className="max-w-md" />

      {isError ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          Failed to load customers.
        </div>
      ) : (
        <>
          <DataTable columns={columns} data={listData.rows} />
          {listData.meta && listData.meta.last_page > 1 && (
            <Pagination
              currentPage={listData.meta.current_page}
              totalPages={listData.meta.last_page}
              onPageChange={setPage}
            />
          )}
        </>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete Customer"
        description={`Delete ${deleteTarget?.name}? This will remove their profile, notes, and visit history.`}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        loading={deleteMutation.isPending}
      />
    </div>
  )
}
