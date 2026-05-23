import { useEffect, useRef } from 'react'
import type { CountUpProps } from './countUp.types'

export default function CountUp({ target, duration = 1800 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.textContent = '0.00%'

    let raf: number | null = null

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()

        const start = performance.now()
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          el.textContent = (eased * target).toFixed(2) + '%'
          if (progress < 1) {
            raf = requestAnimationFrame(tick)
          } else {
            raf = null
          }
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.6 },
    )

    observer.observe(el)

    return () => {
      observer.disconnect()
      if (raf !== null) cancelAnimationFrame(raf)
    }
  }, [target, duration])

  return <span ref={ref}>0.00%</span>
}
