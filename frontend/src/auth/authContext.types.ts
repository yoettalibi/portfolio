export interface AuthUser {
  id: number
  name: string
}

export interface AuthContextValue {
  token: string | null
  user: AuthUser | null
  loginTime: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  updateUser: (partial: Partial<AuthUser>) => void
  isAuthenticated: boolean
}
