import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Lock, Save, ShieldCheck } from 'lucide-react'
import { AccessControlTabs } from '@/components/admin/AccessControlTabs'
import { PermissionPicker } from '@/components/admin/PermissionPicker'
import {
  Badge,
  Breadcrumb,
  Button,
  Card,
  CardContent,
  PageLoader,
} from '@/components'
import { ROLE_LABELS, type Role } from '@/constants/roles'
import { useAuth } from '@/contexts/AuthContext'
import { usePermission } from '@/hooks/usePermission'
import { roleService, type AppRole } from '@/services/adminService'
import { cn } from '@/utils/cn'

const SYSTEM_ROLES = ['owner', 'admin', 'receptionist', 'staff']

type MatrixState = Record<number, string[]>

function buildMatrix(roles: AppRole[]): MatrixState {
  return roles.reduce<MatrixState>((acc, role) => {
    acc[role.id] = [...(role.permissions ?? [])]
    return acc
  }, {})
}

function matricesEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false
  const sortedA = [...a].sort()
  const sortedB = [...b].sort()
  return sortedA.every((v, i) => v === sortedB[i])
}

export default function PermissionsMatrixPage() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const { hasPermission } = usePermission()
  const canManage = hasPermission('roles.manage')
  const isOwner = user?.roles?.includes('owner')

  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null)
  const [matrix, setMatrix] = useState<MatrixState>({})
  const [baseline, setBaseline] = useState<MatrixState>({})
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const { data: roles, isLoading: rolesLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: roleService.list,
  })

  const { data: permissionItems, isLoading: permsLoading } = useQuery({
    queryKey: ['permissions'],
    queryFn: roleService.permissions,
  })

  const allPermissions = useMemo(
    () => (permissionItems ?? []).map((p) => p.name).sort(),
    [permissionItems]
  )

  const sortedRoles = useMemo(() => {
    if (!roles) return []
    const system = SYSTEM_ROLES
      .map((name) => roles.find((r) => r.name === name))
      .filter((r): r is AppRole => Boolean(r))
    const custom = roles.filter((r) => !SYSTEM_ROLES.includes(r.name))
    return [...system, ...custom.sort((a, b) => a.name.localeCompare(b.name))]
  }, [roles])

  useEffect(() => {
    if (roles) {
      const next = buildMatrix(roles)
      setMatrix(next)
      setBaseline(next)
    }
  }, [roles])

  useEffect(() => {
    if (!sortedRoles.length) return
    if (selectedRoleId == null || !sortedRoles.some((r) => r.id === selectedRoleId)) {
      const preferred =
        sortedRoles.find((r) => r.name === 'admin') ??
        sortedRoles.find((r) => r.name !== 'owner') ??
        sortedRoles[0]
      setSelectedRoleId(preferred?.id ?? null)
    }
  }, [sortedRoles, selectedRoleId])

  const selectedRole = sortedRoles.find((r) => r.id === selectedRoleId)

  const dirtyRoleIds = useMemo(() => {
    if (!roles) return []
    return roles
      .filter((role) => !matricesEqual(matrix[role.id] ?? [], baseline[role.id] ?? []))
      .map((r) => r.id)
  }, [roles, matrix, baseline])

  const saveMutation = useMutation({
    mutationFn: async (roleIds: number[]) => {
      await Promise.all(
        roleIds.map((id) => roleService.update(id, { permissions: matrix[id] ?? [] }))
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      setBaseline({ ...matrix })
      setSaveSuccess(true)
      setSaveError(null)
      setTimeout(() => setSaveSuccess(false), 3000)
    },
    onError: (err: unknown) => {
      setSaveError(extractError(err))
      setSaveSuccess(false)
    },
  })

  const canEditRole = (roleName: string) => {
    if (!canManage) return false
    if (roleName === 'owner') return false
    if (SYSTEM_ROLES.includes(roleName) && !isOwner) return false
    return true
  }

  const resetChanges = () => {
    setMatrix({ ...baseline })
    setSaveError(null)
  }

  const selectedCount = selectedRoleId ? (matrix[selectedRoleId] ?? []).length : 0
  const selectedEditable = selectedRole ? canEditRole(selectedRole.name) : false
  const selectedDirty = selectedRoleId ? dirtyRoleIds.includes(selectedRoleId) : false

  if (rolesLoading || permsLoading) return <PageLoader />

  if (!sortedRoles.length) {
    return (
      <div className="space-y-5">
        <Breadcrumb items={[{ label: 'Access Control' }, { label: 'Permissions' }]} />
        <AccessControlTabs />
        <div className="rounded-xl border border-border bg-card px-6 py-12 text-center text-sm text-muted-foreground">
          No roles found. Configure roles first under Access Control → Roles.
        </div>
      </div>
    )
  }

  if (!allPermissions.length) {
    return (
      <div className="space-y-5">
        <Breadcrumb items={[{ label: 'Access Control' }, { label: 'Permissions' }]} />
        <AccessControlTabs />
        <div className="rounded-xl border border-border bg-card px-6 py-12 text-center text-sm text-muted-foreground">
          No permissions loaded. Check that the permissions API is available and try refreshing the page.
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5 pb-6">
      <Breadcrumb items={[{ label: 'Access Control' }, { label: 'Permissions' }]} />

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-serif text-2xl font-semibold text-foreground">Permissions</h1>
          <p className="mt-0.5 max-w-xl text-sm text-muted-foreground">
            Select a role and manage its access by module. Changes are saved per role.
          </p>
        </div>
        {canManage && dirtyRoleIds.length > 0 && (
          <div className="flex shrink-0 flex-nowrap items-center gap-1.5">
            <Button variant="outline" size="sm" onClick={resetChanges}>
              Discard
            </Button>
            <Button
              size="sm"
              loading={saveMutation.isPending}
              onClick={() => saveMutation.mutate(dirtyRoleIds)}
            >
              <Save />
              Save {dirtyRoleIds.length} role{dirtyRoleIds.length > 1 ? 's' : ''}
            </Button>
          </div>
        )}
      </div>

      <AccessControlTabs />

      {saveSuccess && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-800">
          Permissions saved successfully.
        </div>
      )}
      {saveError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
          {saveError}
        </div>
      )}

      {!canManage && (
        <div className="rounded-lg border border-border bg-muted/50 px-4 py-2.5 text-sm text-muted-foreground">
          You have read-only access. Contact an owner to modify permissions.
        </div>
      )}

      <Card>
        <CardContent className="p-4">
          <p className="mb-2.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Role
          </p>
          <div className="flex flex-nowrap gap-1.5 overflow-x-auto pb-0.5">
            {sortedRoles.map((role) => {
              const active = role.id === selectedRoleId
              const count = (matrix[role.id] ?? []).length
              const dirty = dirtyRoleIds.includes(role.id)
              const label = ROLE_LABELS[role.name as Role] ?? role.name

              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRoleId(role.id)}
                  className={cn(
                    'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all',
                    active
                      ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                      : 'border-border bg-card text-foreground hover:border-primary/40 hover:bg-muted/50',
                    dirty && !active && 'ring-2 ring-amber-400/40'
                  )}
                >
                  {role.name === 'owner' && <ShieldCheck className="h-3.5 w-3.5 shrink-0" />}
                  {label}
                  <span
                    className={cn(
                      'rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none',
                      active ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {count}
                  </span>
                  {dirty && (
                    <span className="size-1.5 shrink-0 rounded-full bg-amber-400" title="Unsaved changes" />
                  )}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {selectedRole && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-gradient-to-r from-card to-muted/30 px-4 py-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-semibold">
                  {ROLE_LABELS[selectedRole.name as Role] ?? selectedRole.name}
                </h2>
                {SYSTEM_ROLES.includes(selectedRole.name) && (
                  <Badge variant="default">System</Badge>
                )}
                {selectedDirty && (
                  <Badge variant="warning">Unsaved</Badge>
                )}
                {!selectedEditable && (
                  <Badge className="gap-1 border border-border bg-card">
                    <Lock className="h-3 w-3" />
                    Read only
                  </Badge>
                )}
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {selectedCount} of {allPermissions.length} permissions granted
                {selectedRole.name === 'owner' && ' — owner always has full access'}
              </p>
            </div>
            {selectedEditable && (
              <div className="flex shrink-0 flex-nowrap gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setMatrix((prev) => ({ ...prev, [selectedRole.id]: [...allPermissions] }))
                  }
                >
                  Grant all
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMatrix((prev) => ({ ...prev, [selectedRole.id]: [] }))}
                >
                  Revoke all
                </Button>
              </div>
            )}
          </div>

          <PermissionPicker
            permissions={allPermissions}
            selected={matrix[selectedRole.id] ?? []}
            onChange={(perms) => {
              setMatrix((prev) => ({ ...prev, [selectedRole.id]: perms }))
              setSaveError(null)
            }}
            disabled={!selectedEditable}
            defaultExpandFirst
          />
        </>
      )}

      {canManage && dirtyRoleIds.length > 0 && (
        <div className="sticky bottom-4 z-10 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/95 px-4 py-3 shadow-lg backdrop-blur">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{dirtyRoleIds.length}</span> role
            {dirtyRoleIds.length > 1 ? 's have' : ' has'} unsaved changes
          </p>
          <div className="flex shrink-0 flex-nowrap gap-1.5">
            <Button variant="outline" size="sm" onClick={resetChanges}>
              Discard
            </Button>
            <Button
              size="sm"
              loading={saveMutation.isPending}
              onClick={() => saveMutation.mutate(dirtyRoleIds)}
            >
              <Save />
              Save changes
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

function extractError(err: unknown): string {
  if (err && typeof err === 'object' && 'response' in err) {
    return (err as { response?: { data?: { message?: string } } }).response?.data?.message ?? 'Failed to save'
  }
  return 'Failed to save permissions'
}
