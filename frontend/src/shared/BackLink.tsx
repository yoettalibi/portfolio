import { Link } from 'react-router-dom'

interface BackLinkProps {
  label: string
  to?: string
}

export default function BackLink({ label, to = '/' }: BackLinkProps) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-14 transition-colors duration-200 group"
    >
      <svg
        className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {label}
    </Link>
  )
}
