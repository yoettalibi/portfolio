import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../../lib/api'
import SpinnerIcon from '../../shared/icons/SpinnerIcon'
import { Field } from '../coming-soon/Field'
import { emptyLocaleForm, type Locale, type Project, type ProjectFormLocale } from '../../projects/projects.types'

const inputCls =
  'w-full rounded-xl border border-white/10 bg-white/4 px-4 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-accent/50 transition-colors [color-scheme:dark]'

const slugify = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

function Toggle({ checked, onChange, label, help }: {
  checked: boolean; onChange: (v: boolean) => void; label: string; help: string
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-white/90">{label}</p>
        <p className="text-xs text-slate-500 mt-0.5">{help}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={[
          'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 cursor-pointer',
          checked ? 'bg-accent' : 'bg-white/10',
        ].join(' ')}
      >
        <span className={[
          'inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200',
          checked ? 'translate-x-6' : 'translate-x-1',
        ].join(' ')} />
      </button>
    </div>
  )
}

export default function ProjectFormPage() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = id !== undefined

  const [locale, setLocale] = useState<Locale>('en')
  const [form, setForm] = useState<Record<Locale, ProjectFormLocale>>({ en: emptyLocaleForm(), fr: emptyLocaleForm() })
  const [slug, setSlug] = useState('')
  const [slugTouched, setSlugTouched] = useState(false)
  const [url, setUrl] = useState('')
  const [sortOrder, setSortOrder] = useState('0')
  const [featured, setFeatured] = useState(false)
  const [published, setPublished] = useState(true)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [removeImage, setRemoveImage] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(isEdit)
  const [notFound, setNotFound] = useState(false)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  // Load existing project when editing
  useEffect(() => {
    if (!isEdit) return
    api.get<{ data: Project[] }>('/admin/projects')
      .then(({ data }) => {
        const p = data.data.find((x) => x.id === Number(id))
        if (!p) { setNotFound(true); return }
        setSlug(p.slug)
        setSlugTouched(true)
        setUrl(p.url ?? '')
        setSortOrder(String(p.sort_order))
        setFeatured(p.featured)
        setPublished(p.published)
        setImagePreview(p.image_url)
        setForm({
          en: {
            title: p.title.en ?? '',
            category: p.category.en ?? '',
            description: p.description.en ?? '',
            tags: p.tags.en ?? [],
          },
          fr: {
            title: p.title.fr ?? '',
            category: p.category.fr ?? '',
            description: p.description.fr ?? '',
            tags: p.tags.fr ?? [],
          },
        })
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const cur = form[locale]
  const set = <K extends keyof ProjectFormLocale>(key: K, value: ProjectFormLocale[K]) =>
    setForm((f) => ({ ...f, [locale]: { ...f[locale], [key]: value } }))

  // Auto-suggest slug from the EN title on the create form (until manually edited)
  const onTitleChange = (v: string) => {
    set('title', v)
    if (!isEdit && !slugTouched && locale === 'en') setSlug(slugify(v))
  }

  function pickImage(file: File | undefined) {
    if (!file) return
    setRemoveImage(false)
    setImageFile(file)
    setImagePreview((prev) => {
      if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev)
      return URL.createObjectURL(file)
    })
  }

  async function handleSave() {
    setSaving(true)
    setErrors([])

    const fd = new FormData()
    fd.append('slug', slug)
    for (const loc of ['en', 'fr'] as const) {
      const f = form[loc]
      if (f.title) fd.append(`title[${loc}]`, f.title)
      if (f.category) fd.append(`category[${loc}]`, f.category)
      if (f.description) fd.append(`description[${loc}]`, f.description)
      f.tags.filter(Boolean).forEach((tag) => fd.append(`tags[${loc}][]`, tag))
    }
    fd.append('url', url)
    fd.append('sort_order', sortOrder || '0')
    fd.append('featured', featured ? '1' : '0')
    fd.append('published', published ? '1' : '0')
    if (imageFile) fd.append('image', imageFile)
    else if (removeImage) fd.append('remove_image', '1')

    try {
      const res = await api.post(isEdit ? `/admin/projects/${id}` : '/admin/projects', fd)
      if (res.status === 422) {
        const errs = res.data?.errors as Record<string, string[]> | undefined
        setErrors(errs ? Object.values(errs).flat() : [t('dashboard.projects.form.saveError')])
        return
      }
      navigate('/dashboard/projects')
    } catch {
      setErrors([t('dashboard.projects.form.saveError')])
    } finally {
      setSaving(false)
    }
  }

  const missingRequired = useMemo(
    () => !slug || !form.en.title || !form.en.category || !form.en.description,
    [slug, form.en.title, form.en.category, form.en.description],
  )

  if (loading) {
    return <div className="flex justify-center py-20"><SpinnerIcon /></div>
  }

  if (notFound) {
    return (
      <div>
        <p className="text-white/60 font-semibold mb-3">{t('dashboard.projects.form.notFound')}</p>
        <Link to="/dashboard/projects" className="text-accent text-sm">{t('dashboard.projects.form.back')}</Link>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link to="/dashboard/projects" className="text-xs text-slate-500 hover:text-white transition-colors">
          ← {t('dashboard.projects.form.back')}
        </Link>
        <h1 className="text-3xl font-bold text-white/90 mt-3">
          {isEdit ? t('dashboard.projects.form.editTitle') : t('dashboard.projects.form.createTitle')}
        </h1>
      </div>

      {/* ── General ─────────────────────────────────────────── */}
      <div className="rounded-2xl border border-white/8 bg-white/2 p-5 mb-5 flex flex-col gap-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
          {t('dashboard.projects.form.sectionGeneral')}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <Field
              label={t('dashboard.projects.form.slug')}
              value={slug}
              onChange={(v) => { setSlugTouched(true); setSlug(v) }}
              placeholder="my-project"
            />
            <p className="text-[11px] text-slate-600 mt-1.5">{t('dashboard.projects.form.slugHelp')}</p>
          </div>
          <Field
            label={t('dashboard.projects.form.url')}
            value={url}
            onChange={setUrl}
            placeholder="https://…"
            type="url"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field
            label={t('dashboard.projects.form.sortOrder')}
            value={sortOrder}
            onChange={setSortOrder}
            type="number"
          />
          {/* Image */}
          <div>
            <p className="text-xs text-slate-500 font-medium mb-1.5">{t('dashboard.projects.form.image')}</p>
            <div className="flex items-center gap-3">
              {imagePreview && !removeImage ? (
                <img src={imagePreview} alt="" className="w-20 h-14 object-cover rounded-lg border border-white/10" />
              ) : (
                <div className="w-20 h-14 rounded-lg border border-dashed border-white/15 bg-white/2" />
              )}
              <div className="flex flex-col gap-1.5">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => pickImage(e.target.files?.[0])}
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="self-start rounded-lg border border-white/10 bg-white/4 px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:border-white/20 transition-all cursor-pointer"
                >
                  {imagePreview && !removeImage ? t('dashboard.projects.form.changeImage') : t('dashboard.projects.form.chooseImage')}
                </button>
                {imagePreview && !removeImage && (
                  <button
                    type="button"
                    onClick={() => { setImageFile(null); setImagePreview(null); setRemoveImage(true) }}
                    className="self-start text-[11px] text-slate-600 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    {t('dashboard.projects.form.removeImage')}
                  </button>
                )}
              </div>
            </div>
            <p className="text-[11px] text-slate-600 mt-1.5">{t('dashboard.projects.form.imageHelp')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 border-t border-white/6 pt-5">
          <Toggle
            checked={published}
            onChange={setPublished}
            label={t('dashboard.projects.form.publishedLabel')}
            help={t('dashboard.projects.form.publishedHelp')}
          />
          <Toggle
            checked={featured}
            onChange={setFeatured}
            label={t('dashboard.projects.form.featuredLabel')}
            help={t('dashboard.projects.form.featuredHelp')}
          />
        </div>
      </div>

      {/* ── Content (per-locale) ────────────────────────────── */}
      <div className="rounded-2xl border border-white/8 bg-white/2 p-5 mb-6 flex flex-col gap-5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            {t('dashboard.projects.form.sectionContent')}
          </p>
          {/* Locale tabs */}
          <div className="flex rounded-full border border-white/10 bg-white/4 p-1">
            {(['en', 'fr'] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLocale(l)}
                className={[
                  'px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide transition-all cursor-pointer',
                  locale === l ? 'bg-accent text-[#07090c]' : 'text-slate-400 hover:text-white',
                ].join(' ')}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
        {locale === 'fr' && (
          <p className="text-[11px] text-slate-500 -mt-2">{t('dashboard.projects.form.langHint')}</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label={t('dashboard.projects.form.title')} value={cur.title} onChange={onTitleChange} />
          <Field label={t('dashboard.projects.form.category')} value={cur.category} onChange={(v) => set('category', v)} />
        </div>
        <Field label={t('dashboard.projects.form.description')} value={cur.description} onChange={(v) => set('description', v)} textarea rows={4} />

        {/* Tags */}
        <div>
          <p className="text-xs text-slate-500 font-medium mb-1.5">{t('dashboard.projects.form.tags')}</p>
          <div className="flex flex-col gap-2">
            {cur.tags.map((tag, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  value={tag}
                  onChange={(e) => set('tags', cur.tags.map((x, j) => (j === i ? e.target.value : x)))}
                  className={inputCls}
                  placeholder="Laravel"
                />
                <button
                  type="button"
                  onClick={() => set('tags', cur.tags.filter((_, j) => j !== i))}
                  className="w-9 h-9 shrink-0 flex items-center justify-center rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-400/8 transition-all cursor-pointer text-base leading-none"
                >×</button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => set('tags', [...cur.tags, ''])}
              className="self-start rounded-lg border border-dashed border-white/15 px-3 py-1.5 text-xs text-slate-500 hover:text-white hover:border-white/25 transition-all cursor-pointer"
            >
              + {t('dashboard.projects.form.addTag')}
            </button>
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex flex-col gap-3 mb-14">
        {errors.length > 0 && (
          <div className="rounded-xl border border-red-400/20 bg-red-400/6 px-4 py-3">
            {errors.map((e, i) => <p key={i} className="text-red-400 text-xs leading-relaxed">{e}</p>)}
          </div>
        )}
        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={saving || missingRequired}
            className="rounded-xl bg-accent text-[#07090c] text-sm font-semibold px-6 py-2.5 hover:brightness-110 transition-all disabled:opacity-60 cursor-pointer"
          >
            {saving ? t('dashboard.projects.form.saving') : t('dashboard.projects.form.save')}
          </button>
          {missingRequired && (
            <p className="text-xs text-slate-600">{t('dashboard.projects.form.requiredFields')}</p>
          )}
        </div>
      </div>

    </div>
  )
}
