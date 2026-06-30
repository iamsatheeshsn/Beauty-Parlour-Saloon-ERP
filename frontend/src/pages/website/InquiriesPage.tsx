import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { type ColumnDef } from '@tanstack/react-table'
import { Eye, Inbox, Mail, Trash2 } from 'lucide-react'
import {
  Badge,
  Breadcrumb,
  Button,
  Card,
  CardContent,
  ConfirmDialog,
  DataTable,
  Modal,
  PageLoader,
  Pagination,
  SearchInput,
  Select,
} from '@/components'
import { StatCard } from '@/components/dashboard/StatCard'
import { useDebounce } from '@/hooks/useDebounce'
import { usePermission } from '@/hooks/usePermission'
import {
  INQUIRY_STATUS_OPTIONS,
  INQUIRY_TYPE_OPTIONS,
  inquiryStatusLabel,
  inquiryStatusVariant,
  inquiryTypeLabel,
  websiteInquiryService,
  type WebsiteInquiry,
  type WebsiteInquiryStatus,
} from '@/services/websiteInquiryService'
import { formatDate } from '@/utils/format'

function extractError(err: unknown): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const res = (err as { response?: { data?: { message?: string } } }).response
    return res?.data?.message ?? 'Something went wrong.'
  }
  return 'Something went wrong.'
}

