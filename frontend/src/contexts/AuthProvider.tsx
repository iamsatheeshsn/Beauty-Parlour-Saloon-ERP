import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { AuthContext, type AuthContextType } from './AuthContext'
import { authService } from '@/services/authService'
import { TOKEN_KEY, USER_KEY } from '@/constants/app'
import { normalizePermissions } from '@/utils/permissions'
import type { User } from '@/types'

interface AuthProviderProps {
  children: ReactNode
}

function normalizeUser(user: User): User {
  return {
    ...user,
    permissions: normalizePermissions(user.permissions),
    roles: Array.isArray(user.roles) ? user.roles : user.roles ? [String(user.roles)] : [],
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem(USER_KEY)
    if (!stored) return null
    try {
      return normalizeUser(JSON.parse(stored) as User)
    } catch {
      return null
    }
  })
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))
  const [isLoading, setIsLoading] = useState(true)

  const persistUser = useCallback((next: User) => {
    const normalized = normalizeUser(next)
    setUser(normalized)
    localStorage.setItem(USER_KEY, JSON.stringify(normalized))
    return normalized
  }, [])

  const refreshUser = useCallback(async () => {
    if (!localStorage.getItem(TOKEN_KEY)) {
      setIsLoading(false)
      return
    }

    try {
      const response = await authService.me()
      persistUser(response.data)
    } catch {
      setUser(null)
      setToken(null)
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    } finally {
      setIsLoading(false)
    }
  }, [persistUser])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    setUser(null)
    localStorage.removeItem(USER_KEY)

    try {
      const response = await authService.login({ email, password })
      setToken(response.data.token)
      localStorage.setItem(TOKEN_KEY, response.data.token)

      const me = await authService.me()
      persistUser(me.data)
    } finally {
      setIsLoading(false)
    }
  }, [persistUser])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } finally {
      setUser(null)
      setToken(null)
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    }
  }, [])

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      token,
      isAuthenticated: !!token && !!user,
      isLoading,
      login,
      logout,
      refreshUser,
    }),
    [user, token, isLoading, login, logout, refreshUser]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
