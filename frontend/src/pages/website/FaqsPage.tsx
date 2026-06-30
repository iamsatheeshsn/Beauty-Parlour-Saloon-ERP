import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { type ColumnDef } from '@tanstack/react-table'
import { CircleHelp, Pencil, Plus, Trash2 } from 'lucide-react'
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
import { faqService, type Faq, type FaqPayload } from '@/services/faqService'

function extractError(err: unknown): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const res = (err as { response?: { data?: { message?: string } } }).response
    return res?.data?.message ?? 'Something went wrong.'
  }
  return 'Something went wrong.'
}

const emptyForm = (): FaqPayload => ({
  question: '',
  answer: '',
  sort_order: 0,
  is_active: true,
})

export default function FaqsPage() {
  const queryClient = useQueryClient()
  const { hasPermission } = usePermission()
  const canManage = hasPermission('faqs.manage')

  const [page, setPage] = useState(1)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Faq | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Faq | null>(null)
  const [form, setForm] = useState<FaqPayload>(emptyForm())
  const [formError, setFormError] = useState<string | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['faqs', page],
    queryFn: () => faqService.list({ page, per_page: 15 }),
  })

  const rows = useMemo(() => {
    if (!data) return []
    if (Array.isArray(data)) return data
    return data.data
  }, [data])

  const meta = !data || Array.isArray(data) ? null : data.meta

  const createMutation = useMutation({
    mutationFn: faqService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] })
      queryClient.invalidateQueries({ queryKey: ['public-faqs'] })
      closeForm()
    },
    onError: (err) => setFormError(extractError(err)),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<FaqPayload> }) =>
      faqService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] })
      queryClient.invalidateQueries({ queryKey: ['public-faqs'] })
      closeForm()
    },
    onError: (err) => setFormError(extractError(err)),
  })

  const deleteMutation = useMutation({
    mutationFn: faqService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] })
      queryClient.invalidateQueries({ queryKey: ['public-faqs'] })
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

  const openEdit = (row: Faq) => {
    setEditing(row)
    setForm({
      question: row.question,
      answer: row.answer,
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

  const columns: ColumnDef<Faq, unknown>[] = useMemo(
    () => [
      { accessorKey: 'sort_order', header: '#', cell: ({ getValue }) => getValue() },
      { accessorKey: 'question', header: 'Question' },
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
        cell: ({ row }) => (
          <div className="flex justify-end gap-1">
            {canManage && (
              <>
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
              </>
            )}
          </div>
        ),
      },
    ],
    [canManage],
  )

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'FAQ' }]} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">FAQ</h1>
          <p className="text-sm text-muted-foreground">
            Manage frequently asked questions on the public website.
          </p>
        </div>
        {canManage && (
          <Button type="button" onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add FAQ
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
              <CircleHelp className="h-10 w-10 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">No FAQs yet.</p>
              {canManage && (
                <Button type="button" size="sm" onClick={openCreate}>
                  Add FAQ
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
        title={editing ? 'Edit FAQ' : 'Add FAQ'}
        className="max-w-2xl"
      >
        <Form onSubmit={submitForm} className="space-y-4">
          {formError && <p className="text-sm text-destructive">{formError}</p>}
          <Input
            label="Question"
            value={form.question}
            onChange={(e) => setForm({ ...form, question: e.target.value })}
            required
          />
          <Textarea
            label="Answer"
            value={form.answer}
            onChange={(e) => setForm({ ...form, answer: e.target.value })}
            rows={4}
            required
          />
          <div className="grid gap-4 sm:grid-cols-2">
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
              {editing ? 'Save Changes' : 'Create FAQ'}
            </Button>
          </div>
        </Form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete FAQ"
        description={`Delete "${deleteTarget?.question}"?`}
        loading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
      />
    </div>
  )
}
