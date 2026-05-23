import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import api from '../lib/api'
import { validateEmail } from '../contact/contact.utils'

interface Settings {
  coming_soon_title?: string | null
  coming_soon_desc?: string | null
  coming_soon_launch_date?: string | null
  coming_soon_social_github?: string | null
  coming_soon_social_linkedin?: string | null
  coming_soon_social_instagram?: string | null
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calcTimeLeft(iso: string): TimeLeft | null {
  const diff = new Date(iso).getTime() - Date.now()
  if (diff <= 0) return null
  return {
    days:    Math.floor(diff / 86400000),
    hours:   Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  }
}

function GitHubSvg() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

function LinkedInSvg() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function InstagramSvg() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  )
}

export default function ComingSoonPage({ settings }: { settings: Settings }) {
  const { t } = useTranslation()

  const title = settings.coming_soon_title ?? t('comingSoon.defaultTitle')
  const desc  = settings.coming_soon_desc  ?? t('comingSoon.defaultDesc')

  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(
    settings.coming_soon_launch_date ? calcTimeLeft(settings.coming_soon_launch_date) : null,
  )

  useEffect(() => {
    if (!settings.coming_soon_launch_date) return
    const id = setInterval(
      () => setTimeLeft(calcTimeLeft(settings.coming_soon_launch_date!)),
      1000,
    )
    return () => clearInterval(id)
  }, [settings.coming_soon_launch_date])

  const [email, setEmail] = useState('')
  const emailValid = email.trim() !== '' && validateEmail(email) === ''
  const [subStatus, setSubStatus] = useState<'idle' | 'sending' | 'success' | 'duplicate' | 'error'>('idle')

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault()
    setSubStatus('sending')
    try {
      await api.post('/subscribe', { email })
      setSubStatus('success')
    } catch (err: unknown) {
      const status = (err as { response?: { status: number } })?.response?.status
      setSubStatus(status === 409 ? 'duplicate' : 'error')
    }
  }

  const socials = [
    { key: 'github',    url: settings.coming_soon_social_github,    label: 'GitHub',    Icon: GitHubSvg },
    { key: 'linkedin',  url: settings.coming_soon_social_linkedin,  label: 'LinkedIn',  Icon: LinkedInSvg },
    { key: 'instagram', url: settings.coming_soon_social_instagram, label: 'Instagram', Icon: InstagramSvg },
  ].filter((s) => s.url)

  const countdownItems = timeLeft
    ? [
        { v: timeLeft.days,    l: t('comingSoon.countdown.days') },
        { v: timeLeft.hours,   l: t('comingSoon.countdown.hours') },
        { v: timeLeft.minutes, l: t('comingSoon.countdown.minutes') },
        { v: timeLeft.seconds, l: t('comingSoon.countdown.seconds') },
      ]
    : []

  return (
    <div className="min-h-screen bg-[#07090c] flex items-center justify-center relative overflow-hidden">
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 90% 65% at 50% 35%, rgba(126,168,255,0.07) 0%, transparent 70%)',
        }}
      />
      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.018]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      <div className="relative z-10 text-center px-6 max-w-2xl w-full mx-auto py-20">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 border border-[#7ea8ff]/20 bg-[#7ea8ff]/5 rounded-full px-4 py-1.5 mb-10">
          <span className="w-1.5 h-1.5 rounded-full bg-[#7ea8ff] animate-pulse" />
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#7ea8ff]">
            {t('comingSoon.badge')}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.05] mb-5">
          {title}
        </h1>

        {/* Description */}
        <p className="text-slate-400 text-base sm:text-lg leading-relaxed mb-14 max-w-lg mx-auto">
          {desc}
        </p>

        {/* Countdown */}
        {countdownItems.length > 0 && (
          <div className="grid grid-cols-4 gap-3 mb-14 max-w-sm mx-auto">
            {countdownItems.map(({ v, l }) => (
              <div
                key={l}
                className="flex flex-col items-center gap-2 rounded-2xl border border-white/8 bg-white/[0.03] px-2 py-5"
              >
                <span className="text-3xl sm:text-4xl font-black text-white tabular-nums leading-none">
                  {String(v).padStart(2, '0')}
                </span>
                <span className="text-[9px] font-bold tracking-[0.18em] uppercase text-slate-500">
                  {l}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Subscription */}
        {subStatus === 'success' ? (
          <div className="inline-flex items-center gap-2.5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-6 py-4 text-sm text-emerald-400 mb-14">
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M3 8l3.5 3.5L13 4"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {t('comingSoon.subscribe.success')}
          </div>
        ) : (
          <div className="mb-14">
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                id="subscribe-email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('comingSoon.subscribe.placeholder')}
                className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-[#7ea8ff]/50 transition-colors"
              />
              <button
                type="submit"
                disabled={!emailValid || subStatus === 'sending'}
                className="shrink-0 rounded-xl bg-[#7ea8ff] text-[#07090c] text-sm font-semibold px-6 py-3 hover:brightness-110 transition-all disabled:opacity-60 cursor-pointer"
              >
                {subStatus === 'sending'
                  ? t('comingSoon.subscribe.sending')
                  : t('comingSoon.subscribe.button')}
              </button>
            </form>
            {(subStatus === 'duplicate' || subStatus === 'error') && (
              <p className="text-red-400 text-xs mt-3">
                {subStatus === 'duplicate'
                  ? t('comingSoon.subscribe.alreadySubscribed')
                  : t('comingSoon.subscribe.error')}
              </p>
            )}
          </div>
        )}

        {/* Socials */}
        {socials.length > 0 && (
          <div className="flex items-center justify-center gap-5">
            {socials.map(({ key, url, label, Icon }) => (
              <a
                key={key}
                href={url!}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-slate-500 hover:text-white transition-colors duration-200"
              >
                <Icon />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
