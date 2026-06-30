import { useEffect, useMemo, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { SearchInput } from '@/components/ui/SearchInput'
import {
  groupPermissions,
  orderedGroups,
  orderedSuperGroupsWithModules,
  PERMISSION_GROUP_LABELS,
  permissionLabel,
  permissionGroup,
} from '@/constants/permissions'
import { cn } from '@/utils/cn'

interface PermissionPickerProps {
  permissions: string[]
  selected: string[]
  onChange: (next: string[]) => void
  disabled?: boolean
  defaultExpandFirst?: boolean
  showSearch?: boolean
}

export function PermissionPicker({
  permissions,
  selected,
  onChange,
  disabled,
  defaultExpandFirst = false,
  showSearch = true,
}: PermissionPickerProps) {
  const [search, setSearch] = useState('')
  const [expandedSuper, setExpandedSuper] = useState<Record<string, boolean>>({})
  const [collapsedModules, setCollapsedModules] = useState<Record<string, boolean>>({})

  const filtered = useMemo(() => {
    if (!search.trim()) return permissions
    const q = search.toLowerCase()
    return permissions.filter(
      (p) =>
        p.toLowerCase().includes(q) ||
        permissionLabel(p).toLowerCase().includes(q) ||
        (PERMISSION_GROUP_LABELS[permissionGroup(p)] ?? '').toLowerCase().includes(q)
    )
  }, [permissions, search])

  const grouped = useMemo(() => groupPermissions(filtered), [filtered])
  const superGroups = useMemo(() => orderedSuperGroupsWithModules(grouped), [grouped])
  const flatGroups = useMemo(() => orderedGroups(grouped), [grouped])

  useEffect(() => {
    if (!defaultExpandFirst || superGroups.length === 0) return
    const firstId = superGroups[0]?.id
    if (!firstId) return
    setExpandedSuper((prev) => (prev[firstId] ? prev : { ...prev, [firstId]: true }))
  }, [defaultExpandFirst, superGroups])

  const selectedSet = useMemo(() => new Set(selected), [selected])

  const togglePerm = (perm: string) => {
    if (disabled) return
    onChange(selectedSet.has(perm) ? selected.filter((p) => p !== perm) : [...selected, perm])
  }

  const toggleModule = (modulePerms: string[], enable: boolean) => {
    if (disabled) return
    const next = new Set(selected)
    modulePerms.forEach((p) => (enable ? next.add(p) : next.delete(p)))
    onChange(Array.from(next))
  }

  const toggleSuperExpanded = (id: string) => {
    setExpandedSuper((prev) => ({ ...prev, [id]: !isSuperExpanded(id, 0) }))
  }

  const toggleModuleExpanded = (key: string, superOpen: boolean) => {
    const currentlyOpen = isModuleExpanded(key, superOpen)
    setCollapsedModules((prev) => ({ ...prev, [key]: currentlyOpen }))
  }

  const isSuperExpanded = (id: string, index: number) =>
    expandedSuper[id] ?? (search.trim().length > 0 || (defaultExpandFirst && index === 0))

  const isModuleExpanded = (key: string, superOpen: boolean) =>
    !collapsedModules[key] && (superOpen || search.trim().length > 0)

  if (permissions.length === 0) {
    return <p className="py-6 text-center text-sm text-muted-foreground">No permissions available.</p>
  }

  const renderModule = (module: string, sgId: string, superOpen: boolean) => {
    const modulePerms = grouped[module] ?? []
    const moduleKey = `${sgId}-${module}`
    const moduleOpen = isModuleExpanded(moduleKey, superOpen)
    const moduleSelected = modulePerms.filter((p) => selectedSet.has(p)).length

    return (
      <div key={moduleKey}>
        <div className="flex items-center gap-2 px-3 py-2 pl-5">
          <button
            type="button"
            onClick={() => toggleModuleExpanded(moduleKey, superOpen)}
            className="flex min-w-0 flex-1 items-center gap-2 text-left"
          >
            <ChevronDown
              className={cn(
                'h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform',
                !moduleOpen && '-rotate-90'
              )}
            />
            <span className="truncate text-xs font-semibold text-foreground">
              {PERMISSION_GROUP_LABELS[module] ?? module}
            </span>
            <span className="shrink-0 text-[10px] text-muted-foreground">
              {moduleSelected}/{modulePerms.length}
            </span>
          </button>
          {!disabled && (
            <div className="flex shrink-0 gap-0.5">
              <button
                type="button"
                onClick={() => toggleModule(modulePerms, true)}
                className="rounded px-1.5 py-0.5 text-[10px] font-medium text-primary hover:bg-primary/10"
              >
                All
              </button>
              <button
                type="button"
                onClick={() => toggleModule(modulePerms, false)}
                className="rounded px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground hover:bg-muted"
              >
                None
              </button>
            </div>
          )}
        </div>

        {moduleOpen && (
          <div className="grid gap-0.5 px-3 pb-3 pl-8 sm:grid-cols-2 lg:grid-cols-3">
            {modulePerms.map((perm) => {
              const checked = selectedSet.has(perm)
              return (
                <label
                  key={perm}
                  className={cn(
                    'flex cursor-pointer items-center gap-2.5 rounded-lg border px-2.5 py-2 text-sm transition-all',
                    checked
                      ? 'border-primary/25 bg-primary/5'
                      : 'border-transparent hover:border-border hover:bg-muted/40',
                    disabled && 'cursor-not-allowed opacity-60'
                  )}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => togglePerm(perm)}
                    disabled={disabled}
                    className="size-3.5 shrink-0 rounded border-border text-primary focus:ring-primary/30"
                  />
                  <span className="min-w-0 leading-tight">
                    <span className="block text-xs font-medium">{permissionLabel(perm)}</span>
                  </span>
                </label>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {showSearch && (
        <SearchInput value={search} onChange={setSearch} placeholder="Search permissions..." />
      )}

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{selected.length} of {permissions.length} permissions granted</span>
        {search.trim() && <span>{filtered.length} matching</span>}
      </div>

      {superGroups.length === 0 && flatGroups.length > 0 ? (
        <div className="space-y-3">
          {flatGroups.map((module) => renderModule(module, 'flat', true))}
        </div>
      ) : (
        <div className="space-y-3">
          {superGroups.map((sg, sgIndex) => {
            const superPerms = sg.modules.flatMap((m) => grouped[m] ?? [])
            const superSelected = superPerms.filter((p) => selectedSet.has(p)).length
            const superOpen = isSuperExpanded(sg.id, sgIndex)
            const pct = superPerms.length > 0 ? Math.round((superSelected / superPerms.length) * 100) : 0

            return (
              <div key={sg.id} className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                <div className="flex items-center gap-2 border-b border-border/60 bg-gradient-to-r from-muted/50 to-transparent px-3 py-2.5">
                  <button
                    type="button"
                    onClick={() => toggleSuperExpanded(sg.id)}
                    className="flex min-w-0 flex-1 items-center gap-2 text-left"
                  >
                    <ChevronDown
                      className={cn('h-4 w-4 shrink-0 text-primary transition-transform', !superOpen && '-rotate-90')}
                    />
                    <span className="truncate text-sm font-semibold text-foreground">{sg.label}</span>
                    <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                      {superSelected}/{superPerms.length}
                    </span>
                  </button>
                  {!disabled && superPerms.length > 0 && (
                    <div className="flex shrink-0 gap-0.5">
                      <button
                        type="button"
                        onClick={() => toggleModule(superPerms, true)}
                        className="rounded px-2 py-0.5 text-[10px] font-medium text-primary hover:bg-primary/10"
                      >
                        All
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleModule(superPerms, false)}
                        className="rounded px-2 py-0.5 text-[10px] font-medium text-muted-foreground hover:bg-muted"
                      >
                        None
                      </button>
                    </div>
                  )}
                </div>

                <div className="h-1 bg-muted">
                  <div className="h-full bg-primary/60 transition-all" style={{ width: `${pct}%` }} />
                </div>

                {superOpen && (
                  <div className="divide-y divide-border/40">
                    {sg.modules.map((module) => renderModule(module, sg.id, superOpen))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {filtered.length === 0 && (
        <p className="py-4 text-center text-sm text-muted-foreground">No permissions match your search.</p>
      )}
    </div>
  )
}
