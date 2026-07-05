import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import type { ReactNode } from 'react'

export default function PrivateRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, initializing } = useAuth()
  // Wait for the initial GET /me session check before deciding — otherwise
  // a hard refresh on /dashboard would briefly redirect to /login even for
  // an already-authenticated session.
  if (initializing) return null
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}
