import { Outlet, NavLink, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import DashboardHeader from './DashboardHeader'
import GA4Icon from '../../shared/icons/GA4Icon'
import MailIcon from '../../shared/icons/MailIcon'
import ProfileIcon from '../../shared/icons/ProfileIcon'
import LaunchIcon from '../../shared/icons/LaunchIcon'
import SubscribersIcon from '../../shared/icons/SubscribersIcon'

const navCls = ({ isActive }: { isActive: boolean }) =>
  [
    'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group',
    isActive
      ? 'bg-white/8 text-white'
      : 'text-slate-400 hover:text-white hover:bg-white/4',
  ].join(' ')

const mobileNavCls = ({ isActive }: { isActive: boolean }) =>
  [
    'flex flex-1 flex-col items-center gap-1 py-2 rounded-xl text-[10px] font-medium transition-all',
    isActive ? 'text-white' : 'text-slate-500 hover:text-white',
  ].join(' ')

export default function DashboardLayout() {
  const { t } = useTranslation()

  const navItems = [
    { path: '/dashboard/analytics',   label: t('dashboard.nav.analytics'),   sublabel: t('dashboard.nav.analyticsSub'),   Icon: GA4Icon },
    { path: '/dashboard/emails',       label: t('dashboard.nav.emails'),       sublabel: t('dashboard.nav.emailsSub'),       Icon: MailIcon },
    { path: '/dashboard/profile',      label: t('dashboard.nav.profile'),      sublabel: t('dashboard.nav.profileSub'),      Icon: ProfileIcon },
    { path: '/dashboard/coming-soon',  label: t('dashboard.nav.comingSoon'),    sublabel: t('dashboard.nav.comingSoonSub'),    Icon: LaunchIcon },
    { path: '/dashboard/subscribers',  label: t('dashboard.nav.subscribers'),   sublabel: t('dashboard.nav.subscribersSub'),  Icon: SubscribersIcon },
  ]

  return (
    <div className="min-h-screen bg-bg text-fg flex flex-col">
      <DashboardHeader />

      <div className="flex flex-1">
        {/* ── Desktop sidebar ─────────────────────────────────── */}
        <aside className="hidden md:flex flex-col w-56 shrink-0 border-r border-white/6 px-3 py-6 gap-0.5">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 px-3 mb-3">
            {t('dashboard.nav.sectionLabel')}
          </p>
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} className={navCls}>
              <item.Icon />
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium leading-tight truncate">{item.label}</span>
                <span className="text-[10px] text-slate-600 group-[.active]:text-slate-500 leading-tight truncate">
                  {item.sublabel}
                </span>
              </div>
            </NavLink>
          ))}
        </aside>

        {/* ── Main content ─────────────────────────────────────── */}
        <main className="flex-1 px-5 md:px-10 py-8 pb-24 md:pb-8 min-w-0">
          <Outlet />
        </main>
      </div>

      {/* ── Mobile bottom tab bar ────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 flex border-t border-white/6 bg-bg/90 backdrop-blur-md px-4 py-1 gap-2">
        {navItems.map((item) => (
          <NavLink key={item.path} to={item.path} className={mobileNavCls}>
            <item.Icon />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

/** Re-export so App.tsx can use it without a default-export redirect */
export { Navigate }
