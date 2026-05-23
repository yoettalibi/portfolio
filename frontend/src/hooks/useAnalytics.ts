import { useEffect } from 'react'

declare global {
  interface Window {
    dataLayer: any[]
    gtag?: (...args: any[]) => void
  }
}

export function useAnalytics(ga4Id?: string | null) {
  useEffect(() => {
    if (!ga4Id || !/^G-[A-Z0-9]{4,20}$/.test(ga4Id)) return

    if (document.getElementById('ga4-script')) return

    let cancelled = false

    const inject = () => {
      if (cancelled) return
      if (document.getElementById('ga4-script')) return

      // External script
      const scriptSrc = document.createElement('script')
      scriptSrc.id = 'ga4-script'
      scriptSrc.async = true
      scriptSrc.src = `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`

      // Init
      window.dataLayer = window.dataLayer || []

      window.gtag = function (...args: any[]) {
        window.dataLayer.push(args)
      }

      window.gtag('js', new Date())

      // Better privacy/performance defaults
      window.gtag('config', ga4Id, {
        anonymize_ip: true,
        transport_type: 'beacon',
      })

      document.head.appendChild(scriptSrc)
    }

    const loadAnalytics = () => {
      // Browser idle time
      if ('requestIdleCallback' in window) {
        ;(window as any).requestIdleCallback(inject, {
          timeout: 5000,
        })
      } else {
        // Fallback
        setTimeout(inject, 3500)
      }
    }

    // Wait until everything important finishes
    if (document.readyState === 'complete') {
      loadAnalytics()
    } else {
      window.addEventListener('load', loadAnalytics, {
        once: true,
      })
    }

    return () => {
      cancelled = true
    }
  }, [ga4Id])
}