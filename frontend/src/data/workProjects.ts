export const workProjectSlugs: string[] = [
  'operational-intelligence',
  'saas-platform',
]

export function isValidSlug(slug: string): boolean {
  return workProjectSlugs.includes(slug)
}
