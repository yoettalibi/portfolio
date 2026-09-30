import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import api from '../lib/api'
import { useSeo } from '../hooks/useSeo'
import { pick, type Project } from './projects.types'
import ProjectsCard from './ProjectCard'
import SpinnerIcon from '../shared/icons/SpinnerIcon'

export default function ProjectsPage() {
  const { t, i18n } = useTranslation()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useSeo({
    title: `${t('projectsPage.seoTitle')} — ET-TALIBI`,
    description: t('projectsPage.body'),
    canonical: 'https://ettalibi.com/projects',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': 'https://ettalibi.com/projects#collection',
      url: 'https://ettalibi.com/projects',
      name: `${t('projectsPage.seoTitle')} — ET-TALIBI`,
      isPartOf: { '@id': 'https://ettalibi.com/#website' },
    },
  })

  useEffect(() => {
    api.get<{ data: Project[] }>('/projects')
      .then(({ data }) => setProjects(data.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.setAttribute('data-visible', '')),
      { threshold: 0.1 }
    )
    document.querySelectorAll('[data-fade]').forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [projects])

  return (
    <section className="page-container py-20 lg:py-28">

      {/* Header */}
      <div className="mb-14 lg:mb-20 max-w-180">
        <span className="text-accent text-xs uppercase tracking-[0.2em] mb-4 block">
          {t('projectsPage.eyebrow')}
        </span>
        <h1 className="text-[clamp(30px,4.5vw,56px)] font-bold leading-[1.08] mb-5">
          {t('projectsPage.heading')}{' '}
          <span className="text-white/50">{t('projectsPage.headingFade')}</span>
        </h1>
        <p className="text-slate-400 text-base lg:text-lg leading-[1.8]">
          {t('projectsPage.body')}
        </p>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-24"><SpinnerIcon /></div>
      ) : error ? (
        <p className="text-red-400 text-sm">{t('projectsPage.loadError')}</p>
      ) : projects.length === 0 ? (
        <div className="rounded-3xl border border-white/6 bg-white/2 p-14 text-center">
          <p className="text-white/50 font-semibold mb-2">{t('projectsPage.emptyTitle')}</p>
          <p className="text-slate-500 text-sm">{t('projectsPage.emptyBody')}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {projects.map((project, i) => (
            <div key={project.id} data-fade>
              <ProjectsCard
                index={i}
                category={pick(project.category, i18n.language) ?? ''}
                title={pick(project.title, i18n.language) ?? project.slug}
                description={pick(project.description, i18n.language) ?? ''}
                tags={pick(project.tags, i18n.language) ?? []}
                cta={t('projectsPage.visitSite')}
                imageUrl={project.image_url}
                url={project.url}
              />
            </div>
          ))}
        </div>
      )}

    </section>
  )
}
