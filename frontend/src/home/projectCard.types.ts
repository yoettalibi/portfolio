import type { ReactNode } from 'react'

export interface ProjectCardProps {
  index: number
  category: string
  title: string
  description: string
  tags: string[]
  slug?: string
  cta?: string
  illustration?: ReactNode
}
