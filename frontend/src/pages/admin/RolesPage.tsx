import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { type ColumnDef } from '@tanstack/react-table'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { AccessControlTabs } from '@/components/admin/AccessControlTabs'
import { PermissionPicker } from '@/components/admin/PermissionPicker'
import {
  Badge,
  Breadcrumb,
  Button,
  ConfirmDialog,
  DataTable,
  Input,
  Modal,
  PageLoader,
} from '@/components'
import { ROLE_LABELS } from '@/constants/roles'
import { usePermission } from '@/hooks/usePermission'
import { roleService, type AppRole } from '@/services/adminService'

const SYSTEM_ROLES = ['owner', 'admin', 'receptionist', 'staff']

export default function RolesPage() {
  const queryClient = useQueryClient()
  const { hasPermission } = usePermission()
  const [editRole, setEditRole] = useState<AppRole | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [newRoleName, setNewRoleName] = useState('')
  const [selectedPerms, setSelectedPerms] = useState<string[]>([])
  const [deleteTarget, setDeleteTarget] = useState<AppRole | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const { data: roles, isLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: roleService.list,
  })

  const { data: permissions } = useQuery({
    queryKey: ['permissions'],
    queryFn: roleService.permissions,
  })

  const allPermissionNames = useMemo(
    () => (permissions ?? []).map((p) => p.name).sort(),
    [permissions]
  )

  const updateMutation = useMutation({
    mutationFn: ({ id, permissions: perms }: { id: number; permissions: string[] }) =>
      roleService.update(id, { permissions: perms }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      setEditRole(null)
      setFormError(null)
    },
    onError: (err: unknown) => setFormError(extractError(err)),
  })

  const createMutation = useMutation({
    mutationFn: roleService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      setCreateOpen(false)
      setNewRoleName('')
      setSelectedPerms([])
    },
    onError: (err: unknown) => setFormError(extractError(err)),
  })

  const deleteMutation = useMutation({
    mutationFn: roleService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      setDeleteTarget(null)
    },
  })

  const openEdit = (role: AppRole) => {
    setFormError(null)
    setEditRole(role)
    setSelectedPerms(role.permissions ?? [])
  }

  const columns: ColumnDef<AppRole, unknown>[] = [
    {
      accessorKey: 'name',
      header: 'Role',
      cell: ({ getValue }) => ROLE_LABELS[getValue() as keyof typeof ROLE_LABELS] ?? String(getValue()),
    },
    {
      id: 'type',
      header: 'Type',
      cell: ({ row }) => (
        <Badge variant={SYSTEM_ROLES.includes(row.original.name) ? 'default' : 'success'}>
          {SYSTEM_ROLES.includes(row.original.name) ? 'System' : 'Custom'}
        </Badge>
      ),
    },
    {
      id: 'perms',
      header: 'Permissions',
      cell: ({ row }) => row.original.permissions?.length ?? 0,
    },
    ...(hasPermission('roles.manage')
      ? [{
          id: 'actions',
          header: 'Actions',
          cell: ({ row }: { row: { original: AppRole } }) => (
            <div className="flex gap-1">
              {row.original.name !== 'owner' && (
                <>
                  <Button variant="ghost" size="icon" onClick={() => openEdit(row.original)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  {!SYSTEM_ROLES.includes(row.original.name) && (
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setDeleteTarget(row.original)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </>
              )}
            </div>
          ),
        }]
      : []),
  ]

  if (isLoading) return <PageLoader />

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Access Control' }, { label: 'Roles' }]} />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold">Roles & Permissions</h1>
          <p className="mt-1 text-sm text-muted-foreground">Configure access control for your team</p>
        </div>
        {hasPermission('roles.manage') && (
          <Button onClick={() => { setCreateOpen(true); setSelectedPerms([]); setNewRoleName(''); setFormError(null) }}>
            <Plus className="h-4 w-4" /> Add Role
          </Button>
        )}
      </div>

      <AccessControlTabs />

      <DataTable columns={columns} data={roles ?? []} />

      <Modal
        open={Boolean(editRole)}
        onOpenChange={(o) => !o && setEditRole(null)}
        title={`Edit Role: ${editRole?.name ?? ''}`}
        description="Grant or revoke permissions grouped by module."
        className="max-w-3xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setEditRole(null)}>Cancel</Button>
            <Button loading={updateMutation.isPending} onClick={() => editRole && updateMutation.mutate({ id: editRole.id, permissions: selectedPerms })}>
              Save Permissions
            </Button>
          </>
        }
      >
        {formError && <div className="mb-4 text-sm text-destructive">{formError}</div>}
        <PermissionPicker
          permissions={allPermissionNames}
          selected={selectedPerms}
          onChange={setSelectedPerms}
        />
      </Modal>

      <Modal
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Create Role"
        description="Define a custom role and assign permissions."
        className="max-w-3xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button
              loading={createMutation.isPending}
              onClick={() => createMutation.mutate({ name: newRoleName, permissions: selectedPerms })}
              disabled={!newRoleName.trim()}
            >
              Create
            </Button>
          </>
        }
      >
        {formError && <div className="mb-4 text-sm text-destructive">{formError}</div>}
        <Input label="Role Name" value={newRoleName} onChange={(e) => setNewRoleName(e.target.value)} className="mb-4" />
        <PermissionPicker
          permissions={allPermissionNames}
          selected={selectedPerms}
          onChange={setSelectedPerms}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete Role"
        description={`Delete role "${deleteTarget?.name}"?`}
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
