import { createBrowserRouter, RouterProvider, Outlet, Navigate, useLocation } from 'react-router-dom'
import { lazy, Suspense, useState, useEffect } from 'react'
import { AuthProvider } from './auth/AuthContext'
import PrivateRoute from './auth/PrivateRoute'
import GuestRoute from './auth/GuestRoute'
import Layout from './shared/Layout'
import { useAnalytics } from './hooks/useAnalytics'
import api from './lib/api'
import ComingSoonPage from './coming-soon/ComingSoonPage'

const LoginPage       = lazy(() => import('./auth/LoginPage'))
const HomePage        = lazy(() => import('./home/HomePage'))
const ContactPage     = lazy(() => import('./contact/ContactPage'))
const DashboardLayout = lazy(() => import('./dashboard/layout/DashboardLayout'))
const DashboardPage   = lazy(() => import('./dashboard/analytics/DashboardPage'))
const EmailsPage      = lazy(() => import('./dashboard/emails/EmailsPage'))
const ProfilePage     = lazy(() => import('./dashboard/profile/ProfilePage'))
const WorkProjectPage = lazy(() => import('./work/WorkProjectPage'))
const AboutPage       = lazy(() => import('./about/AboutPage'))
const PrivacyPage          = lazy(() => import('./legal/PrivacyPage'))
const TermsPage            = lazy(() => import('./legal/TermsPage'))
const CookiesPage          = lazy(() => import('./legal/CookiesPage'))
const NotFoundPage         = lazy(() => import('./shared/NotFoundPage'))
const ComingSoonSettingsPage = lazy(() => import('./dashboard/coming-soon/ComingSoonSettingsPage'))
const SubscribersPage        = lazy(() => import('./dashboard/subscribers/SubscribersPage'))

function Root() {
  const location = useLocation()
  const [settings, setSettings] = useState<Record<string, string | null>>({})
  const [settled, setSettled] = useState(false)

  useEffect(() => {
    api.get<Record<string, string | null>>('/settings')
      .then(({ data }) => setSettings(data))
      .catch(() => setSettings({}))
      .finally(() => setSettled(true))
  }, [])

  // Pass ga4_id from the already-fetched settings — no extra network request.
  useAnalytics(settled ? settings.ga4_id : undefined)

  if (!settled) return null

  const isPrivate =
    location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/login')

  if (settings.coming_soon_enabled === '1' && !isPrivate) {
    return <ComingSoonPage settings={settings} />
  }

  return (
    <AuthProvider>
      <Suspense fallback={null}>
        <Outlet />
      </Suspense>
    </AuthProvider>
  )
}

const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      // Public pages with Navbar + Footer via the Layout route
      {
        element: <Layout />,
        children: [
          { path: '/',          element: <HomePage /> },
          { path: '/contact',   element: <ContactPage /> },
          { path: '/about',     element: <AboutPage /> },
          { path: '/work/:slug', element: <WorkProjectPage /> },
          { path: '/privacy',   element: <PrivacyPage /> },
          { path: '/terms',     element: <TermsPage /> },
          { path: '/cookies',   element: <CookiesPage /> },
          { path: '/login',     element: <GuestRoute><LoginPage /></GuestRoute> },
          { path: '*',          element: <NotFoundPage /> },
        ],
      },

      // Protected area — nested dashboard routes with shared sidebar layout
      {
        path: '/dashboard',
        element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
        children: [
          { index: true, element: <Navigate to="/dashboard/analytics" replace /> },
          { path: 'analytics',   element: <DashboardPage /> },
          { path: 'emails',      element: <EmailsPage /> },
          { path: 'profile',     element: <ProfilePage /> },
          { path: 'coming-soon', element: <ComingSoonSettingsPage /> },
          { path: 'subscribers', element: <SubscribersPage /> },
        ],
      },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
