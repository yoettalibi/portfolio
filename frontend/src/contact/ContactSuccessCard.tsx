import { useTranslation } from 'react-i18next'
import { serviceOptions } from './contact.types'

interface Props {
  firstName: string
  subjects: string[]
  onReset: () => void
}

export default function ContactSuccessCard({ firstName, subjects, onReset }: Props) {
  const { t } = useTranslation()

  return (
    <div className="rounded-3xl border border-white/7 bg-white/2 p-8 flex flex-col gap-6">
      {/* Heading + icon inline */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-white leading-snug">
            {t('contact.form.successHeading')}
            {firstName && <span className="text-accent">, {firstName}</span>}
          </h2>
          <div className="shrink-0 w-11 h-11 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 13l4 4L19 7" stroke="#7ea8ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <p className="text-slate-400 text-sm leading-[1.8]">
          {t('contact.form.successBody')}
        </p>
      </div>

      {/* Selected services */}
      {subjects.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {subjects.map((id) => {
            const opt = serviceOptions.find((o) => o.id === id)
            if (!opt) return null
            return (
              <span
                key={id}
                className="inline-flex items-center rounded-xl border border-accent/15 bg-accent/6 px-3 py-1 text-xs font-medium text-accent"
              >
                {t(opt.title)}
              </span>
            )
          })}
        </div>
      )}

      {/* Divider */}
      <div className="w-full h-px bg-white/6" />

      {/* CTA */}
      <button
        type="button"
        onClick={onReset}
        className="self-start text-xs font-medium text-slate-500 hover:text-white transition-colors duration-200 underline underline-offset-4"
      >
        {t('contact.form.successReset')}
      </button>
    </div>
  )
}
