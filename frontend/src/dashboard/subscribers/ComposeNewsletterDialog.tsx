import { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../lib/api';
import { sanitizeMessage, sanitizeUrl } from '../../contact/contact.utils';
import type { Subscription } from './subscribers.utils';

interface Props {
  sub: Subscription;
  onClose: () => void;
}

function autoResize(el: HTMLTextAreaElement) {
  el.style.height = 'auto';
  el.style.height = el.scrollHeight + 'px';
}

/** Shared class for inline-editable fields inside the template preview */
const editCls =
  'w-full bg-transparent outline-none resize-none ' +
  'border border-transparent rounded ' +
  'hover:border-white/15 focus:border-[#4D7CFE]/50 focus:bg-white/[0.04] ' +
  'px-1.5 transition-colors';

export default function ComposeNewsletterDialog({ sub, onClose }: Props) {
  const { t } = useTranslation();
  const uid = useId();

  const [form, setForm] = useState({
    subject: '',
    preview_text: '',
    eyebrow: 'ET-TALIBI',
    headline: '',
    intro: '',
    content_title: '',
    content: '',
    button_text: 'View More',
    button_url: 'https://ettalibi.com',
    footer_brand: 'ET-TALIBI',
    website: 'ettalibi.com',
    footer_note: '',
    subscription_text: '',
  });

  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSend = form.subject.trim() !== '';

  const field =
    (name: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [name]: sanitizeMessage(e.target.value) }));

  const fieldUrl =
    (name: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [name]: sanitizeUrl(e.target.value) }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      await api.post(`/subscriptions/${sub.id}/send`, form);
      onClose();
    } catch {
      setError(t('dashboard.subscribers.composeError'));
    } finally {
      setSending(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${uid}-title`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl border border-white/10 bg-[#0d1117] shadow-2xl overflow-hidden">

        {/* ── Header bar ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
          <h2 id={`${uid}-title`} className="text-base font-semibold text-white">
            {t('dashboard.subscribers.composeEyebrow')}
            <span className="ml-2 text-sm font-normal text-slate-500">{sub.email}</span>
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors"
            aria-label={t('dashboard.subscribers.composeCancel')}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col min-h-0 flex-1">
          <div className="overflow-y-auto flex-1">

            {/* ── Subject + Preview (email metadata, not in template body) ── */}
            <div className="px-6 pt-5 pb-3 space-y-3">
              <div>
                <label htmlFor={`${uid}-subject`} className="block text-xs font-medium text-slate-500 mb-1">
                  {t('dashboard.subscribers.composeSubject')} <span className="text-red-400">*</span>
                </label>
                <input
                  id={`${uid}-subject`}
                  name="subject"
                  type="text"
                  required
                  value={form.subject}
                  onChange={field('subject')}
                  placeholder="Enter email subject…"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white placeholder:text-slate-600 outline-none focus:border-accent/40 transition-colors"
                />
              </div>
              <div>
                <label htmlFor={`${uid}-preview`} className="block text-xs font-medium text-slate-500 mb-1">
                  {t('dashboard.subscribers.composePreviewText')}
                </label>
                <input
                  id={`${uid}-preview`}
                  name="preview_text"
                  type="text"
                  value={form.preview_text}
                  onChange={field('preview_text')}
                  placeholder="Short preview shown in inbox…"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white placeholder:text-slate-600 outline-none focus:border-accent/40 transition-colors"
                />
              </div>
            </div>

            {/* ── Hint ── */}
            <p className="px-6 py-1 text-[11px] text-slate-600 flex items-center gap-1.5">
              <svg width="11" height="11" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
                <path d="M10 9v5m0-8h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Click any field below to edit
            </p>

            {/* ── Live template preview ── */}
            <div className="px-4 pb-5">
              <div className="rounded-xl p-4" style={{ background: '#050816' }}>
                <div className="rounded-[20px] border border-[#1B2440] overflow-hidden" style={{ background: '#0B1020' }}>

                  {/* HEADER section */}
                  <div
                    className="px-9 pt-10 pb-7"
                    style={{ background: 'linear-gradient(180deg,#0B1020 0%,#070B16 100%)' }}
                  >
                    <input
                      id={`${uid}-eyebrow`}
                      name="eyebrow"
                      type="text"
                      value={form.eyebrow}
                      onChange={field('eyebrow')}
                      placeholder="EYEBROW"
                      aria-label={t('dashboard.subscribers.composeEyebrowLabel')}
                      className={`${editCls} text-[#4D7CFE] text-[11px] tracking-[4px] uppercase font-bold mb-3 block`}
                    />
                    <input
                      id={`${uid}-headline`}
                      name="headline"
                      type="text"
                      value={form.headline}
                      onChange={field('headline')}
                      placeholder="Your headline here…"
                      aria-label={t('dashboard.subscribers.composeHeadline')}
                      className={`${editCls} text-white text-[28px] font-bold leading-tight mb-3 block`}
                    />
                    <textarea
                      id={`${uid}-intro`}
                      name="intro"
                      value={form.intro}
                      onChange={e => { field('intro')(e); autoResize(e.target); }}
                      onFocus={e => autoResize(e.target)}
                      placeholder="Intro paragraph…"
                      rows={2}
                      aria-label={t('dashboard.subscribers.composeIntro')}
                      className={`${editCls} text-[#AEB7D0] text-[15px] leading-relaxed block`}
                    />
                  </div>

                  {/* Divider */}
                  <div className="mx-9 h-px bg-[#1A233A]" />

                  {/* CONTENT section */}
                  <div className="px-9 py-8">
                    <input
                      id={`${uid}-content-title`}
                      name="content_title"
                      type="text"
                      value={form.content_title}
                      onChange={field('content_title')}
                      placeholder="Section title…"
                      aria-label={t('dashboard.subscribers.composeContentTitle')}
                      className={`${editCls} text-white text-xl font-semibold mb-4 block`}
                    />
                    <textarea
                      id={`${uid}-content`}
                      name="content"
                      value={form.content}
                      onChange={e => { field('content')(e); autoResize(e.target); }}
                      onFocus={e => autoResize(e.target)}
                      placeholder="Write your main content here…"
                      rows={4}
                      aria-label={t('dashboard.subscribers.composeContent')}
                      className={`${editCls} text-[#B7C0D8] text-sm leading-relaxed mb-8 block`}
                    />

                    {/* CTA button */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="bg-[#4D7CFE] rounded-xl px-6 py-3 flex items-center justify-center">
                        <input
                          id={`${uid}-button-text`}
                          name="button_text"
                          type="text"
                          value={form.button_text}
                          onChange={field('button_text')}
                          placeholder="Button text"
                          aria-label={t('dashboard.subscribers.composeButtonText')}
                          className="bg-transparent text-white text-sm font-semibold text-center outline-none w-36 placeholder:text-white/40"
                        />
                      </div>
                      {/* Button URL beneath the button */}
                      <div className="flex items-center gap-1.5">
                        <svg className="w-3 h-3 text-slate-600 shrink-0" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                          <path d="M8.5 11.5a4 4 0 005.7 0l2-2a4 4 0 00-5.7-5.7l-1.1 1.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          <path d="M11.5 8.5a4 4 0 00-5.7 0l-2 2a4 4 0 005.7 5.7l1.1-1.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        <input
                          id={`${uid}-button-url`}
                          name="button_url"
                          type="text"
                          inputMode="url"
                          value={form.button_url}
                          onChange={fieldUrl('button_url')}
                          placeholder="https://…"
                          aria-label={t('dashboard.subscribers.composeButtonUrl')}
                          className="text-xs text-slate-500 bg-transparent outline-none border-b border-transparent hover:border-white/15 focus:border-[#4D7CFE]/50 transition-colors w-56 text-center placeholder:text-slate-600"
                        />
                      </div>
                    </div>
                  </div>

                  {/* FOOTER section */}
                  <div className="px-9 py-7 border-t border-[#1A233A] flex flex-col items-center gap-1" style={{ background: '#070B16' }}>
                    <input
                      id={`${uid}-footer-brand`}
                      name="footer_brand"
                      type="text"
                      value={form.footer_brand}
                      onChange={field('footer_brand')}
                      placeholder="Brand name"
                      aria-label={t('dashboard.subscribers.composeFooterBrand')}
                      className={`${editCls} text-[#6B7280] text-[11px] text-center w-52`}
                    />
                    <input
                      id={`${uid}-website`}
                      name="website"
                      type="text"
                      value={form.website}
                      onChange={fieldUrl('website')}
                      placeholder="website.com"
                      aria-label={t('dashboard.subscribers.composeWebsite')}
                      className={`${editCls} text-[#6B7280] text-[11px] text-center w-52`}
                    />
                    <input
                      id={`${uid}-footer-note`}
                      name="footer_note"
                      type="text"
                      value={form.footer_note}
                      onChange={field('footer_note')}
                      placeholder="Footer note…"
                      aria-label={t('dashboard.subscribers.composeFooterNote')}
                      className={`${editCls} text-[#6B7280] text-[11px] text-center w-72`}
                    />
                    <input
                      id={`${uid}-subscription-text`}
                      name="subscription_text"
                      type="text"
                      value={form.subscription_text}
                      onChange={field('subscription_text')}
                      placeholder="You're receiving this because you subscribed…"
                      aria-label={t('dashboard.subscribers.composeSubscriptionText')}
                      className={`${editCls} text-[#4B5563] text-[10px] text-center w-72`}
                    />
                    <span className="text-[#4D7CFE] text-[11px] mt-0.5 pointer-events-none select-none">
                      Unsubscribe
                    </span>
                  </div>

                </div>
              </div>
            </div>

            {error && <p className="px-6 pb-4 text-sm text-red-400">{error}</p>}
          </div>

          {/* ── Actions ── */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-white border border-white/10 hover:border-white/20 transition-colors"
            >
              {t('dashboard.subscribers.composeCancel')}
            </button>
            {canSend && (
              <button
                type="submit"
                disabled={sending}
                className="px-5 py-2 rounded-xl text-sm font-medium bg-accent text-[#07090c] hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {sending ? t('dashboard.subscribers.composeSending') : t('dashboard.subscribers.composeSend')}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

