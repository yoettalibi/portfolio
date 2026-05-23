import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import api from '../lib/api'
import type { AuthContextValue, AuthUser } from './authContext.types'

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('_t'))
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem('_u')
    return stored ? (JSON.parse(stored) as AuthUser) : null
  })
  const [loginTime, setLoginTime] = useState<string | null>(() => localStorage.getItem('_lt'))

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.post<{ token: string }>('/login', { email, password })
    if (res.status === 422) {
      throw new Error('invalid_credentials')
    }
    const { data } = res
    localStorage.setItem('_t', data.token)
    setToken(data.token)

    const { data: me } = await api.get<AuthUser>('/me', {
      headers: { Authorization: `Bearer ${data.token}` },
    })
    localStorage.setItem('_u', JSON.stringify(me))
    setUser(me)

    const now = new Date().toISOString()
    localStorage.setItem('_lt', now)
    setLoginTime(now)
  }, [])

  const logout = useCallback(async () => {
    try {
      await api.post('/logout')
    } finally {
      localStorage.removeItem('_t')
      localStorage.removeItem('_u')
      localStorage.removeItem('_lt')
      setToken(null)
      setUser(null)
      setLoginTime(null)
    }
  }, [])

  const updateUser = useCallback((partial: Partial<AuthUser>) => {
    setUser((prev) => {
      if (!prev) return prev
      const next = { ...prev, ...partial }
      localStorage.setItem('_u', JSON.stringify(next))
      return next
    })
  }, [])

  return (
    <AuthContext.Provider value={{ token, user, loginTime, login, logout, updateUser, isAuthenticated: token !== null }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
