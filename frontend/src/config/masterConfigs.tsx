import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/Badge'
import type { MasterModuleConfig } from '@/config/masterModules'
import {
  branchService,
  cityService,
  countryService,
  departmentService,
  emirateService,
  enumService,
  expenseCategoryService,
  paymentMethodService,
  productCategoryService,
  brandService,
  supplierService,
  serviceCategoryService,
  settingService,
  staffDesignationService,
  type MasterRecord,
} from '@/services/masterService'

const activeColumn: ColumnDef<MasterRecord, unknown> = {
  accessorKey: 'is_active',
  header: 'Status',
  cell: ({ getValue }) => (
    <Badge variant={getValue() ? 'success' : 'warning'}>
      {getValue() ? 'Active' : 'Inactive'}
    </Badge>
  ),
}

export const countryConfig: MasterModuleConfig = {
  key: 'countries',
  title: 'Countries',
  subtitle: 'Manage country master data',
  endpoint: '/countries',
  queryKey: 'countries',
  service: countryService,
  columns: [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'iso_code', header: 'ISO' },
    { accessorKey: 'phone_code', header: 'Phone Code' },
    activeColumn,
  ],
  fields: [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'iso_code', label: 'ISO Code (2)', type: 'text', required: true },
    { name: 'iso3_code', label: 'ISO3 Code', type: 'text' },
    { name: 'phone_code', label: 'Phone Code', type: 'text' },
    { name: 'currency_code', label: 'Currency', type: 'text' },
    { name: 'sort_order', label: 'Sort Order', type: 'number' },
    { name: 'is_active', label: 'Active', type: 'checkbox', defaultValue: true },
  ],
  getDefaultValues: () => ({ is_active: true, sort_order: 0 }),
}

export const emirateConfig: MasterModuleConfig = {
  key: 'emirates',
  title: 'Emirates',
  subtitle: 'Manage UAE emirates and regions',
  endpoint: '/emirates',
  queryKey: 'emirates',
  service: emirateService,
  columns: [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'code', header: 'Code' },
    {
      id: 'country',
      header: 'Country',
      cell: ({ row }) => String((row.original.country as { name?: string })?.name ?? '—'),
    },
    activeColumn,
  ],
  fields: [
    {
      name: 'country_id',
      label: 'Country',
      type: 'select',
      required: true,
      optionsFrom: {
        queryKey: 'countries-options',
        fetcher: countryService.list,
      },
    },
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'code', label: 'Code', type: 'text', required: true },
    { name: 'sort_order', label: 'Sort Order', type: 'number' },
    { name: 'is_active', label: 'Active', type: 'checkbox' },
  ],
  getDefaultValues: () => ({ is_active: true, sort_order: 0 }),
  transformPayload: (v) => ({
    ...v,
    country_id: v.country_id ? Number(v.country_id) : undefined,
    sort_order: v.sort_order ? Number(v.sort_order) : 0,
  }),
}

export const cityConfig: MasterModuleConfig = {
  key: 'cities',
  title: 'Cities',
  subtitle: 'Manage cities by emirate',
  endpoint: '/cities',
  queryKey: 'cities',
  service: cityService,
  columns: [
    { accessorKey: 'name', header: 'Name' },
    {
      id: 'emirate',
      header: 'Emirate',
      cell: ({ row }) => String((row.original.emirate as { name?: string })?.name ?? '—'),
    },
    activeColumn,
  ],
  fields: [
    {
      name: 'country_id',
      label: 'Country',
      type: 'select',
      required: true,
      optionsFrom: { queryKey: 'countries-options', fetcher: countryService.list },
    },
    {
      name: 'emirate_id',
      label: 'Emirate',
      type: 'select',
      required: true,
      optionsFrom: {
        queryKey: 'emirates-options',
        fetcher: emirateService.list,
        dependsOn: 'country_id',
        filterKey: 'country_id',
      },
    },
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'sort_order', label: 'Sort Order', type: 'number' },
    { name: 'is_active', label: 'Active', type: 'checkbox' },
  ],
  getDefaultValues: () => ({ is_active: true, sort_order: 0 }),
  transformPayload: (v) => ({
    ...v,
    country_id: Number(v.country_id),
    emirate_id: Number(v.emirate_id),
    sort_order: v.sort_order ? Number(v.sort_order) : 0,
  }),
  modalSize: 'max-w-xl',
}

