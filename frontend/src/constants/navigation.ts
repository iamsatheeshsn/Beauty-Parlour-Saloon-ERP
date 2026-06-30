import type { LucideIcon } from 'lucide-react'
import {
  BarChart3,
  Briefcase,
  Calendar,
  CircleDollarSign,
  Contact,
  CreditCard,
  Database,
  CircleHelp,
  FileText,
  Gift,
  Grid3x3,
  Image,
  Images,
  Inbox,
  LayoutDashboard,
  MessageSquareQuote,
  Package,
  Scissors,
  Settings,
  Shield,
  Users,
  Wallet,
} from 'lucide-react'

export interface NavItem {
  label: string
  icon: LucideIcon
  to: string
  permission?: string
  disabled?: boolean
  /** Show when user has any of these permissions (Masters module) */
  anyPermissions?: string[]
}

export interface NavGroup {
  id: string
  label: string
  items: NavItem[]
}

export const NAV_GROUPS: NavGroup[] = [
  {
    id: 'overview',
    label: 'Overview',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard', permission: 'dashboard.view' },
    ],
  },
  {
    id: 'administration',
    label: 'Administration',
    items: [
      { label: 'Users', icon: Users, to: '/users', permission: 'users.view' },
      {
        label: 'Masters',
        icon: Database,
        to: '/masters',
        anyPermissions: [
          'company.view',
          'branches.view',
          'departments.view',
          'staff-designations.view',
          'countries.view',
          'emirates.view',
          'cities.view',
          'expense-categories.view',
          'payment-methods.view',
          'service-categories.view',
          'product-categories.view',
          'brands.view',
          'suppliers.view',
        ],
      },
      { label: 'Roles', icon: Shield, to: '/roles', permission: 'roles.view' },
      { label: 'Permissions', icon: Grid3x3, to: '/permissions', permission: 'roles.view' },
      { label: 'Activity Logs', icon: FileText, to: '/activity-logs', permission: 'activity-logs.view' },
    ],
  },
  {
    id: 'operations',
    label: 'Front Desk & Sales',
    items: [
      { label: 'POS', icon: CreditCard, to: '/pos', permission: 'sales.view' },
      { label: 'Appointments', icon: Calendar, to: '/appointments', permission: 'appointments.view' },
      { label: 'Packages', icon: Gift, to: '/packages', permission: 'service-packages.view' },
      { label: 'Customers', icon: Contact, to: '/customers', permission: 'customers.view' },
      { label: 'Services', icon: Scissors, to: '/services', permission: 'services.view' },
    ],
  },
  {
    id: 'staff',
    label: 'Staff & HR',
    items: [
      { label: 'Staff', icon: Briefcase, to: '/staff', permission: 'staff.view' },
      { label: 'Payroll', icon: CircleDollarSign, to: '/payroll', permission: 'payroll.view' },
    ],
  },
  {
    id: 'inventory',
    label: 'Inventory',
    items: [
      { label: 'Inventory', icon: Package, to: '/inventory', permission: 'inventory.view' },
    ],
  },
  {
    id: 'finance',
    label: 'Finance & Reports',
    items: [
      { label: 'Expenses', icon: Wallet, to: '/expenses', permission: 'expenses.view' },
      { label: 'Reports', icon: BarChart3, to: '/reports', permission: 'reports.view' },
    ],
  },
  {
    id: 'website',
    label: 'Website',
    items: [
      { label: 'Inquiries', icon: Inbox, to: '/website/inquiries', permission: 'website-inquiries.view' },
      { label: 'Homepage Slides', icon: Image, to: '/website/homepage-slides', permission: 'homepage-slides.view' },
      { label: 'Testimonials', icon: MessageSquareQuote, to: '/website/testimonials', permission: 'testimonials.view' },
      { label: 'Gallery', icon: Images, to: '/website/gallery', permission: 'gallery-items.view' },
      { label: 'Journal', icon: FileText, to: '/website/journal', permission: 'blog-posts.view' },
      { label: 'FAQ', icon: CircleHelp, to: '/website/faqs', permission: 'faqs.view' },
    ],
  },
  {
    id: 'system',
    label: 'System',
    items: [
      { label: 'Settings', icon: Settings, to: '/settings', permission: 'settings.view' },
    ],
  },
]

export function isNavItemVisible(
  item: NavItem,
  isAuthenticated: boolean,
  hasPermission: (p: string) => boolean,
  hasAnyPermission: (p: string[]) => boolean
): boolean {
  if (item.disabled) return true
  if (!isAuthenticated) return false
  if (item.anyPermissions?.length) return hasAnyPermission(item.anyPermissions)
  if (item.permission) return hasPermission(item.permission)
  return false
}

export function visibleNavGroups(
  isAuthenticated: boolean,
  hasPermission: (p: string) => boolean,
  hasAnyPermission: (p: string[]) => boolean
): NavGroup[] {
  return NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) =>
      isNavItemVisible(item, isAuthenticated, hasPermission, hasAnyPermission)
    ),
  })).filter((group) => group.items.length > 0)
}
