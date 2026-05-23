import { useNavigate, useLocation } from 'react-router-dom'

export const scrollLinks: { id: string; key: string }[] = [
  { id: 'work', key: 'nav.work' },
  { id: 'systems', key: 'nav.systems' },
  { id: 'insights', key: 'nav.insights' },
]

export function useNavAction() {
  const navigate = useNavigate()
  const location = useLocation()

  function goToSection(id: string) {
    if (location.pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      navigate('/', { state: { scrollTo: id } })
    }
  }

  return { goToSection, navigate, pathname: location.pathname }
}