export const branchConfig: MasterModuleConfig = {
  key: 'branches',
  title: 'Branches',
  subtitle: 'Manage salon branches and locations',
  endpoint: '/branches',
  queryKey: 'branches',
  service: branchService,
  columns: [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'code', header: 'Code' },
    { accessorKey: 'phone', header: 'Phone' },
    {
      id: 'hq',
      header: 'HQ',
      cell: ({ row }) => (row.original.is_head_office ? 'Yes' : '—'),
    },
    activeColumn,
  ],
  fields: [
    { name: 'name', label: 'Branch Name', type: 'text', required: true },
    { name: 'code', label: 'Code', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'phone', label: 'Phone', type: 'text' },
    { name: 'address', label: 'Address', type: 'textarea' },
    {
      name: 'country_id',
      label: 'Country',
      type: 'select',
      optionsFrom: { queryKey: 'countries-options', fetcher: countryService.list },
    },
    {
      name: 'emirate_id',
      label: 'Emirate',
      type: 'select',
      optionsFrom: {
        queryKey: 'emirates-options',
        fetcher: emirateService.list,
        dependsOn: 'country_id',
        filterKey: 'country_id',
      },
    },
    {
      name: 'city_id',
      label: 'City',
      type: 'select',
      optionsFrom: {
        queryKey: 'cities-options',
        fetcher: cityService.list,
        dependsOn: 'emirate_id',
        filterKey: 'emirate_id',
      },
    },
    { name: 'postal_code', label: 'Postal Code', type: 'text' },
    { name: 'is_head_office', label: 'Head Office', type: 'checkbox' },
    { name: 'is_active', label: 'Active', type: 'checkbox' },
  ],
  getDefaultValues: () => ({ is_active: true, is_head_office: false }),
  transformPayload: (v) => ({
    ...v,
    country_id: v.country_id ? Number(v.country_id) : null,
    emirate_id: v.emirate_id ? Number(v.emirate_id) : null,
    city_id: v.city_id ? Number(v.city_id) : null,
  }),
  modalSize: 'max-w-2xl',
}

export const departmentConfig: MasterModuleConfig = {
  key: 'departments',
  title: 'Departments',
  subtitle: 'Organize staff by department',
  endpoint: '/departments',
  queryKey: 'departments',
  service: departmentService,
  columns: [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'code', header: 'Code' },
    activeColumn,
  ],
  fields: [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'code', label: 'Code', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'sort_order', label: 'Sort Order', type: 'number' },
    { name: 'is_active', label: 'Active', type: 'checkbox' },
  ],
  getDefaultValues: () => ({ is_active: true, sort_order: 0 }),
}

export const staffDesignationConfig: MasterModuleConfig = {
  key: 'staff-designations',
  title: 'Staff Designations',
  subtitle: 'Job titles and hierarchy levels',
  endpoint: '/staff-designations',
  queryKey: 'staff-designations',
  service: staffDesignationService,
  columns: [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'code', header: 'Code' },
    { accessorKey: 'level', header: 'Level' },
    {
      id: 'department',
      header: 'Department',
      cell: ({ row }) => String((row.original.department as { name?: string })?.name ?? '—'),
    },
    activeColumn,
  ],
  fields: [
    {
      name: 'department_id',
      label: 'Department',
      type: 'select',
      optionsFrom: { queryKey: 'departments-options', fetcher: departmentService.list },
    },
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'code', label: 'Code', type: 'text', required: true },
    { name: 'level', label: 'Level (1-10)', type: 'number' },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'sort_order', label: 'Sort Order', type: 'number' },
    { name: 'is_active', label: 'Active', type: 'checkbox' },
  ],
  getDefaultValues: () => ({ is_active: true, sort_order: 0, level: 1 }),
  transformPayload: (v) => ({
    ...v,
    department_id: v.department_id ? Number(v.department_id) : null,
    level: v.level ? Number(v.level) : null,
    sort_order: v.sort_order ? Number(v.sort_order) : 0,
  }),
}

