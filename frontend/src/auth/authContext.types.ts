export interface AuthUser {
  id: number
  name: string
}

export interface AuthContextValue {
  user: AuthUser | null
  loginTime: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  updateUser: (partial: Partial<AuthUser>) => void
  isAuthenticated: boolean
  /** True while the initial session check (GET /me) is in flight on app load. */
  initializing: boolean
}
