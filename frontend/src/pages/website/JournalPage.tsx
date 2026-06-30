import { useMemo, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { type ColumnDef } from '@tanstack/react-table'
import { BookOpen, Camera, Image, Pencil, Plus, Trash2 } from 'lucide-react'
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
import { blogPostService, type BlogPost, type BlogPostPayload } from '@/services/blogPostService'

function extractError(err: unknown): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const res = (err as { response?: { data?: { message?: string } } }).response
    return res?.data?.message ?? 'Something went wrong.'
  }
  return 'Something went wrong.'
}

const emptyForm = (): BlogPostPayload & { tagsText: string } => ({
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  author_name: '',
  category: '',
  tagsText: '',
  is_published: false,
  sort_order: 0,
})

export default function JournalPage() {
  const queryClient = useQueryClient()
  const { hasPermission } = usePermission()
  const canManage = hasPermission('blog-posts.manage')

  const [page, setPage] = useState(1)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<BlogPost | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null)
  const [form, setForm] = useState(emptyForm())
  const [featuredImageUrl, setFeaturedImageUrl] = useState<string | null>(null)
  const featuredImageRef = useRef<HTMLInputElement>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['blog-posts', page],
    queryFn: () => blogPostService.list({ page, per_page: 15 }),
  })

  const rows = useMemo(() => data?.data ?? [], [data])
  const meta = data?.meta ?? null

  const createMutation = useMutation({
    mutationFn: (payload: BlogPostPayload) => blogPostService.create(payload),
    onSuccess: (post) => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] })
      setEditing(post)
    },
    onError: (err) => setFormError(extractError(err)),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<BlogPostPayload> }) =>
      blogPostService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] })
      closeForm()
    },
    onError: (err) => setFormError(extractError(err)),
  })

  const deleteMutation = useMutation({
    mutationFn: blogPostService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] })
      setDeleteTarget(null)
    },
    onError: (err) => setFormError(extractError(err)),
  })

  const imageUploadMutation = useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) =>
      blogPostService.uploadFeaturedImage(id, file),
    onSuccess: (post) => {
      setFeaturedImageUrl(post.featured_image_url ?? null)
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] })
    },
    onError: (err) => setFormError(extractError(err)),
  })

  const imageDeleteMutation = useMutation({
    mutationFn: (id: number) => blogPostService.deleteFeaturedImage(id),
    onSuccess: () => {
      setFeaturedImageUrl(null)
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] })
    },
    onError: (err) => setFormError(extractError(err)),
  })

  const openCreate = () => {
    setEditing(null)
    setFeaturedImageUrl(null)
    setForm(emptyForm())
    setFormError(null)
    setFormOpen(true)
  }

  const openEdit = (row: BlogPost) => {
    setEditing(row)
    setFeaturedImageUrl(row.featured_image_url ?? null)
    setForm({
      title: row.title,
      slug: row.slug,
      excerpt: row.excerpt ?? '',
      content: row.content,
      author_name: row.author_name ?? '',
      category: row.category ?? '',
      tagsText: (row.tags ?? []).join(', '),
      is_published: row.is_published,
      published_at: row.published_at ?? null,
      sort_order: row.sort_order,
    })
    setFormError(null)
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditing(null)
    setFeaturedImageUrl(null)
    setFormError(null)
  }

  const buildPayload = (): BlogPostPayload => {
    const tags = form.tagsText
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    return {
      title: form.title,
      slug: form.slug || undefined,
      excerpt: form.excerpt || null,
      content: form.content,
      author_name: form.author_name || null,
      category: form.category || null,
      tags,
      is_published: form.is_published,
      sort_order: form.sort_order,
    }
  }

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = buildPayload()
    if (editing) {
      updateMutation.mutate({ id: editing.id, payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  const columns: ColumnDef<BlogPost, unknown>[] = useMemo(
    () => [
      {
        id: 'preview',
        header: 'Image',
        cell: ({ row }) =>
          row.original.featured_image_url ? (
            <img src={row.original.featured_image_url} alt="" className="h-12 w-20 rounded object-cover" />
          ) : (
            <div className="flex h-12 w-20 items-center justify-center rounded bg-muted">
              <Image className="h-4 w-4 text-muted-foreground" />
            </div>
          ),
      },
      { accessorKey: 'title', header: 'Title' },
      { accessorKey: 'category', header: 'Category' },
      {
        accessorKey: 'is_published',
        header: 'Status',
        cell: ({ getValue }) => (
          <Badge variant={getValue() ? 'success' : 'warning'}>
            {getValue() ? 'Published' : 'Draft'}
          </Badge>
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

  const activePost = editing

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Journal' }]} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Journal</h1>
          <p className="text-sm text-muted-foreground">
            Manage blog posts shown on the public website journal page.
          </p>
        </div>
        {canManage && (
          <Button type="button" onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            New Post
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
              <BookOpen className="h-10 w-10 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">No journal posts yet.</p>
              {canManage && (
                <Button type="button" size="sm" onClick={openCreate}>
                  New Post
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
        title={editing ? 'Edit Journal Post' : 'New Journal Post'}
        className="max-w-3xl"
      >
        <Form onSubmit={submitForm} className="space-y-4">
          {formError && <p className="text-sm text-destructive">{formError}</p>}
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="sm:col-span-2"
            />
            <Input
              label="Slug"
              value={form.slug ?? ''}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              placeholder="auto-generated from title if empty"
              className="sm:col-span-2"
            />
            <Textarea
              label="Excerpt"
              value={form.excerpt ?? ''}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              rows={2}
              className="sm:col-span-2"
            />
            <Textarea
              label="Content (HTML)"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={8}
              required
              className="sm:col-span-2 font-mono text-sm"
            />
            <Input
              label="Author"
              value={form.author_name ?? ''}
              onChange={(e) => setForm({ ...form, author_name: e.target.value })}
            />
            <Input
              label="Category"
              value={form.category ?? ''}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
            <Input
              label="Tags"
              value={form.tagsText}
              onChange={(e) => setForm({ ...form, tagsText: e.target.value })}
              placeholder="summer, hair, skincare"
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
                label="Published on website"
                checked={form.is_published ?? false}
                onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
              />
            </div>
          </div>

          {activePost && canManage && (
            <div className="rounded-xl border border-border bg-muted/20 p-4">
              <p className="text-sm font-semibold text-foreground">Featured Image</p>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative h-28 w-48 shrink-0 overflow-hidden rounded-lg border border-border bg-muted/40">
                  {featuredImageUrl ? (
                    <img src={featuredImageUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      <Image className="h-8 w-8 opacity-40" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => featuredImageRef.current?.click()}
                    className="absolute bottom-1 right-1 rounded-full bg-primary p-1.5 text-primary-foreground shadow"
                    title="Upload featured image"
                  >
                    <Camera className="h-3.5 w-3.5" />
                  </button>
                  <input
                    ref={featuredImageRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file && activePost) imageUploadMutation.mutate({ id: activePost.id, file })
                      e.target.value = ''
                    }}
                  />
                </div>
                {featuredImageUrl && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-destructive"
                    loading={imageDeleteMutation.isPending}
                    onClick={() => imageDeleteMutation.mutate(activePost.id)}
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
              {editing ? 'Save Changes' : 'Create Post'}
            </Button>
          </div>
        </Form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Post"
        description={`Delete "${deleteTarget?.title}"?`}
        loading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
      />
    </div>
  )
}