export const expenseCategoryConfig: MasterModuleConfig = {
  key: 'expense-categories',
  title: 'Expense Categories',
  subtitle: 'Classify business expenses',
  endpoint: '/expense-categories',
  queryKey: 'expense-categories',
  service: expenseCategoryService,
  columns: [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'code', header: 'Code' },
    {
      id: 'parent',
      header: 'Parent',
      cell: ({ row }) => String((row.original.parent as { name?: string })?.name ?? '—'),
    },
    activeColumn,
  ],
  fields: [
    {
      name: 'parent_id',
      label: 'Parent Category',
      type: 'select',
      optionsFrom: { queryKey: 'expense-categories-options', fetcher: expenseCategoryService.list },
    },
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'code', label: 'Code', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'sort_order', label: 'Sort Order', type: 'number' },
    { name: 'is_active', label: 'Active', type: 'checkbox' },
  ],
  getDefaultValues: () => ({ is_active: true, sort_order: 0 }),
  transformPayload: (v) => ({
    ...v,
    parent_id: v.parent_id ? Number(v.parent_id) : null,
    sort_order: v.sort_order ? Number(v.sort_order) : 0,
  }),
}

export const paymentMethodConfig: MasterModuleConfig = {
  key: 'payment-methods',
  title: 'Payment Methods',
  subtitle: 'Accepted payment types',
  endpoint: '/payment-methods',
  queryKey: 'payment-methods',
  service: paymentMethodService,
  columns: [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'code', header: 'Code' },
    { accessorKey: 'type_label', header: 'Type' },
    activeColumn,
  ],
  fields: [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'code', label: 'Code', type: 'text', required: true },
    {
      name: 'type',
      label: 'Type',
      type: 'select',
      required: true,
      optionsFrom: {
        queryKey: 'payment-method-types',
        fetcher: enumService.paymentMethodTypes,
        valueKey: 'value',
        labelKey: 'label',
      },
    },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'requires_reference', label: 'Requires Reference', type: 'checkbox' },
    { name: 'sort_order', label: 'Sort Order', type: 'number' },
    { name: 'is_active', label: 'Active', type: 'checkbox' },
  ],
  getDefaultValues: () => ({ is_active: true, sort_order: 0, requires_reference: false }),
  transformPayload: (v) => ({
    ...v,
    sort_order: v.sort_order ? Number(v.sort_order) : 0,
  }),
}

export const serviceCategoryConfig: MasterModuleConfig = {
  key: 'service-categories',
  title: 'Service Categories',
  subtitle: 'Group salon services',
  endpoint: '/service-categories',
  queryKey: 'service-categories',
  service: serviceCategoryService,
  columns: [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'code', header: 'Code' },
    { accessorKey: 'icon', header: 'Icon' },
    activeColumn,
  ],
  fields: [
    {
      name: 'parent_id',
      label: 'Parent Category',
      type: 'select',
      optionsFrom: { queryKey: 'service-categories-options', fetcher: serviceCategoryService.list },
    },
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'code', label: 'Code', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'icon', label: 'Icon', type: 'text' },
    { name: 'color', label: 'Color', type: 'text', placeholder: '#7A2E3E' },
    { name: 'sort_order', label: 'Sort Order', type: 'number' },
    { name: 'is_active', label: 'Active', type: 'checkbox' },
  ],
  getDefaultValues: () => ({ is_active: true, sort_order: 0 }),
  transformPayload: (v) => ({
    ...v,
    parent_id: v.parent_id ? Number(v.parent_id) : null,
    sort_order: v.sort_order ? Number(v.sort_order) : 0,
  }),
}

export const productCategoryConfig: MasterModuleConfig = {
  key: 'product-categories',
  title: 'Product Categories',
  subtitle: 'Group inventory products',
  endpoint: '/product-categories',
  queryKey: 'product-categories',
  service: productCategoryService,
  columns: [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'code', header: 'Code' },
    activeColumn,
  ],
  fields: [
    {
      name: 'parent_id',
      label: 'Parent Category',
      type: 'select',
      optionsFrom: { queryKey: 'product-categories-options', fetcher: productCategoryService.list },
    },
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'code', label: 'Code', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'sort_order', label: 'Sort Order', type: 'number' },
    { name: 'is_active', label: 'Active', type: 'checkbox' },
  ],
  getDefaultValues: () => ({ is_active: true, sort_order: 0 }),
  transformPayload: (v) => ({
    ...v,
    parent_id: v.parent_id ? Number(v.parent_id) : null,
    sort_order: v.sort_order ? Number(v.sort_order) : 0,
  }),
}

