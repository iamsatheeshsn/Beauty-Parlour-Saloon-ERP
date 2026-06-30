import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query'
import { type ColumnDef } from '@tanstack/react-table'
import { Eye, LayoutDashboard, Plus, Trash2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import {
  Badge,
  Breadcrumb,
  Button,
  ConfirmDialog,
  DataTable,
  Form,
  Input,
  Modal,
  PageLoader,
  Pagination,
  SearchInput,
  Select,
  buttonVariants,
} from '@/components'
import { useDebounce } from '@/hooks/useDebounce'
import { usePermission } from '@/hooks/usePermission'
import { branchService, departmentService, staffDesignationService } from '@/services/masterService'
import { staffService, type StaffMember, type StaffPayload } from '@/services/staffService'
import { ROLE_LABELS, type Role } from '@/constants/roles'
import { isPaginated } from '@/utils/master'

const ROLE_OPTIONS = (Object.keys(ROLE_LABELS) as Role[]).map((r) => ({
  value: r,
  label: ROLE_LABELS[r],
}))

export default function StaffPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { hasPermission } = usePermission()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<StaffMember | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<StaffPayload>()

  const [branchesQ, departmentsQ, designationsQ] = useQueries({
    queries: [
      { queryKey: ['branches-options'], queryFn: () => branchService.list({ all: true }) },
      { queryKey: ['departments-options'], queryFn: () => departmentService.list({ all: true }) },
      { queryKey: ['designations-options'], queryFn: () => staffDesignationService.list({ all: true }) },
    ],
  })

  const { data, isLoading, isError } = useQuery({
    queryKey: ['staff', page, debouncedSearch],
    queryFn: () => staffService.list({ page, per_page: 15, search: debouncedSearch || undefined }),
  })

  const listData = useMemo(() => {
    if (!data) return { rows: [] as StaffMember[], meta: null }
    if (isPaginated<StaffMember>(data)) return { rows: data.data, meta: data.meta }
    return { rows: data as StaffMember[], meta: null }
  }, [data])

  const createMutation = useMutation({
    mutationFn: staffService.create,
    onSuccess: (staff) => {
      queryClient.invalidateQueries({ queryKey: ['staff'] })
      setModalOpen(false)
      navigate(`/staff/${staff.id}`)
    },
    onError: (err: unknown) => setFormError(extractError(err)),
  })

  const deleteMutation = useMutation({
    mutationFn: staffService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] })
      setDeleteTarget(null)
    },
  })

  const toOptions = (raw: unknown) => {
    const items = Array.isArray(raw) ? raw : []
    return items.map((i) => ({ value: i.id as number, label: String((i as { name: string }).name ?? '') }))
  }

  const openCreate = () => {
    setFormError(null)
    reset({ is_active: true, role: 'staff', password: '' })
    setModalOpen(true)
  }

  const columns: ColumnDef<StaffMember, unknown>[] = [
    { accessorKey: 'employee_code', header: 'Code' },
    { accessorKey: 'name', header: 'Name' },
    {
      id: 'role',
      header: 'Role',
      cell: ({ row }) => ROLE_LABELS[(row.original.role ?? row.original.roles?.[0] ?? '') as Role] ?? '—',
    },
    {
      accessorKey: 'branch',
      header: 'Branch',
      cell: ({ row }) => row.original.branch?.name ?? '—',
    },
    { accessorKey: 'phone', header: 'Phone' },
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
            to={`/staff/${row.original.id}`}
            title="View profile"
            className={buttonVariants({ variant: 'ghost', size: 'icon' })}
          >
            <Eye className="h-4 w-4" />
          </Link>
          {hasPermission('staff.delete') && (
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
      <Breadcrumb items={[{ label: 'Staff', href: '/staff' }, { label: 'Directory' }]} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold">Staff Directory</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage employees, HR records, and payroll</p>
        </div>
        <div className="flex gap-2">
          <Link to="/staff" className={buttonVariants({ variant: 'outline' })}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
          {hasPermission('staff.create') && (
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" />
              Add Staff
            </Button>
          )}
        </div>
      </div>

      <SearchInput value={search} onChange={setSearch} placeholder="Search by name, code, email..." className="max-w-md" />

      {isError ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          Failed to load staff.
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

      <Modal
        open={modalOpen}
        onOpenChange={(o) => !o && setModalOpen(false)}
        title="Add Staff Member"
        className="max-w-2xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button loading={isSubmitting || createMutation.isPending} onClick={handleSubmit((v) => createMutation.mutate(v))}>
              Create
            </Button>
          </>
        }
      >
        {formError && (
          <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {formError}
          </div>
        )}
        <Form onSubmit={handleSubmit((v) => createMutation.mutate(v))}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Name" {...register('name', { required: true })} />
            <Input label="Email" type="email" {...register('email', { required: true })} />
            <Input label="Password" type="password" {...register('password', { required: true })} />
            <Input label="Phone" {...register('phone')} />
            <Input label="Employee Code" {...register('employee_code')} />
            <Select label="Role" options={ROLE_OPTIONS} {...register('role', { required: true })} />
            <Select label="Branch" options={toOptions(branchesQ.data)} placeholder="Select branch" {...register('branch_id')} />
            <Select label="Department" options={toOptions(departmentsQ.data)} placeholder="Select department" {...register('department_id')} />
            <Select label="Designation" options={toOptions(designationsQ.data)} placeholder="Select designation" {...register('staff_designation_id')} />
            <Input label="Joining Date" type="date" {...register('joining_date')} />
          </div>
        </Form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete Staff"
        description={`Delete ${deleteTarget?.name}? This removes their account and HR records.`}
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
