import type { ColumnDef } from '@tanstack/react-table'
import type { ReactNode } from 'react'
import type { ListParams, MasterRecord } from '@/services/masterService'

export type FieldType = 'text' | 'email' | 'number' | 'textarea' | 'select' | 'checkbox'

export interface SelectOptionsConfig {
  queryKey: string
  fetcher: (params?: ListParams) => Promise<unknown>
  valueKey?: string
  labelKey?: string
  dependsOn?: string
  filterKey?: string
  staticParams?: ListParams
}

export interface FormFieldConfig {
  name: string
  label: string
  type: FieldType
  required?: boolean
  placeholder?: string
  options?: { value: string | number; label: string }[]
  optionsFrom?: SelectOptionsConfig
  defaultValue?: string | number | boolean
}

export interface MasterModuleConfig {
  key: string
  title: string
  subtitle: string
  endpoint: string
  queryKey: string
  service: {
    list: (params?: ListParams) => Promise<unknown>
    get: (id: number) => Promise<unknown>
    create: (payload: Record<string, unknown>) => Promise<unknown>
    update: (id: number, payload: Record<string, unknown>) => Promise<unknown>
    remove: (id: number) => Promise<void>
  }
  fields: FormFieldConfig[]
  columns: ColumnDef<MasterRecord, unknown>[]
  getDefaultValues?: () => Record<string, unknown>
  transformPayload?: (values: Record<string, unknown>) => Record<string, unknown>
  modalSize?: string
}

export function statusBadge(active?: boolean): ReactNode {
  return active ? 'Active' : 'Inactive'
}