export const brandConfig: MasterModuleConfig = {
  key: 'brands',
  title: 'Brands',
  subtitle: 'Product brand master data',
  endpoint: '/brands',
  queryKey: 'brands',
  service: brandService,
  columns: [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'code', header: 'Code' },
    { accessorKey: 'website', header: 'Website' },
    activeColumn,
  ],
  fields: [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'code', label: 'Code', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'website', label: 'Website', type: 'text' },
    { name: 'sort_order', label: 'Sort Order', type: 'number' },
    { name: 'is_active', label: 'Active', type: 'checkbox' },
  ],
  getDefaultValues: () => ({ is_active: true, sort_order: 0 }),
  transformPayload: (v) => ({
    ...v,
    sort_order: v.sort_order ? Number(v.sort_order) : 0,
  }),
}

export const supplierConfig: MasterModuleConfig = {
  key: 'suppliers',
  title: 'Suppliers',
  subtitle: 'Manage product suppliers',
  endpoint: '/suppliers',
  queryKey: 'suppliers',
  service: supplierService,
  columns: [
    { accessorKey: 'code', header: 'Code' },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'contact_person', header: 'Contact' },
    { accessorKey: 'phone', header: 'Phone' },
    activeColumn,
  ],
  fields: [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'code', label: 'Code', type: 'text', placeholder: 'Auto-generated if empty' },
    { name: 'contact_person', label: 'Contact Person', type: 'text' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'phone', label: 'Phone', type: 'text' },
    { name: 'address', label: 'Address', type: 'textarea' },
    { name: 'tax_number', label: 'Tax Number', type: 'text' },
    { name: 'payment_terms', label: 'Payment Terms', type: 'text' },
    { name: 'notes', label: 'Notes', type: 'textarea' },
    { name: 'is_active', label: 'Active', type: 'checkbox' },
  ],
  getDefaultValues: () => ({ is_active: true }),
  modalSize: 'max-w-xl',
}

export const settingConfig: MasterModuleConfig = {
  key: 'settings',
  title: 'Settings',
  subtitle: 'Application and company settings',
  endpoint: '/settings',
  queryKey: 'settings',
  service: settingService,
  columns: [
    { accessorKey: 'group', header: 'Group' },
    { accessorKey: 'key', header: 'Key' },
    { accessorKey: 'value', header: 'Value' },
    { accessorKey: 'type', header: 'Type' },
  ],
  fields: [
    {
      name: 'branch_id',
      label: 'Branch (optional)',
      type: 'select',
      optionsFrom: { queryKey: 'branches-options', fetcher: branchService.list },
    },
    { name: 'group', label: 'Group', type: 'text', required: true },
    { name: 'key', label: 'Key', type: 'text', required: true },
    { name: 'value', label: 'Value', type: 'text' },
    {
      name: 'type',
      label: 'Type',
      type: 'select',
      required: true,
      optionsFrom: {
        queryKey: 'setting-types',
        fetcher: enumService.settingTypes,
        valueKey: 'value',
        labelKey: 'label',
      },
    },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'is_public', label: 'Public', type: 'checkbox' },
  ],
  getDefaultValues: () => ({ is_public: false, type: 'string' }),
  transformPayload: (v) => ({
    ...v,
    branch_id: v.branch_id ? Number(v.branch_id) : null,
  }),
  modalSize: 'max-w-xl',
}

export const masterNavItems: Array<{ label: string; to: string; permission: string }> = [
  { label: 'Company', to: '/masters/company', permission: 'company.view' },
  { label: 'Branches', to: '/masters/branches', permission: 'branches.view' },
  { label: 'Departments', to: '/masters/departments', permission: 'departments.view' },
  { label: 'Designations', to: '/masters/staff-designations', permission: 'staff-designations.view' },
  { label: 'Countries', to: '/masters/countries', permission: 'countries.view' },
  { label: 'Emirates', to: '/masters/emirates', permission: 'emirates.view' },
  { label: 'Cities', to: '/masters/cities', permission: 'cities.view' },
  { label: 'Expense Categories', to: '/masters/expense-categories', permission: 'expense-categories.view' },
  { label: 'Payment Methods', to: '/masters/payment-methods', permission: 'payment-methods.view' },
  { label: 'Service Categories', to: '/masters/service-categories', permission: 'service-categories.view' },
  { label: 'Product Categories', to: '/masters/product-categories', permission: 'product-categories.view' },
  { label: 'Brands', to: '/masters/brands', permission: 'brands.view' },
  { label: 'Suppliers', to: '/masters/suppliers', permission: 'suppliers.view' },
]
