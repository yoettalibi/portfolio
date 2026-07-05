import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import type { ReactNode } from 'react'

/** Redirects already-authenticated users away from public-only pages (e.g. /login). */
export default function GuestRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, initializing } = useAuth()
  if (initializing) return null
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <>{children}</>
}
