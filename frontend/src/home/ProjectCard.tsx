import { Link } from 'react-router-dom'
import type { ProjectCardProps } from './projectCard.types'

export default function ProjectCard({ index, category, title, description, tags, slug, cta, illustration }: ProjectCardProps) {
  return (
    <article className="relative rounded-3xl border border-white/7 bg-white/2 overflow-hidden transition-all duration-300 hover:border-accent/22">
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr]">

        <div className="h-[200px] lg:h-auto relative overflow-hidden bg-panel-card">
          <div className="absolute inset-0 bg-grid-subtle" />
          {illustration ? (
            <div className="absolute inset-0 flex items-center justify-center p-6">
              {illustration}
            </div>
          ) : (
            <div className="absolute bottom-3 left-5 text-8xl font-extrabold leading-none text-white/5 select-none">
              {String(index + 1).padStart(2, '0')}
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between p-7 lg:p-10 border-t lg:border-t-0 lg:border-l border-white/6">
          <div>
            <div className="flex items-center justify-between mb-5">
              <span className="text-accent text-xs uppercase tracking-[0.2em]">{category}</span>
            </div>
            <h3 className="text-2xl lg:text-[26px] font-bold leading-[1.25] mb-4">{title}</h3>
            <p className="text-slate-400 text-sm lg:text-base leading-[1.8] mb-6">{description}</p>
          </div>
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag} className="py-2 px-3.5 rounded-full bg-white/4 border border-white/6 text-xs text-slate-400">
                  {tag}
                </span>
              ))}
            </div>
            {cta && slug && (
              <Link
                to={`/work/${slug}`}
                className="self-start flex items-center gap-2 text-sm font-medium text-accent hover:text-white border border-accent/30 hover:border-accent/60 rounded-full px-5 py-2.5 bg-accent/6 hover:bg-accent/12 transition-all duration-200 group"
              >
                {cta}
                <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            )}
          </div>
        </div>

      </div>
    </article>
  )
}
