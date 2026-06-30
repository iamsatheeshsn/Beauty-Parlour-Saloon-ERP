/** Display order for permission groups in the matrix */
export const PERMISSION_GROUP_ORDER = [
  'dashboard',
  'users',
  'roles',
  'company',
  'branches',
  'settings',
  'countries',
  'emirates',
  'cities',
  'departments',
  'staff-designations',
  'expense-categories',
  'payment-methods',
  'services',
  'appointments',
  'service-packages',
  'customer-packages',
  'sales',
  'products',
  'stock-purchases',
  'stock-movements',
  'inventory',
  'expenses',
  'payroll',
  'payslips',
  'reports',
  'customers',
  'customer-notes',
  'customer-visits',
  'staff',
  'staff-documents',
  'staff-salary',
  'staff-attendance',
  'staff-leave',
  'staff-commission',
  'service-categories',
  'product-categories',
  'brands',
  'suppliers',
  'activity-logs',
  'website-inquiries',
  'homepage-slides',
  'testimonials',
  'gallery-items',
  'faqs',
  'blog-posts',
] as const

/** Higher-level groups aligned with sidebar navigation */
export const PERMISSION_SUPER_GROUPS = [
  {
    id: 'overview',
    label: 'Overview',
    groups: ['dashboard'],
  },
  {
    id: 'administration',
    label: 'Administration',
    groups: [
      'users',
      'roles',
      'company',
      'branches',
      'countries',
      'emirates',
      'cities',
      'departments',
      'staff-designations',
      'expense-categories',
      'payment-methods',
      'service-categories',
      'product-categories',
      'brands',
      'suppliers',
      'activity-logs',
    ],
  },
  {
    id: 'operations',
    label: 'Front Desk & Sales',
    groups: [
      'sales',
      'appointments',
      'service-packages',
      'customer-packages',
      'services',
      'customers',
      'customer-notes',
      'customer-visits',
    ],
  },
  {
    id: 'staff',
    label: 'Staff & HR',
    groups: [
      'staff',
      'staff-documents',
      'staff-salary',
      'staff-attendance',
      'staff-leave',
      'staff-commission',
      'payroll',
      'payslips',
    ],
  },
  {
    id: 'inventory',
    label: 'Inventory',
    groups: [
      'products',
      'stock-purchases',
      'stock-movements',
      'inventory',
    ],
  },
  {
    id: 'finance',
    label: 'Finance & Reports',
    groups: ['expenses', 'reports'],
  },
  {
    id: 'website',
    label: 'Website',
    groups: ['website-inquiries', 'homepage-slides', 'testimonials', 'gallery-items', 'faqs', 'blog-posts'],
  },
  {
    id: 'system',
    label: 'System',
    groups: ['settings'],
  },
] as const

export type PermissionSuperGroupId = (typeof PERMISSION_SUPER_GROUPS)[number]['id']

export const PERMISSION_GROUP_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  users: 'Users',
  roles: 'Roles & Access',
  company: 'Company',
  branches: 'Branches',
  settings: 'Settings',
  countries: 'Countries',
  emirates: 'Emirates',
  cities: 'Cities',
  departments: 'Departments',
  'staff-designations': 'Staff Designations',
  'expense-categories': 'Expense Categories',
  'payment-methods': 'Payment Methods',
  'service-categories': 'Service Categories',
  services: 'Services',
  appointments: 'Appointments',
  'service-packages': 'Service Packages',
  'customer-packages': 'Customer Packages & Points',
  sales: 'POS & Sales',
  'product-categories': 'Product Categories',
  brands: 'Brands',
  suppliers: 'Suppliers',
  products: 'Products',
  'stock-purchases': 'Stock Purchases',
  'stock-movements': 'Stock Movements',
  inventory: 'Inventory',
  expenses: 'Expenses',
  payroll: 'Payroll',
  payslips: 'Payslips',
  reports: 'Reports & Analytics',
  customers: 'Customers',
  'customer-notes': 'Customer Notes',
  'customer-visits': 'Customer Visits',
  staff: 'Staff',
  'staff-documents': 'Staff Documents',
  'staff-salary': 'Staff Salary',
  'staff-attendance': 'Staff Attendance',
  'staff-leave': 'Staff Leave',
  'staff-commission': 'Staff Commission',
  'activity-logs': 'Activity Logs',
  'website-inquiries': 'Website Inquiries',
  'homepage-slides': 'Homepage Slides',
  testimonials: 'Testimonials',
  'gallery-items': 'Gallery',
  faqs: 'FAQ',
  'blog-posts': 'Journal',
}

