export interface FormState {
  name: string
  email: string
  subjects: string[]
  message: string
}

export const initialForm: FormState = { name: '', email: '', subjects: [], message: '' }

export const serviceOptions = [
  { id: 'saas', title: 'contact.services.0.title', desc: 'contact.services.0.desc' },
  { id: 'workflow', title: 'contact.services.1.title', desc: 'contact.services.1.desc' },
  { id: 'architecture', title: 'contact.services.2.title', desc: 'contact.services.2.desc' },
  { id: 'frontend', title: 'contact.services.3.title', desc: 'contact.services.3.desc' },
  { id: 'business', title: 'contact.services.4.title', desc: 'contact.services.4.desc' },
  { id: 'custom', title: 'contact.services.5.title', desc: 'contact.services.5.desc' },
]

export const inputCls =
  'w-full rounded-2xl border border-white/8 bg-white/3 px-5 py-4 text-sm text-white placeholder:text-slate-500 outline-none transition-all duration-200 focus:border-accent/40 focus:shadow-accent-focus'
