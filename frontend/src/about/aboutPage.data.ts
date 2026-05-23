export interface StatItem {
  value: number
  suffix: string
  label: string
}

export interface ExpertiseItem {
  title: string
  desc: string
}

export interface PhilosophyItem {
  number: string
  title: string
  desc: string
}

export const statsData: StatItem[] = [
  { value: 12, suffix: '+', label: 'aboutPage.stats.0.label' },
  { value: 60, suffix: '+', label: 'aboutPage.stats.1.label' },
  { value: 15, suffix: '+', label: 'aboutPage.stats.2.label' },
  { value: 100, suffix: '%', label: 'aboutPage.stats.3.label' },
]

export const expertiseData: ExpertiseItem[] = [
  { title: 'aboutPage.expertise.0.title', desc: 'aboutPage.expertise.0.desc' },
  { title: 'aboutPage.expertise.1.title', desc: 'aboutPage.expertise.1.desc' },
  { title: 'aboutPage.expertise.2.title', desc: 'aboutPage.expertise.2.desc' },
  { title: 'aboutPage.expertise.3.title', desc: 'aboutPage.expertise.3.desc' },
  { title: 'aboutPage.expertise.4.title', desc: 'aboutPage.expertise.4.desc' },
  { title: 'aboutPage.expertise.5.title', desc: 'aboutPage.expertise.5.desc' },
]

export const philosophyData: PhilosophyItem[] = [
  { number: '01', title: 'aboutPage.philosophy.0.title', desc: 'aboutPage.philosophy.0.desc' },
  { number: '02', title: 'aboutPage.philosophy.1.title', desc: 'aboutPage.philosophy.1.desc' },
  { number: '03', title: 'aboutPage.philosophy.2.title', desc: 'aboutPage.philosophy.2.desc' },
]
