export interface HeroStat {
  label: string
  value: string
}

export const stats: HeroStat[] = [
  { label: 'hero.stats.0.label', value: 'hero.stats.0.value' },
  { label: 'hero.stats.1.label', value: 'hero.stats.1.value' },
  { label: 'hero.stats.2.label', value: 'hero.stats.2.value' },
  { label: 'hero.stats.3.label', value: 'hero.stats.3.value' },
]

export const tags: string[] = ['hero.tags.0', 'hero.tags.1', 'hero.tags.2']

export function scrollToSection(id: string): void {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
