import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { type ColumnDef } from '@tanstack/react-table'
import { MessageSquareQuote, Pencil, Plus, Trash2 } from 'lucide-react'
import {
  Badge,
  Breadcrumb,
  Button,
  Card,
  CardContent,
  Checkbox,
  ConfirmDialog,
  DataTable,
  Form,
  Input,
  Modal,
  PageLoader,
  Pagination,
  Textarea,
} from '@/components'
import { usePermission } from '@/hooks/usePermission'
import {
  testimonialService,
  type Testimonial,
  type TestimonialPayload,
} from '@/services/testimonialService'

function extractError(err: unknown): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const res = (err as { response?: { data?: { message?: string } } }).response
    return res?.data?.message ?? 'Something went wrong.'
  }
  return 'Something went wrong.'
}

const emptyForm = (): TestimonialPayload => ({
  quote: '',
  name: '',
  role: '',
  sort_order: 0,
  is_active: true,
})

export default function TestimonialsPage() {
  const queryClient = useQueryClient()
  const { hasPermission } = usePermission()
  const canManage = hasPermission('testimonials.manage')

  const [page, setPage] = useState(1)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null)
  const [form, setForm] = useState<TestimonialPayload>(emptyForm())
  const [formError, setFormError] = useState<string | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['testimonials', page],
    queryFn: () => testimonialService.list({ page, per_page: 15 }),
  })

  const rows = useMemo(() => {
    if (!data) return []
    if (Array.isArray(data)) return data
    return data.data
  }, [data])

  const meta = !data || Array.isArray(data) ? null : data.meta

  const createMutation = useMutation({
    mutationFn: testimonialService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] })
      queryClient.invalidateQueries({ queryKey: ['public-testimonials'] })
      closeForm()
    },
    onError: (err) => setFormError(extractError(err)),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<TestimonialPayload> }) =>
      testimonialService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] })
      queryClient.invalidateQueries({ queryKey: ['public-testimonials'] })
      closeForm()
    },
    onError: (err) => setFormError(extractError(err)),
  })

  const deleteMutation = useMutation({
    mutationFn: testimonialService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] })
      queryClient.invalidateQueries({ queryKey: ['public-testimonials'] })
      setDeleteTarget(null)
    },
    onError: (err) => setFormError(extractError(err)),
  })

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm())
    setFormError(null)
    setFormOpen(true)
  }

  const openEdit = (row: Testimonial) => {
    setEditing(row)
    setForm({
      quote: row.quote,
      name: row.name,
      role: row.role ?? '',
      sort_order: row.sort_order,
      is_active: row.is_active,
    })
    setFormError(null)
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditing(null)
    setFormError(null)
  }

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault()
    if (editing) {
      updateMutation.mutate({ id: editing.id, payload: form })
    } else {
      createMutation.mutate(form)
    }
  }

  const columns: ColumnDef<Testimonial, unknown>[] = useMemo(
    () => [
      { accessorKey: 'sort_order', header: '#' },
      {
        accessorKey: 'quote',
        header: 'Quote',
        cell: ({ getValue }) => (
          <span className="line-clamp-2 max-w-md text-sm">{String(getValue() ?? '')}</span>
        ),
      },
      { accessorKey: 'name', header: 'Client' },
      {
        accessorKey: 'role',
        header: 'Role',
        cell: ({ getValue }) => getValue() || '—',
      },
      {
        accessorKey: 'is_active',
        header: 'Status',
        cell: ({ getValue }) => (
          <Badge variant={getValue() ? 'success' : 'warning'}>{getValue() ? 'Active' : 'Hidden'}</Badge>
        ),
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) =>
          canManage ? (
            <div className="flex justify-end gap-1">
              <Button type="button" variant="ghost" size="sm" onClick={() => openEdit(row.original)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive"
                onClick={() => setDeleteTarget(row.original)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ) : null,
      },
    ],
    [canManage],
  )

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Testimonials' }]} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manage Testimonials</h1>
          <p className="text-sm text-muted-foreground">
            Client quotes shown in the &ldquo;What Our Clients Say&rdquo; section on the public homepage.
          </p>
        </div>
        {canManage && (
          <Button type="button" onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Testimonial
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <PageLoader />
            </div>
          ) : rows.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <MessageSquareQuote className="h-10 w-10 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">No testimonials yet. Add your first client quote.</p>
              {canManage && (
                <Button type="button" size="sm" onClick={openCreate}>
                  Add Testimonial
                </Button>
              )}
            </div>
          ) : (
            <>
              <DataTable columns={columns} data={rows} />
              {meta && meta.last_page > 1 && (
                <Pagination currentPage={meta.current_page} totalPages={meta.last_page} onPageChange={setPage} />
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Modal
        open={formOpen}
        onOpenChange={(open) => !open && closeForm()}
        title={editing ? 'Edit Testimonial' : 'Add Testimonial'}
        className="max-w-2xl"
      >
        <Form onSubmit={submitForm} className="space-y-4">
          {formError && <p className="text-sm text-destructive">{formError}</p>}
          <Textarea
            label="Quote"
            value={form.quote}
            onChange={(e) => setForm({ ...form, quote: e.target.value })}
            rows={4}
            required
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Client Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <Input
              label="Role / Label"
              value={form.role ?? ''}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              placeholder="e.g. Regular Client"
            />
            <Input
              label="Sort Order"
              type="number"
              value={form.sort_order ?? 0}
              onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
            />
            <div className="flex items-end">
              <Checkbox
                label="Active on website"
                checked={form.is_active ?? true}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={closeForm}>
              Cancel
            </Button>
            <Button type="submit" loading={createMutation.isPending || updateMutation.isPending}>
              {editing ? 'Save Changes' : 'Create Testimonial'}
            </Button>
          </div>
        </Form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Testimonial"
        description={`Delete testimonial from "${deleteTarget?.name}"?`}
        loading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
      />
    </div>
  )
}
