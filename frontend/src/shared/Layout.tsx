import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import CookieBanner from './CookieBanner'
import { ScrollContext } from './ScrollContext'

/**
 * Layout route — rendered once as the parent of all public pages.
 *
 * Scroll architecture:
 *   <main key={pathname}> is the scroll container, not window.
 *   React remounts it on every navigation → scrollTop resets to 0 natively.
 *   No window.scrollTo(), no ScrollRestoration, no hacks.
 *
 * The ScrollContext provides the current <main> element so Navbar can
 * subscribe to its scroll events (replacing window.scrollY).
 */
export default function Layout() {
  const { pathname } = useLocation()

  // Callback ref: called with the new DOM node when <main> mounts,
  // and with null when it unmounts. React 18 batches both into one render.
  const [scrollEl, setScrollEl] = useState<HTMLElement | null>(null)

  return (
    <ScrollContext.Provider value={scrollEl}>
      <Navbar />
      <main
        ref={setScrollEl}
        key={pathname}
        className="flex-1 min-h-0 overflow-y-auto page-enter"
      >
        <Outlet />
        <Footer />
      </main>
      <CookieBanner />
    </ScrollContext.Provider>
  )
}
