import { useTranslation } from 'react-i18next'

export default function ContactHeader() {
  const { t } = useTranslation()

  return (
    <div className="max-w-[680px] mb-14">
      <p className="uppercase tracking-[0.2em] text-xs text-slate-400 mb-3">{t('contact.label')}</p>
      <h1 className="text-[clamp(26px,3.5vw,48px)] leading-[1.1] font-extrabold mb-4">
        {t('contact.heading')}{' '}
        <span className="text-white/50">{t('contact.headingFade')}</span>
      </h1>
      <p className="text-slate-400 text-base leading-[1.8]">
        {t('contact.body')}
      </p>
    </div>
  )
}