export const PERMISSION_LABELS: Record<string, string> = {
  'dashboard.view': 'View dashboard',
  'users.view': 'View users',
  'users.create': 'Create users',
  'users.update': 'Update users',
  'users.delete': 'Delete users',
  'roles.view': 'View roles',
  'roles.manage': 'Manage roles & permissions',
  'company.view': 'View company',
  'company.manage': 'Manage company',
  'branches.view': 'View branches',
  'branches.create': 'Create branches',
  'branches.update': 'Update branches',
  'branches.delete': 'Delete branches',
  'settings.view': 'View settings',
  'settings.manage': 'Manage settings',
  'countries.view': 'View countries',
  'countries.manage': 'Manage countries',
  'emirates.view': 'View emirates',
  'emirates.manage': 'Manage emirates',
  'cities.view': 'View cities',
  'cities.manage': 'Manage cities',
  'departments.view': 'View departments',
  'departments.manage': 'Manage departments',
  'staff-designations.view': 'View designations',
  'staff-designations.manage': 'Manage designations',
  'expense-categories.view': 'View expense categories',
  'expense-categories.manage': 'Manage expense categories',
  'payment-methods.view': 'View payment methods',
  'payment-methods.manage': 'Manage payment methods',
  'service-categories.view': 'View service categories',
  'service-categories.manage': 'Manage service categories',
  'services.view': 'View services',
  'services.create': 'Create services',
  'services.update': 'Update services',
  'services.delete': 'Delete services',
  'appointments.view': 'View appointments',
  'appointments.create': 'Create appointments',
  'appointments.update': 'Update appointments',
  'appointments.delete': 'Delete appointments',
  'service-packages.view': 'View packages',
  'service-packages.create': 'Create packages',
  'service-packages.update': 'Update packages',
  'service-packages.delete': 'Delete packages',
  'customer-packages.view': 'View customer packages & history',
  'customer-packages.purchase': 'Sell packages',
  'customer-packages.consume': 'Consume points',
  'customer-packages.allocate': 'Allocate bonus points',
  'sales.view': 'View invoices & POS',
  'sales.create': 'Process checkout',
  'product-categories.view': 'View product categories',
  'product-categories.manage': 'Manage product categories',
  'brands.view': 'View brands',
  'brands.manage': 'Manage brands',
  'suppliers.view': 'View suppliers',
  'suppliers.manage': 'Manage suppliers',
  'products.view': 'View products',
  'products.create': 'Create products',
  'products.update': 'Update products',
  'products.delete': 'Delete products',
  'stock-purchases.view': 'View purchase orders',
  'stock-purchases.create': 'Create purchase orders',
  'stock-purchases.update': 'Receive stock',
  'stock-movements.view': 'View stock ledger',
  'stock-movements.consume': 'Record consumption',
  'stock-movements.adjust': 'Adjust stock',
  'inventory.view': 'View inventory module',
  'expenses.view': 'View expenses',
  'expenses.create': 'Record expenses',
  'expenses.update': 'Update expenses & receipts',
  'expenses.delete': 'Delete expenses',
  'expenses.reports': 'View expense reports',
  'payroll.view': 'View payroll module',
  'payslips.view': 'View payslips',
  'payslips.generate': 'Generate payslips',
  'payslips.update': 'Approve & mark payslips paid',
  'payslips.delete': 'Delete draft payslips',
  'reports.view': 'View reports & analytics',
  'customers.view': 'View customers',
  'customers.create': 'Register customers',
  'customers.update': 'Update customers',
  'customers.delete': 'Delete customers',
  'customer-notes.view': 'View customer notes',
  'customer-notes.create': 'Add customer notes',
  'customer-notes.update': 'Update customer notes',
  'customer-notes.delete': 'Delete customer notes',
  'customer-visits.view': 'View visit history',
  'customer-visits.create': 'Record visits',
  'customer-visits.update': 'Update visits',
  'customer-visits.delete': 'Delete visits',
  'staff.view': 'View staff',
  'staff.create': 'Add staff',
  'staff.update': 'Update staff',
  'staff.delete': 'Delete staff',
  'staff-documents.view': 'View documents',
  'staff-documents.create': 'Upload documents',
  'staff-documents.update': 'Update documents',
  'staff-documents.delete': 'Delete documents',
  'staff-salary.view': 'View salary',
  'staff-salary.create': 'Add salary records',
  'staff-salary.update': 'Update salary',
  'staff-salary.delete': 'Delete salary',
  'staff-attendance.view': 'View attendance',
  'staff-attendance.create': 'Record attendance',
  'staff-attendance.update': 'Update attendance',
  'staff-attendance.delete': 'Delete attendance',
  'staff-leave.view': 'View leave',
  'staff-leave.create': 'Request leave',
  'staff-leave.update': 'Approve/reject leave',
  'staff-leave.delete': 'Delete leave',
  'staff-commission.view': 'View commission rules',
  'staff-commission.create': 'Add commission rules',
  'staff-commission.update': 'Update commission',
  'staff-commission.delete': 'Delete commission',
  'activity-logs.view': 'View activity logs',
  'website-inquiries.view': 'View website inquiries',
  'website-inquiries.manage': 'Manage website inquiries',
  'homepage-slides.view': 'View homepage slides',
  'homepage-slides.manage': 'Manage homepage slides',
  'testimonials.view': 'View testimonials',
  'testimonials.manage': 'Manage testimonials',
  'gallery-items.view': 'View gallery',
  'gallery-items.manage': 'Manage gallery',
  'faqs.view': 'View FAQ',
  'faqs.manage': 'Manage FAQ',
  'blog-posts.view': 'View journal posts',
  'blog-posts.manage': 'Manage journal posts',
}

