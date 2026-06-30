import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query'
import { type ColumnDef } from '@tanstack/react-table'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
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
} from '@/components'
import { useDebounce } from '@/hooks/useDebounce'
import { usePermission } from '@/hooks/usePermission'
import { branchService, departmentService, staffDesignationService } from '@/services/masterService'
import { roleService, userService, type AppUser, type UserPayload } from '@/services/adminService'
import { isPaginated } from '@/utils/master'
import { ROLE_LABELS, type Role } from '@/constants/roles'

const ROLE_OPTIONS = (Object.keys(ROLE_LABELS) as Role[]).map((r) => ({
  value: r,
  label: ROLE_LABELS[r],
}))

export default function UsersPage() {
  const queryClient = useQueryClient()
  const { hasPermission } = usePermission()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<AppUser | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AppUser | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<UserPayload & { password?: string }>()

  const [branchesQ, departmentsQ, designationsQ, rolesQ] = useQueries({
    queries: [
      { queryKey: ['branches-options'], queryFn: () => branchService.list({ all: true }) },
      { queryKey: ['departments-options'], queryFn: () => departmentService.list({ all: true }) },
      { queryKey: ['designations-options'], queryFn: () => staffDesignationService.list({ all: true }) },
      { queryKey: ['roles-options'], queryFn: () => roleService.list() },
    ],
  })

  const { data, isLoading, isError } = useQuery({
    queryKey: ['users', page, debouncedSearch],
    queryFn: () => userService.list({ page, per_page: 15, search: debouncedSearch || undefined }),
  })

  const listData = useMemo(() => {
    if (!data) return { rows: [] as AppUser[], meta: null }
    if (isPaginated<AppUser>(data)) return { rows: data.data, meta: data.meta }
    return { rows: data as AppUser[], meta: null }
  }, [data])

  const createMutation = useMutation({
    mutationFn: userService.create,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['users'] }); closeModal() },
    onError: (err: unknown) => setFormError(extractError(err)),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<UserPayload> }) => userService.update(id, payload),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['users'] }); closeModal() },
    onError: (err: unknown) => setFormError(err instanceof Error ? extractError(err) : 'Error'),
  })

  const deleteMutation = useMutation({
    mutationFn: userService.remove,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['users'] }); setDeleteTarget(null) },
  })

  const toOptions = (raw: unknown, labelKey = 'name') => {
    const items = Array.isArray(raw) ? raw : []
    return items.map((i) => ({ value: i.id as number, label: String(i[labelKey as keyof typeof i] ?? '') }))
  }

  const roleOptions = (Array.isArray(rolesQ.data) ? rolesQ.data : []).map((r) => ({
    value: r.name,
    label: ROLE_LABELS[r.name] ?? r.name,
  }))

  const openCreate = () => {
    setEditing(null)
    setFormError(null)
    reset({ is_active: true, role: 'staff' })
    setModalOpen(true)
  }

  const openEdit = (row: AppUser) => {
    setEditing(row)
    setFormError(null)
    reset({
      name: row.name,
      email: row.email,
      phone: row.phone,
      employee_code: row.employee_code,
      branch_id: row.branch_id,
      department_id: row.department_id,
      staff_designation_id: row.staff_designation_id,
      role: row.role ?? row.roles?.[0] ?? 'staff',
      is_active: row.is_active,
    })
    setModalOpen(true)
  }

  const closeModal = () => { setModalOpen(false); setEditing(null); setFormError(null) }

  const onSubmit = (values: UserPayload & { password?: string }) => {
    setFormError(null)
    const payload = { ...values }
    if (editing && !payload.password) delete payload.password
    if (editing) {
      updateMutation.mutate({ id: editing.id, payload })
    } else {
      if (!payload.password) {
        setFormError('Password is required for new users.')
        return
      }
      createMutation.mutate(payload)
    }
  }

  const columns: ColumnDef<AppUser, unknown>[] = [
    { accessorKey: 'employee_code', header: 'Code' },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
    {
      id: 'role',
      header: 'Role',
      cell: ({ row }) => ROLE_LABELS[(row.original.role ?? row.original.roles?.[0] ?? '') as Role] ?? row.original.role,
    },
    {
      accessorKey: 'is_active',
      header: 'Status',
      cell: ({ getValue }) => (
        <Badge variant={getValue() ? 'success' : 'warning'}>{getValue() ? 'Active' : 'Inactive'}</Badge>
      ),
    },
    ...(hasPermission('users.update') || hasPermission('users.delete')
      ? [{
          id: 'actions',
          header: 'Actions',
          cell: ({ row }: { row: { original: AppUser } }) => (
            <div className="flex gap-1">
              {hasPermission('users.update') && (
                <Button variant="ghost" size="icon" onClick={() => openEdit(row.original)}><Pencil className="h-4 w-4" /></Button>
              )}
              {hasPermission('users.delete') && (
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setDeleteTarget(row.original)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ),
        }]
      : []),
  ]

  useEffect(() => setPage(1), [debouncedSearch])

  if (isLoading && !data) return <PageLoader />

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Users' }]} />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold">Users</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage staff accounts and access</p>
        </div>
        {hasPermission('users.create') && (
          <Button onClick={openCreate}><Plus className="h-4 w-4" /> Add User</Button>
        )}
      </div>

      <SearchInput value={search} onChange={setSearch} placeholder="Search users..." className="max-w-sm" />

      {isError ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">Failed to load users.</div>
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
        title={editing ? 'Edit User' : 'Add User'}
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
            <Input label="Name" {...register('name', { required: true })} />
            <Input label="Email" type="email" {...register('email', { required: true })} />
            <Input label={editing ? 'Password (leave blank to keep)' : 'Password'} type="password" {...register('password', { required: !editing })} />
            <Input label="Phone" {...register('phone')} />
            <Input label="Employee Code" {...register('employee_code')} />
            <Select label="Role" options={roleOptions.length ? roleOptions : ROLE_OPTIONS} {...register('role', { required: true })} />
            <Select label="Branch" options={toOptions(branchesQ.data)} placeholder="Select branch" {...register('branch_id')} />
            <Select label="Department" options={toOptions(departmentsQ.data)} placeholder="Select department" {...register('department_id')} />
            <Select label="Designation" options={toOptions(designationsQ.data)} placeholder="Select designation" {...register('staff_designation_id')} />
            <Checkbox label="Active" {...register('is_active')} />
          </div>
        </Form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete User"
        description={`Delete ${deleteTarget?.name}?`}
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
