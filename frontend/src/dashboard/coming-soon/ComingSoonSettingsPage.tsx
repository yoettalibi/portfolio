import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import api from '../../lib/api'
import { type Settings } from './comingSoon.utils'
import { Field } from './Field'
import { DateTimePicker } from './DateTimePicker'


export default function ComingSoonSettingsPage() {
  const { t } = useTranslation()

  const [enabled, setEnabled] = useState(false)
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [launchDate, setLaunchDate] = useState('')
  const [socialGithub, setSocialGithub] = useState('')
  const [socialLinkedin, setSocialLinkedin] = useState('')
  const [socialInstagram, setSocialInstagram] = useState('')

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    api.get<Settings>('/settings').then(({ data }) => {
      setEnabled(data.coming_soon_enabled === '1')
      setTitle(data.coming_soon_title ?? '')
      setDesc(data.coming_soon_desc ?? '')
      const d = data.coming_soon_launch_date
      setLaunchDate(d ? d.replace(' ', 'T').slice(0, 16) : '')
      setSocialGithub(data.coming_soon_social_github ?? '')
      setSocialLinkedin(data.coming_soon_social_linkedin ?? '')
      setSocialInstagram(data.coming_soon_social_instagram ?? '')
    }).catch(() => {})
  }, [])

  async function handleSave() {
    setSaveError(null)
    setSaved(false)
    setSaving(true)
    try {
      await api.patch('/settings', {
        coming_soon_enabled: enabled,
        coming_soon_title: title || null,
        coming_soon_desc: desc || null,
        coming_soon_launch_date: launchDate || null,
        coming_soon_social_github: socialGithub || null,
        coming_soon_social_linkedin: socialLinkedin || null,
        coming_soon_social_instagram: socialInstagram || null,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setSaveError(t('dashboard.comingSoon.saveError'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-semibold tracking-[0.15em] uppercase text-[#7ea8ff] mb-2">
          {t('dashboard.comingSoon.eyebrow')}
        </p>
        <h1 className="text-3xl font-bold text-white/90">
          {t('dashboard.comingSoon.heading')}{' '}
          <span className="text-white/30">{t('dashboard.comingSoon.headingFade')}</span>
        </h1>
        <p className="text-slate-400 mt-2 text-sm">{t('dashboard.comingSoon.body')}</p>
      </div>

      {/* Toggle */}
      <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 mb-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-white/90">
              {t('dashboard.comingSoon.enabledLabel')}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {enabled
                ? t('dashboard.comingSoon.enabledOn')
                : t('dashboard.comingSoon.enabledOff')}
            </p>
          </div>
          <button
            role="switch"
            aria-checked={enabled}
            onClick={() => setEnabled((v) => !v)}
            className={[
              'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 cursor-pointer',
              enabled ? 'bg-[#7ea8ff]' : 'bg-white/10',
            ].join(' ')}
          >
            <span
              className={[
                'inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200',
                enabled ? 'translate-x-6' : 'translate-x-1',
              ].join(' ')}
            />
          </button>
        </div>
      </div>

      {/* Content + Socials — 2-col grid on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">

        {/* Content */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 flex flex-col gap-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            {t('dashboard.comingSoon.sectionContent')}
          </p>
          <Field
            label={t('dashboard.comingSoon.title')}
            value={title}
            onChange={setTitle}
            placeholder={t('comingSoon.defaultTitle')}
          />
          <Field
            label={t('dashboard.comingSoon.desc')}
            value={desc}
            onChange={setDesc}
            placeholder={t('comingSoon.defaultDesc')}
            rows={4}
            textarea
          />
          <DateTimePicker
            label={t('dashboard.comingSoon.launchDate')}
            value={launchDate}
            onChange={setLaunchDate}
          />
        </div>

        {/* Socials */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 flex flex-col gap-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            {t('dashboard.comingSoon.sectionSocials')}
          </p>
          <Field
            label={t('dashboard.comingSoon.socialGithub')}
            value={socialGithub}
            onChange={setSocialGithub}
            placeholder="https://github.com/…"
          />
          <Field
            label={t('dashboard.comingSoon.socialLinkedin')}
            value={socialLinkedin}
            onChange={setSocialLinkedin}
            placeholder="https://linkedin.com/in/…"
          />
          <Field
            label={t('dashboard.comingSoon.socialInstagram')}
            value={socialInstagram}
            onChange={setSocialInstagram}
            placeholder="https://instagram.com/…"
          />
        </div>

      </div>

      {/* Save */}
      <div className="flex items-center gap-4 mb-14">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-xl bg-[#7ea8ff] text-[#07090c] text-sm font-semibold px-6 py-2.5 hover:brightness-110 transition-all disabled:opacity-60 cursor-pointer"
        >
          {saving ? t('dashboard.comingSoon.saving') : t('dashboard.comingSoon.save')}
        </button>
        {saved && (
          <p className="text-emerald-400 text-sm">{t('dashboard.comingSoon.saveSuccess')}</p>
        )}
        {saveError && <p className="text-red-400 text-sm">{saveError}</p>}
      </div>

    </div>
  )
}
