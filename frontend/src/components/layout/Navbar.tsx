import { LogOut, Menu, User } from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { NotificationBell } from '@/components/layout/NotificationBell'
import { useAuth } from '@/contexts/AuthContext'
import { ROLE_LABELS, type Role } from '@/constants/roles'
import { useNavigate } from 'react-router-dom'

interface NavbarProps {
  onMenuClick?: () => void
  title?: string
}

export function Navbar({ onMenuClick, title = 'Dashboard' }: NavbarProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const role = user?.roles?.[0] as Role | undefined

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-border bg-card/90 px-4 backdrop-blur-md sm:h-16 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h2 className="truncate text-lg font-semibold text-foreground sm:text-xl">{title}</h2>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <NotificationBell />

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="flex items-center gap-3 rounded-xl border border-border bg-muted/50 px-3 py-1.5 transition-colors hover:bg-muted">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#7A2E3E] via-[#B76E79] to-[#C9A46C] text-white">
                <User className="h-4 w-4" />
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {role ? ROLE_LABELS[role] : 'User'}
                </p>
              </div>
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="z-50 min-w-[180px] rounded-xl border border-border bg-card p-1 shadow-lg"
              sideOffset={8}
              align="end"
            >
              <DropdownMenu.Item
                className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive outline-none hover:bg-muted"
                onSelect={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  )
}
