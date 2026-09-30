import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import api from '../../lib/api'
import SpinnerIcon from '../../shared/icons/SpinnerIcon'
import type { Project } from '../../projects/projects.types'

export default function ProjectsAdminPage() {
  const { t } = useTranslation()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [confirmId, setConfirmId] = useState<number | null>(null)

  useEffect(() => {
    api.get<{ data: Project[] }>('/admin/projects')
      .then(({ data }) => setProjects(data.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  async function handleDelete(id: number) {
    setConfirmId(null)
    try {
      await api.delete(`/admin/projects/${id}`)
      setProjects((prev) => prev.filter((p) => p.id !== id))
    } catch {/* ignore */}
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-10">
        <div>
          <p className="text-xs font-semibold tracking-[0.15em] uppercase text-accent mb-2">
            {t('dashboard.projects.eyebrow')}
          </p>
          <h1 className="text-3xl font-bold text-white/90">
            {t('dashboard.projects.heading')}{' '}
            <span className="text-white/30">{t('dashboard.projects.headingFade')}</span>
          </h1>
          <p className="text-slate-400 mt-2 text-sm">{t('dashboard.projects.body')}</p>
        </div>
        {!loading && (
          <Link
            to="/dashboard/projects/new"
            className="shrink-0 mt-1 rounded-xl bg-accent text-[#07090c] text-xs font-semibold px-4 py-2 hover:brightness-110 transition-all"
          >
            + {t('dashboard.projects.newProject')}
          </Link>
        )}
      </div>

      {/* States */}
      {loading ? (
        <div className="flex justify-center py-20"><SpinnerIcon /></div>
      ) : error ? (
        <p className="text-red-400 text-sm">{t('dashboard.projects.loadError')}</p>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <p className="text-white/50 font-semibold">{t('dashboard.projects.emptyTitle')}</p>
          <p className="text-slate-500 text-sm text-center max-w-xs">{t('dashboard.projects.emptyBody')}</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/8 divide-y divide-white/4 overflow-hidden">
          {projects.map((project) => (
            <div key={project.id}
              className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/2 transition-colors">

              {/* Thumb */}
              <div className="w-14 h-10 rounded-lg overflow-hidden bg-white/5 border border-white/8 shrink-0 flex items-center justify-center">
                {project.image_url ? (
                  <img src={project.image_url} alt={project.title.en ?? project.slug} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs font-bold text-white/20">
                    {(project.title.en ?? project.slug)[0]?.toUpperCase()}
                  </span>
                )}
              </div>

              {/* Title + slug */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white/90 truncate">
                  {project.title.en ?? project.slug}
                  {project.title.fr ? null : (
                    <span className="ml-2 text-[10px] text-slate-600 font-normal">EN only</span>
                  )}
                </p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-[11px] text-slate-600 font-mono truncate">
                    {project.url ?? project.slug}
                  </span>
                  <span className="text-[11px] text-slate-600 shrink-0">#{project.sort_order}</span>
                </div>
              </div>

              {/* Badges */}
              <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                {project.featured && (
                  <span className="text-[10px] font-semibold uppercase tracking-wide rounded-full px-2 py-0.5 border border-accent/30 text-accent bg-accent/8">
                    {t('dashboard.projects.featured')}
                  </span>
                )}
                <span className={[
                  'text-[10px] font-semibold uppercase tracking-wide rounded-full px-2 py-0.5 border',
                  project.published
                    ? 'border-emerald-400/30 text-emerald-400 bg-emerald-400/8'
                    : 'border-white/15 text-slate-500 bg-white/4',
                ].join(' ')}>
                  {project.published ? t('dashboard.projects.live') : t('dashboard.projects.draft')}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                {confirmId === project.id ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleDelete(project.id)}
                      className="h-8 px-2.5 rounded-lg text-xs font-semibold text-white bg-red-500/80 hover:bg-red-500 transition-all cursor-pointer"
                    >
                      {t('dashboard.projects.confirmDelete')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmId(null)}
                      className="h-8 px-2.5 rounded-lg text-xs font-medium text-slate-400 border border-white/10 hover:text-white hover:border-white/20 transition-all cursor-pointer"
                    >
                      {t('dashboard.projects.cancelDelete')}
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to={`/dashboard/projects/${project.id}/edit`}
                      className="flex items-center gap-1.5 rounded-lg border border-white/8 bg-white/2 px-2.5 py-1.5 text-xs font-medium text-slate-400 hover:text-accent hover:border-accent/30 hover:bg-accent/5 transition-all"
                    >
                      {t('dashboard.projects.edit')}
                    </Link>
                    <button type="button" onClick={() => setConfirmId(project.id)}
                      title={t('dashboard.projects.remove')}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-400/8 transition-all cursor-pointer text-base leading-none">×</button>
                  </>
                )}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}
