import { useMemo, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { type ColumnDef } from '@tanstack/react-table'
import { Camera, Image, Images, Pencil, Plus, Trash2 } from 'lucide-react'
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
} from '@/components'
import { usePermission } from '@/hooks/usePermission'
import {
  galleryItemService,
  type GalleryItem,
  type GalleryItemPayload,
} from '@/services/galleryItemService'

function extractError(err: unknown): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const res = (err as { response?: { data?: { message?: string } } }).response
    return res?.data?.message ?? 'Something went wrong.'
  }
  return 'Something went wrong.'
}

const emptyForm = (): GalleryItemPayload => ({
  title: '',
  alt_text: '',
  sort_order: 0,
  is_active: true,
})

export default function GalleryPage() {
  const queryClient = useQueryClient()
  const { hasPermission } = usePermission()
  const canManage = hasPermission('gallery-items.manage')

  const [page, setPage] = useState(1)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<GalleryItem | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null)
  const [form, setForm] = useState<GalleryItemPayload>(emptyForm())
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const imageRef = useRef<HTMLInputElement>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['gallery-items', page],
    queryFn: () => galleryItemService.list({ page, per_page: 15 }),
  })

  const rows = useMemo(() => {
    if (!data) return []
    if (Array.isArray(data)) return data
    return data.data
  }, [data])

  const meta = !data || Array.isArray(data) ? null : data.meta

  const createMutation = useMutation({
    mutationFn: galleryItemService.create,
    onSuccess: (item) => {
      queryClient.invalidateQueries({ queryKey: ['gallery-items'] })
      queryClient.invalidateQueries({ queryKey: ['public-gallery'] })
      setEditing(item)
    },
    onError: (err) => setFormError(extractError(err)),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<GalleryItemPayload> }) =>
      galleryItemService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-items'] })
      queryClient.invalidateQueries({ queryKey: ['public-gallery'] })
      closeForm()
    },
    onError: (err) => setFormError(extractError(err)),
  })

  const deleteMutation = useMutation({
    mutationFn: galleryItemService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-items'] })
      queryClient.invalidateQueries({ queryKey: ['public-gallery'] })
      setDeleteTarget(null)
    },
    onError: (err) => setFormError(extractError(err)),
  })

  const imageUploadMutation = useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) => galleryItemService.uploadImage(id, file),
    onSuccess: (item) => {
      setImageUrl(item.image_url ?? null)
      queryClient.invalidateQueries({ queryKey: ['gallery-items'] })
      queryClient.invalidateQueries({ queryKey: ['public-gallery'] })
    },
    onError: (err) => setFormError(extractError(err)),
  })

  const imageDeleteMutation = useMutation({
    mutationFn: (id: number) => galleryItemService.deleteImage(id),
    onSuccess: () => {
      setImageUrl(null)
      queryClient.invalidateQueries({ queryKey: ['gallery-items'] })
      queryClient.invalidateQueries({ queryKey: ['public-gallery'] })
    },
    onError: (err) => setFormError(extractError(err)),
  })

  const openCreate = () => {
    setEditing(null)
    setImageUrl(null)
    setForm(emptyForm())
    setFormError(null)
    setFormOpen(true)
  }

  const openEdit = (row: GalleryItem) => {
    setEditing(row)
    setImageUrl(row.image_url ?? null)
    setForm({
      title: row.title ?? '',
      alt_text: row.alt_text ?? '',
      sort_order: row.sort_order,
      is_active: row.is_active,
    })
    setFormError(null)
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditing(null)
    setImageUrl(null)
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

  const columns: ColumnDef<GalleryItem, unknown>[] = useMemo(
    () => [
      { accessorKey: 'sort_order', header: '#', cell: ({ getValue }) => getValue() },
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
      { accessorKey: 'alt_text', header: 'Alt Text' },
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

  const activeItem = editing

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Gallery' }]} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gallery</h1>
          <p className="text-sm text-muted-foreground">
            Manage images shown in the homepage gallery section.
          </p>
        </div>
        {canManage && (
          <Button type="button" onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Image
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
              <Images className="h-10 w-10 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">No gallery images yet.</p>
              {canManage && (
                <Button type="button" size="sm" onClick={openCreate}>
                  Add Image
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
        title={editing ? 'Edit Gallery Image' : 'Add Gallery Image'}
        className="max-w-2xl"
      >
        <Form onSubmit={submitForm} className="space-y-4">
          {formError && <p className="text-sm text-destructive">{formError}</p>}
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Title"
              value={form.title ?? ''}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="sm:col-span-2"
            />
            <Input
              label="Alt Text"
              value={form.alt_text ?? ''}
              onChange={(e) => setForm({ ...form, alt_text: e.target.value })}
              className="sm:col-span-2"
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

          {activeItem && canManage && (
            <div className="rounded-xl border border-border bg-muted/20 p-4">
              <p className="text-sm font-semibold text-foreground">Gallery Image</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Upload the photo shown in the masonry gallery.</p>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative h-28 w-48 shrink-0 overflow-hidden rounded-lg border border-border bg-muted/40">
                  {imageUrl ? (
                    <img src={imageUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      <Image className="h-8 w-8 opacity-40" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => imageRef.current?.click()}
                    className="absolute bottom-1 right-1 rounded-full bg-primary p-1.5 text-primary-foreground shadow"
                    title="Upload image"
                  >
                    <Camera className="h-3.5 w-3.5" />
                  </button>
                  <input
                    ref={imageRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file && activeItem) imageUploadMutation.mutate({ id: activeItem.id, file })
                      e.target.value = ''
                    }}
                  />
                </div>
                {imageUrl && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-destructive"
                    loading={imageDeleteMutation.isPending}
                    onClick={() => imageDeleteMutation.mutate(activeItem.id)}
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
              {editing ? 'Save Changes' : 'Create & Upload Image'}
            </Button>
          </div>
        </Form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Gallery Image"
        description={`Delete "${deleteTarget?.title || 'this image'}"?`}
        loading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
      />
    </div>
  )
}
