import { useMemo, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { type ColumnDef } from '@tanstack/react-table'
import { Camera, Image, Pencil, Plus, Trash2 } from 'lucide-react'
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
  homepageSlideService,
  type HomepageSlide,
  type HomepageSlidePayload,
} from '@/services/homepageSlideService'

function extractError(err: unknown): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const res = (err as { response?: { data?: { message?: string } } }).response
    return res?.data?.message ?? 'Something went wrong.'
  }
  return 'Something went wrong.'
}

const emptyForm = (): HomepageSlidePayload => ({
  eyebrow: '',
  title: '',
  subtitle: '',
  cta_text: 'Book Appointment',
  cta_link: '/contact',
  secondary_cta_text: 'Explore Services',
  secondary_cta_link: '/our-services',
  sort_order: 0,
  is_active: true,
})

export default function HomepageSlidesPage() {
  const queryClient = useQueryClient()
  const { hasPermission } = usePermission()
  const canManage = hasPermission('homepage-slides.manage')

  const [page, setPage] = useState(1)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<HomepageSlide | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<HomepageSlide | null>(null)
  const [form, setForm] = useState<HomepageSlidePayload>(emptyForm())
  const [slideImageUrl, setSlideImageUrl] = useState<string | null>(null)
  const slideImageRef = useRef<HTMLInputElement>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['homepage-slides', page],
    queryFn: () => homepageSlideService.list({ page, per_page: 15 }),
  })

  const rows = useMemo(() => {
    if (!data) return []
    if (Array.isArray(data)) return data
    return data.data
  }, [data])

  const meta = !data || Array.isArray(data) ? null : data.meta

  const createMutation = useMutation({
    mutationFn: homepageSlideService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homepage-slides'] })
      queryClient.invalidateQueries({ queryKey: ['public-homepage-slides'] })
      closeForm()
    },
    onError: (err) => setFormError(extractError(err)),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<HomepageSlidePayload> }) =>
      homepageSlideService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homepage-slides'] })
      queryClient.invalidateQueries({ queryKey: ['public-homepage-slides'] })
      closeForm()
    },
    onError: (err) => setFormError(extractError(err)),
  })

  const deleteMutation = useMutation({
    mutationFn: homepageSlideService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homepage-slides'] })
      queryClient.invalidateQueries({ queryKey: ['public-homepage-slides'] })
      setDeleteTarget(null)
    },
    onError: (err) => setFormError(extractError(err)),
  })

  const imageUploadMutation = useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) => homepageSlideService.uploadImage(id, file),
    onSuccess: (slide) => {
      setSlideImageUrl(slide.image_url ?? null)
      queryClient.invalidateQueries({ queryKey: ['homepage-slides'] })
      queryClient.invalidateQueries({ queryKey: ['public-homepage-slides'] })
    },
    onError: (err) => setFormError(extractError(err)),
  })

  const imageDeleteMutation = useMutation({
    mutationFn: (id: number) => homepageSlideService.deleteImage(id),
    onSuccess: () => {
      setSlideImageUrl(null)
      queryClient.invalidateQueries({ queryKey: ['homepage-slides'] })
      queryClient.invalidateQueries({ queryKey: ['public-homepage-slides'] })
    },
    onError: (err) => setFormError(extractError(err)),
  })

  const openCreate = () => {
    setEditing(null)
    setSlideImageUrl(null)
    setForm(emptyForm())
    setFormError(null)
    setFormOpen(true)
  }

  const openEdit = (row: HomepageSlide) => {
    setEditing(row)
    setSlideImageUrl(row.image_url ?? null)
    setForm({
      eyebrow: row.eyebrow ?? '',
      title: row.title,
      subtitle: row.subtitle ?? '',
      cta_text: row.cta_text ?? '',
      cta_link: row.cta_link ?? '',
      secondary_cta_text: row.secondary_cta_text ?? '',
      secondary_cta_link: row.secondary_cta_link ?? '',
      sort_order: row.sort_order,
      is_active: row.is_active,
    })
    setFormError(null)
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditing(null)
    setSlideImageUrl(null)
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

  const columns: ColumnDef<HomepageSlide, unknown>[] = useMemo(
    () => [
      {
        accessorKey: 'sort_order',
        header: '#',
        cell: ({ getValue }) => getValue(),
      },
      {
        id: 'preview',
        header: 'Image',
        cell: ({ row }) =>
          row.original.image_url ? (
            <img src={row.original.image_url} alt="" className="h-12 w-20 rounded object-cover" />
          ) : (
            <div className="flex h-12 w-20 items-center justify-center rounded bg-muted">
              <Image className="h-4 w-4 text-muted-foreground" />
            </div>
          ),
      },
      { accessorKey: 'title', header: 'Title' },
      { accessorKey: 'eyebrow', header: 'Eyebrow' },
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
      <Breadcrumb items={[{ label: 'Homepage Slides' }]} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Homepage Slides</h1>
          <p className="text-sm text-muted-foreground">
            Manage hero carousel content shown on the public website home page.
          </p>
        </div>
        {canManage && (
          <Button type="button" onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Slide
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <PageLoader />
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
        title={editing ? 'Edit Homepage Slide' : 'Add Homepage Slide'}
        className="max-w-2xl"
      >
        <Form onSubmit={submitForm} className="space-y-4">
          {formError && <p className="text-sm text-destructive">{formError}</p>}
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Eyebrow"
              value={form.eyebrow ?? ''}
              onChange={(e) => setForm({ ...form, eyebrow: e.target.value })}
              className="sm:col-span-2"
            />
            <Input
              label="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="sm:col-span-2"
            />
            <Textarea
              label="Subtitle"
              value={form.subtitle ?? ''}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              className="sm:col-span-2"
            />
            <Input
              label="Primary CTA Text"
              value={form.cta_text ?? ''}
              onChange={(e) => setForm({ ...form, cta_text: e.target.value })}
            />
            <Input
              label="Primary CTA Link"
              value={form.cta_link ?? ''}
              onChange={(e) => setForm({ ...form, cta_link: e.target.value })}
              placeholder="/contact"
            />
            <Input
              label="Secondary CTA Text"
              value={form.secondary_cta_text ?? ''}
              onChange={(e) => setForm({ ...form, secondary_cta_text: e.target.value })}
            />
            <Input
              label="Secondary CTA Link"
              value={form.secondary_cta_link ?? ''}
              onChange={(e) => setForm({ ...form, secondary_cta_link: e.target.value })}
              placeholder="/our-services"
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

          {editing && canManage && (
            <div className="rounded-xl border border-border bg-muted/20 p-4">
              <p className="text-sm font-semibold text-foreground">Slide Background Image</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Shown full-screen behind the hero text.</p>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative h-28 w-48 shrink-0 overflow-hidden rounded-lg border border-border bg-muted/40">
                  {slideImageUrl ? (
                    <img src={slideImageUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      <Image className="h-8 w-8 opacity-40" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => slideImageRef.current?.click()}
                    className="absolute bottom-1 right-1 rounded-full bg-primary p-1.5 text-primary-foreground shadow"
                    title="Upload slide image"
                  >
                    <Camera className="h-3.5 w-3.5" />
                  </button>
                  <input
                    ref={slideImageRef}
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
                {slideImageUrl && (
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

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={closeForm}>
              Cancel
            </Button>
            <Button type="submit" loading={createMutation.isPending || updateMutation.isPending}>
              {editing ? 'Save Changes' : 'Create Slide'}
            </Button>
          </div>
        </Form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Slide"
        description={`Delete "${deleteTarget?.title}"?`}
        loading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
      />
    </div>
  )
}