export function permissionLabel(name: string): string {
  return PERMISSION_LABELS[name] ?? name.replace(/\./g, ' · ')
}

export function permissionGroup(name: string): string {
  return name.split('.')[0] ?? 'other'
}

export function groupPermissions(permissions: string[]): Record<string, string[]> {
  const grouped = permissions.reduce<Record<string, string[]>>((acc, perm) => {
    const group = permissionGroup(perm)
    acc[group] = acc[group] ?? []
    acc[group].push(perm)
    return acc
  }, {})

  for (const group of Object.keys(grouped)) {
    grouped[group].sort()
  }

  return grouped
}

export function orderedGroups(grouped: Record<string, string[]>): string[] {
  const known = PERMISSION_GROUP_ORDER.filter((g) => grouped[g]?.length)
  const rest = Object.keys(grouped).filter((g) => !PERMISSION_GROUP_ORDER.includes(g as (typeof PERMISSION_GROUP_ORDER)[number]))
  return [...known, ...rest.sort()]
}

export interface SuperGroupModules {
  id: string
  label: string
  modules: string[]
}

export function orderedSuperGroupsWithModules(grouped: Record<string, string[]>): SuperGroupModules[] {
  const mapped = new Set<string>(PERMISSION_SUPER_GROUPS.flatMap((sg) => [...sg.groups]))

  const result: SuperGroupModules[] = PERMISSION_SUPER_GROUPS.map((sg) => ({
    id: sg.id,
    label: sg.label,
    modules: sg.groups.filter((g) => grouped[g]?.length),
  })).filter((sg) => sg.modules.length > 0)

  const unmapped = Object.keys(grouped)
    .filter((g) => !mapped.has(g) && (grouped[g]?.length ?? 0) > 0)
    .sort()

  if (unmapped.length > 0) {
    result.push({ id: 'other', label: 'Other', modules: unmapped })
  }

  return result
}

export function superGroupForModule(module: string): (typeof PERMISSION_SUPER_GROUPS)[number] | undefined {
  return PERMISSION_SUPER_GROUPS.find((sg) => (sg.groups as readonly string[]).includes(module))
}
