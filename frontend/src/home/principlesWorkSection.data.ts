import type { ReactNode } from 'react'

export interface Principle {
  title: string
  desc: string
}

export interface ProjectEntry {
  category: string
  title: string
  description: string
  tags: string[]
  slug: string
  cta: string
  illustration: ReactNode
}

export const principles: Principle[] = [
  { title: 'principles.items.0.title', desc: 'principles.items.0.desc' },
  { title: 'principles.items.1.title', desc: 'principles.items.1.desc' },
  { title: 'principles.items.2.title', desc: 'principles.items.2.desc' },
  { title: 'principles.items.3.title', desc: 'principles.items.3.desc' },
  { title: 'principles.items.4.title', desc: 'principles.items.4.desc' },
  { title: 'principles.items.5.title', desc: 'principles.items.5.desc' },
]
