export const ROLES = {
  OWNER: 'owner',
  ADMIN: 'admin',
  RECEPTIONIST: 'receptionist',
  STAFF: 'staff',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

export const ROLE_LABELS: Record<Role, string> = {
  owner: 'Owner',
  admin: 'Admin',
  receptionist: 'Receptionist',
  staff: 'Staff',
}
