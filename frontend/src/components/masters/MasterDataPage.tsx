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
  Textarea,
} from '@/components'
import type { FormFieldConfig, MasterModuleConfig } from '@/config/masterModules'
import { useDebounce } from '@/hooks/useDebounce'
import type { ListParams, MasterRecord } from '@/services/masterService'
import type { PaginatedResponse } from '@/types'
import { isPaginated } from '@/utils/master'

interface MasterDataPageProps {
  config: MasterModuleConfig
}

function buildColumns(
  config: MasterModuleConfig,
  onEdit: (row: MasterRecord) => void,
  onDelete: (row: MasterRecord) => void
): ColumnDef<MasterRecord, unknown>[] {
  const base =
    config.columns.length > 0
      ? config.columns
      : ([
          { accessorKey: 'name', header: 'Name' },
          { accessorKey: 'code', header: 'Code' },
        ] as ColumnDef<MasterRecord, unknown>[])

  return [
    ...base,
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => onEdit(row.original)} title="Edit">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(row.original)}
            title="Delete"
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]
}

export function MasterDataPage({ config }: MasterDataPageProps) {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<MasterRecord | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<MasterRecord | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Record<string, unknown>>({
    defaultValues: config.getDefaultValues?.() ?? {},
  })

  const watchedValues = watch()
  const optionFields = config.fields.filter((f) => f.optionsFrom)

  const optionResults = useQueries({
    queries: optionFields.map((field) => {
      const opts = field.optionsFrom!
      const depValue = opts.dependsOn ? watchedValues[opts.dependsOn] : undefined
      const params: ListParams & Record<string, unknown> = { all: true, ...opts.staticParams }
      if (opts.dependsOn && opts.filterKey && depValue) {
        params[opts.filterKey] = depValue
      }
      return {
        queryKey: [opts.queryKey, depValue ?? 'all'],
        queryFn: () => opts.fetcher(params),
        enabled: !opts.dependsOn || Boolean(depValue),
      }
    }),
  })

  const optionMap = useMemo(() => {
    const map: Record<string, { value: string | number; label: string }[]> = {}
    optionFields.forEach((field, index) => {
      const result = optionResults[index]?.data
      if (!result) {
        map[field.name] = field.options ?? []
        return
      }
      const items = Array.isArray(result)
        ? result
        : ((result as PaginatedResponse<MasterRecord>).data ?? [])
      const valueKey = field.optionsFrom?.valueKey ?? 'id'
      const labelKey = field.optionsFrom?.labelKey ?? 'name'
      map[field.name] = items.map((item) => {
        const record = item as Record<string, unknown>
        return {
          value: record[valueKey] as string | number,
          label: String(record[labelKey] ?? ''),
        }
      })
    })
    return map
  }, [optionFields, optionResults])

  const { data, isLoading, isError } = useQuery({
    queryKey: [config.queryKey, page, debouncedSearch],
    queryFn: () =>
      config.service.list({
        page,
        per_page: 15,
        search: debouncedSearch || undefined,
      }),
  })

  const listData = useMemo(() => {
    if (!data) return { rows: [] as MasterRecord[], meta: null }
    if (isPaginated<MasterRecord>(data)) {
      return { rows: data.data, meta: data.meta }
    }
    return { rows: data as MasterRecord[], meta: null }
  }, [data])

  const createMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) => config.service.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [config.queryKey] })
      if (config.queryKey === 'settings') {
        queryClient.invalidateQueries({ queryKey: ['app-settings'] })
      }
      closeModal()
    },
    onError: (err: unknown) => setFormError(extractError(err)),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Record<string, unknown> }) =>
      config.service.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [config.queryKey] })
      if (config.queryKey === 'settings') {
        queryClient.invalidateQueries({ queryKey: ['app-settings'] })
      }
      closeModal()
    },
    onError: (err: unknown) => setFormError(extractError(err)),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => config.service.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [config.queryKey] })
      if (config.queryKey === 'settings') {
        queryClient.invalidateQueries({ queryKey: ['app-settings'] })
      }
      setDeleteTarget(null)
    },
  })

  const openCreate = () => {
    setEditing(null)
    setFormError(null)
    reset(config.getDefaultValues?.() ?? {})
    setModalOpen(true)
  }

  const openEdit = (row: MasterRecord) => {
    setEditing(row)
    setFormError(null)
    const values: Record<string, unknown> = {}
    config.fields.forEach((field) => {
      const val = row[field.name]
      if (field.type === 'checkbox') {
        values[field.name] = Boolean(val)
      } else if (val !== undefined && val !== null) {
        values[field.name] = val
      }
    })
    reset(values)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditing(null)
    setFormError(null)
  }

  const onSubmit = (values: Record<string, unknown>) => {
    setFormError(null)
    const payload = config.transformPayload ? config.transformPayload(values) : values
    if (editing) {
      updateMutation.mutate({ id: editing.id, payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  const columns = useMemo(
    () => buildColumns(config, openEdit, setDeleteTarget),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [config.key]
  )

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  if (isLoading && !data) {
    return <PageLoader />
  }

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Masters' }, { label: config.title }]} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-foreground">{config.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{config.subtitle}</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Add New
        </Button>
      </div>

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder={`Search ${config.title.toLowerCase()}...`}
        className="max-w-sm"
      />

      {isError ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          Failed to load data. Please try again.
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
        onOpenChange={(open) => !open && closeModal()}
        title={editing ? `Edit ${config.title.replace(/s$/, '')}` : `Add ${config.title.replace(/s$/, '')}`}
        className={config.modalSize ?? 'max-w-lg'}
        footer={
          <>
            <Button variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              loading={isSubmitting || createMutation.isPending || updateMutation.isPending}
              onClick={handleSubmit(onSubmit)}
            >
              {editing ? 'Update' : 'Create'}
            </Button>
          </>
        }
      >
        {formError && (
          <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {formError}
          </div>
        )}
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 sm:grid-cols-2">
            {config.fields.map((field) =>
              renderField(field, register, errors, optionMap[field.name] ?? field.options ?? [], setValue)
            )}
          </div>
        </Form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={`Delete record`}
        description={`Are you sure you want to delete "${String(deleteTarget?.name ?? deleteTarget?.code ?? 'this record')}"?`}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        loading={deleteMutation.isPending}
      />
    </div>
  )
}

function renderField(
  field: FormFieldConfig,
  register: ReturnType<typeof useForm<Record<string, unknown>>>['register'],
  errors: ReturnType<typeof useForm<Record<string, unknown>>>['formState']['errors'],
  options: { value: string | number; label: string }[],
  setValue: ReturnType<typeof useForm<Record<string, unknown>>>['setValue']
) {
  const error = errors[field.name]?.message as string | undefined
  const colSpan = field.type === 'textarea' ? 'sm:col-span-2' : ''

  if (field.type === 'checkbox') {
    return (
      <div key={field.name} className={colSpan}>
        <Checkbox label={field.label} {...register(field.name)} />
      </div>
    )
  }

  if (field.type === 'select') {
    return (
      <div key={field.name} className={colSpan}>
        <Select
          label={field.label}
          options={options}
          placeholder={`Select ${field.label.toLowerCase()}`}
          error={error}
          {...register(field.name, { required: field.required })}
          onChange={(e) => setValue(field.name, e.target.value)}
        />
      </div>
    )
  }

  if (field.type === 'textarea') {
    return (
      <div key={field.name} className={colSpan}>
        <Textarea
          label={field.label}
          placeholder={field.placeholder}
          error={error}
          {...register(field.name, { required: field.required })}
        />
      </div>
    )
  }

  return (
    <div key={field.name} className={colSpan}>
      <Input
        label={field.label}
        type={field.type}
        placeholder={field.placeholder}
        error={error}
        {...register(field.name, { required: field.required })}
      />
    </div>
  )
}

function extractError(err: unknown): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const axiosErr = err as { response?: { data?: { message?: string } } }
    return axiosErr.response?.data?.message ?? 'An error occurred'
  }
  return 'An error occurred'
}

export { Badge }