export default function InquiriesPage() {
  const queryClient = useQueryClient()
  const { hasPermission } = usePermission()

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const debouncedSearch = useDebounce(search, 300)

  const [viewTarget, setViewTarget] = useState<WebsiteInquiry | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<WebsiteInquiry | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const canManage = hasPermission('website-inquiries.manage')

  const { data: stats } = useQuery({
    queryKey: ['website-inquiry-stats'],
    queryFn: () => websiteInquiryService.stats(),
  })

  const { data, isLoading } = useQuery({
    queryKey: ['website-inquiries', page, debouncedSearch, typeFilter, statusFilter],
    queryFn: () =>
      websiteInquiryService.list({
        page,
        per_page: 15,
        search: debouncedSearch || undefined,
        type: typeFilter || undefined,
        status: statusFilter || undefined,
      }),
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: WebsiteInquiryStatus }) =>
      websiteInquiryService.updateStatus(id, status),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['website-inquiries'] })
      queryClient.invalidateQueries({ queryKey: ['website-inquiry-stats'] })
      setViewTarget(updated)
      setFormError(null)
    },
    onError: (err) => setFormError(extractError(err)),
  })

  const deleteMutation = useMutation({
    mutationFn: websiteInquiryService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website-inquiries'] })
      queryClient.invalidateQueries({ queryKey: ['website-inquiry-stats'] })
      setDeleteTarget(null)
      setViewTarget(null)
    },
    onError: (err) => setFormError(extractError(err)),
  })

  const openInquiry = (row: WebsiteInquiry) => {
    setFormError(null)
    setViewTarget(row)
    if (canManage && row.status === 'new') {
      statusMutation.mutate({ id: row.id, status: 'read' })
    }
  }

  const columns: ColumnDef<WebsiteInquiry, unknown>[] = useMemo(
    () => [
      { accessorKey: 'code', header: 'Reference' },
      {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ getValue }) => inquiryTypeLabel(getValue() as WebsiteInquiry['type']),
      },
      { accessorKey: 'name', header: 'Name' },
      {
        id: 'contact',
        header: 'Contact',
        cell: ({ row }) => row.original.phone || row.original.email || '—',
      },
      {
        accessorKey: 'subject',
        header: 'Subject',
        cell: ({ row }) => row.original.subject || row.original.product_name || '—',
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ getValue }) => (
          <Badge variant={inquiryStatusVariant(getValue() as WebsiteInquiryStatus)}>
            {inquiryStatusLabel(getValue() as WebsiteInquiryStatus)}
          </Badge>
        ),
      },
      {
        accessorKey: 'created_at',
        header: 'Received',
        cell: ({ getValue }) => formatDate(String(getValue() ?? '')),
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <div className="flex justify-end gap-1">
            <Button type="button" variant="ghost" size="sm" onClick={() => openInquiry(row.original)}>
              <Eye className="h-4 w-4" />
            </Button>
            {canManage && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive"
                onClick={() => setDeleteTarget(row.original)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ),
      },
    ],
    [canManage],
  )

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Website Inquiries' }]} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Website Inquiries</h1>
          <p className="text-sm text-muted-foreground">
            Product inquiries and general messages submitted from the public website.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="New Inquiries" value={stats?.new_count ?? 0} icon={Inbox} />
        <StatCard title="Total Listed" value={data?.meta?.total ?? 0} icon={Mail} />
      </div>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <SearchInput
              value={search}
              onChange={(value) => {
                setSearch(value)
                setPage(1)
              }}
              placeholder="Search name, email, product, reference..."
              className="lg:max-w-sm"
            />
            <Select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value)
                setPage(1)
              }}
              options={[{ value: '', label: 'All types' }, ...INQUIRY_TYPE_OPTIONS.map((o) => ({ value: o.value, label: o.label }))]}
              className="lg:w-44"
            />
            <Select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setPage(1)
              }}
              options={[{ value: '', label: 'All statuses' }, ...INQUIRY_STATUS_OPTIONS.map((o) => ({ value: o.value, label: o.label }))]}
              className="lg:w-44"
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <PageLoader />
            </div>
          ) : (
            <>
              <DataTable columns={columns} data={data?.data ?? []} />
              {data?.meta && data.meta.last_page > 1 && (
                <Pagination
                  currentPage={data.meta.current_page}
                  totalPages={data.meta.last_page}
                  onPageChange={setPage}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Modal
        open={Boolean(viewTarget)}
        onOpenChange={(open) => !open && setViewTarget(null)}
        title={viewTarget ? `Inquiry ${viewTarget.code}` : 'Inquiry'}
        className="max-w-2xl"
      >
        {viewTarget && (
          <div className="space-y-4">
            {formError && <p className="text-sm text-destructive">{formError}</p>}
            <div className="grid gap-3 sm:grid-cols-2 text-sm">
              <div>
                <p className="text-muted-foreground">Type</p>
                <p className="font-medium">{inquiryTypeLabel(viewTarget.type)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Status</p>
                <Badge variant={inquiryStatusVariant(viewTarget.status)}>
                  {inquiryStatusLabel(viewTarget.status)}
                </Badge>
              </div>
              <div>
                <p className="text-muted-foreground">Name</p>
                <p className="font-medium">{viewTarget.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Received</p>
                <p className="font-medium">{formatDate(viewTarget.created_at ?? '')}</p>
              </div>
              {viewTarget.phone && (
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <p className="font-medium">{viewTarget.phone}</p>
                </div>
              )}
              {viewTarget.email && (
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{viewTarget.email}</p>
                </div>
              )}
              {viewTarget.product_name && (
                <div className="sm:col-span-2">
                  <p className="text-muted-foreground">Product</p>
                  <p className="font-medium">{viewTarget.product_name}</p>
                </div>
              )}
              {viewTarget.subject && (
                <div className="sm:col-span-2">
                  <p className="text-muted-foreground">Subject</p>
                  <p className="font-medium">{viewTarget.subject}</p>
                </div>
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Message</p>
              <p className="mt-1 whitespace-pre-wrap rounded-lg border border-border bg-muted/20 p-4 text-sm">
                {viewTarget.message}
              </p>
            </div>
            {canManage && (
              <div className="flex flex-wrap gap-2 border-t border-border pt-4">
                {INQUIRY_STATUS_OPTIONS.map((option) => (
                  <Button
                    key={option.value}
                    type="button"
                    size="sm"
                    variant={viewTarget.status === option.value ? 'default' : 'outline'}
                    loading={statusMutation.isPending}
                    onClick={() =>
                      statusMutation.mutate({
                        id: viewTarget.id,
                        status: option.value as WebsiteInquiryStatus,
                      })
                    }
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Inquiry"
        description={`Delete inquiry ${deleteTarget?.code}? This cannot be undone.`}
        loading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
      />
    </div>
  )
}
