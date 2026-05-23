import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { lines } from './philosophySection.data'
function PhilosophyLine({ text, onVisible }: { text: string; onVisible?: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)
  const notified = useRef(false)
  // Keep latest callback in a ref so the effect never needs to re-run when
  // the parent re-renders (avoids disconnecting/re-connecting the observer).
  const onVisibleRef = useRef(onVisible)
  useEffect(() => { onVisibleRef.current = onVisible }, [onVisible])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setActive(entry.isIntersecting)
        if (entry.isIntersecting && !notified.current) {
          notified.current = true
          onVisibleRef.current?.()
        }
      },
      { threshold: 0.75, rootMargin: '-12% 0px -12% 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, []) // intentionally empty — observer is stable for the lifetime of this element

  return (
    <div
      ref={ref}
      className={`text-[clamp(28px,4vw,56px)] font-semibold leading-[1.2] transition-[opacity,color] duration-500 ease-out ${
        active ? 'opacity-100 text-white/90' : 'opacity-[0.18] text-white/30'
      }`}
    >
      {text}
    </div>
  )
}

export default function PhilosophySection() {
  const { t } = useTranslation()
  const [renderedCount, setRenderedCount] = useState(1)

  const revealNext = useCallback((i: number) => {
    if (i + 1 < lines.length) {
      setRenderedCount((prev) => Math.max(prev, i + 2))
    }
  }, [])

  return (
    <div className="grid gap-8 lg:gap-12 mt-8 lg:mt-12">
      {lines.slice(0, renderedCount).map((item, i) => (
        <PhilosophyLine key={item} text={t(item)} onVisible={() => revealNext(i)} />
      ))}
    </div>
  )
}
