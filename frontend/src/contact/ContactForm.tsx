import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { serviceOptions, inputCls } from './contact.types'
import { useContactForm } from './useContactForm'
import SpinnerIcon from '../shared/icons/SpinnerIcon'

const CheckSvg = () => (
  <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
    <path d="M1 3l2 2 4-4" stroke="#7ea8ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export default function ContactForm({ onSent }: { onSent?: (firstName: string, subjects: string[]) => void }) {
  const { t } = useTranslation()
  const [termsAccepted, setTermsAccepted] = useState(false)
  const {
    form, emailError, sending, submitError,
    isFormReady, step2Ref,
    handleChange, handleEmailBlur, toggleSubject, handleSubmit,
  } = useContactForm(onSent)

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

      {/* Step 1 — service selection */}
      <div className="flex flex-col gap-3">
        <span className="text-xs text-slate-300 uppercase tracking-widest">
          {t('contact.form.step1Label')}
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {serviceOptions.map(({ id, title, desc }, i) => {
            const active = form.subjects.includes(id)
            const dimmed = form.subjects.length > 0 && !active
            return (
              <button
                key={id}
                type="button"
                onClick={() => toggleSubject(id)}
                className={[
                  'flex items-start gap-4 p-4 rounded-2xl border text-left transition-all duration-300',
                  active
                    ? 'border-accent/40 bg-accent/7'
                    : 'border-white/7 bg-white/2 hover:border-white/14 hover:bg-white/4',
                  dimmed ? 'opacity-55 scale-[0.99]' : 'opacity-100 scale-100',
                ].join(' ')}
              >
                <span className={`shrink-0 text-[10px] font-bold tracking-widest mt-0.5 transition-colors duration-200 ${active ? 'text-accent' : 'text-slate-400'}`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="flex flex-col gap-1">
                  <span className={`text-[15px] font-semibold leading-snug transition-colors duration-200 ${active ? 'text-white' : 'text-white/85'}`}>
                    {t(title)}
                  </span>
                  <span className="text-[13px] text-slate-300 leading-[1.65]">{t(desc)}</span>
                </span>
                <span className={[
                  'ml-auto shrink-0 mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-200',
                  active ? 'border-accent bg-accent/20' : 'border-white/20',
                ].join(' ')}>
                  {active && <CheckSvg />}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Step 2 — reveal after selection */}
      <div
        ref={step2Ref}
        className={`flex flex-col gap-0 transition-all duration-500 ease-out origin-top ${
          form.subjects.length > 0
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-2 pointer-events-none h-0 overflow-hidden'
        }`}
      >
        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/8 to-transparent" />
          <span className="text-[11px] uppercase tracking-[0.2em] text-slate-400 shrink-0">{t('contact.form.detailsLabel')}</span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/8 to-transparent" />
        </div>

        {/* Frosted card */}
        <div className="rounded-3xl border border-white/7 bg-white/2 p-6 flex flex-col gap-5">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="flex items-center gap-2 text-[11px] font-medium text-white uppercase tracking-[0.15em]">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="opacity-60">
                  <circle cx="6" cy="4" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
                  <path d="M1.5 10.5c0-2.485 2.015-4 4.5-4s4.5 1.515 4.5 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                {t('contact.form.nameLabel')}
              </label>
              <input id="name" name="name" type="text" required={form.subjects.length > 0}
                placeholder={t('contact.form.namePlaceholder')} value={form.name} onChange={handleChange} className={inputCls} />
              {form.name.length > 0 && form.name.trim().length < 5 && (
                <p className="text-[11px] text-amber-400/80 mt-0.5">
                  {t('contact.form.nameMinHint')} ({form.name.trim().length}/5)
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="flex items-center gap-2 text-[11px] font-medium text-white uppercase tracking-[0.15em]">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="opacity-60">
                  <rect x="1" y="2.5" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                  <path d="M1 4l5 3.5L11 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                {t('contact.form.emailLabel')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required={form.subjects.length > 0}
                placeholder={t('contact.form.emailPlaceholder')}
                value={form.email}
                onChange={handleChange}
                onBlur={handleEmailBlur}
                className={
                  inputCls +
                  (emailError
                    ? ' !border-red-400/60 focus:!border-red-400/60 bg-red-500/5'
                    : form.email && !emailError
                    ? ' !border-emerald-400/40 focus:!border-emerald-400/50'
                    : '')
                }
                aria-invalid={!!emailError}
                aria-describedby={emailError ? 'email-error' : undefined}
              />
              {emailError && (
                <p id="email-error" role="alert" className="flex items-center gap-1.5 text-[11px] text-red-400 leading-snug mt-0.5">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                    <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.2"/>
                    <path d="M5 3v2.5M5 7h.01" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                  {t(emailError)}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="message" className="flex items-center gap-2 text-[11px] font-medium text-white uppercase tracking-[0.15em]">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="opacity-60">
                <rect x="1" y="1" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M3.5 4h5M3.5 6.5h5M3.5 9h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              {t('contact.form.messageLabel')}
            </label>
            <textarea id="message" name="message" required={form.subjects.length > 0} rows={5}
              placeholder={t('contact.form.messagePlaceholder')}
              value={form.message} onChange={handleChange} className={inputCls + ' resize-none'} />
            <div className="flex items-center justify-between mt-0.5">
              <p className="text-[11px] text-slate-500">{t('contact.form.messageMinHint')}</p>
              <p className={`text-[11px] font-medium tabular-nums transition-colors duration-200 ${
                form.message.trim().length >= 150 ? 'text-emerald-400/80' : 'text-slate-400'
              }`}>
                {form.message.length}<span className="text-slate-600">/150</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-1">
            {/* Terms & Privacy checkbox */}
            <label className="flex items-start gap-3 cursor-pointer group select-none">
              <span className="relative mt-0.5 shrink-0">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="sr-only peer"
                />
                <span className="flex items-center justify-center w-4 h-4 rounded border border-white/20 bg-white/3 transition-all duration-200 peer-checked:border-accent/60 peer-checked:bg-accent/15">
                  {termsAccepted && <CheckSvg />}
                </span>
              </span>
              <span className="text-[11px] text-slate-400 leading-[1.6] group-hover:text-slate-300 transition-colors duration-200">
                {t('contact.form.termsCheckPre')}{' '}
                <Link to="/privacy" target="_blank" className="text-accent hover:underline">{t('contact.form.termsPrivacy')}</Link>
                {' '}{t('contact.form.termsAnd')}{' '}
                <Link to="/terms" target="_blank" className="text-accent hover:underline">{t('contact.form.termsTerms')}</Link>
              </span>
            </label>

            <div className="flex items-center justify-between">
              <p className="text-[11px] text-white/75 leading-[1.6]">
                {t('contact.form.personalNote')}<br />{t('contact.form.replyNote')}
              </p>
              <button
                type="submit"
                disabled={sending}
                className={`group flex items-center gap-2.5 rounded-2xl px-6 py-3.5 text-sm font-semibold text-white border border-accent/22 bg-gradient-to-br from-accent/18 to-white/5 hover:border-accent/40 transition-all duration-300 origin-right ${
                  isFormReady && termsAccepted ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
                }`}
              >
                {sending ? 'Sending…' : t('contact.form.submit')}
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-accent/20 group-hover:bg-accent/30 transition-colors duration-300">
                  {sending ? (
                    <SpinnerIcon className="w-3 h-3" />
                  ) : (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5h6M5.5 2.5L8 5l-2.5 2.5" stroke="#7ea8ff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </span>
              </button>
            </div>
            {submitError && (
              <p className="text-[11px] text-red-400 text-right">{submitError}</p>
            )}
          </div>

        </div>
      </div>
    </form>
  )
}
