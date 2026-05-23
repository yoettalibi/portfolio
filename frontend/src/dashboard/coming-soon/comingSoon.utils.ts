export interface Settings {
  coming_soon_enabled: string
  coming_soon_title: string | null
  coming_soon_desc: string | null
  coming_soon_launch_date: string | null
  coming_soon_social_github: string | null
  coming_soon_social_linkedin: string | null
  coming_soon_social_instagram: string | null
}

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
