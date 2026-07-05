import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import api from '../lib/api'
import type { AuthContextValue, AuthUser } from './authContext.types'

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loginTime, setLoginTime] = useState<string | null>(null)
  const [initializing, setInitializing] = useState(true)

  // No token is readable client-side (httpOnly session cookie) — the only way
  // to know if a session is already active (e.g. after a page refresh) is to
  // ask the API.
  useEffect(() => {
    api.get<AuthUser>('/me')
      .then(({ data }) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setInitializing(false))
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.post('/login', { email, password })
    if (res.status === 422) {
      throw new Error('invalid_credentials')
    }

    const { data: me } = await api.get<AuthUser>('/me')
    setUser(me)
    setLoginTime(new Date().toISOString())
  }, [])

  const logout = useCallback(async () => {
    try {
      await api.post('/logout')
    } finally {
      setUser(null)
      setLoginTime(null)
    }
  }, [])

  const updateUser = useCallback((partial: Partial<AuthUser>) => {
    setUser((prev) => (prev ? { ...prev, ...partial } : prev))
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, loginTime, login, logout, updateUser, isAuthenticated: user !== null, initializing }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
