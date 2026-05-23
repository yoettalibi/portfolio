import { createContext, useContext } from 'react'

/**
 * Provides the main scroll container element to descendant components.
 * Consumers can subscribe to its scroll events instead of window.
 * This is what makes key={pathname} on <main> the single source of truth
 * for scroll position — a fresh DOM node starts at scrollTop 0, always.
 */
export const ScrollContext = createContext<HTMLElement | null>(null)

export function useScrollContainer(): HTMLElement | null {
  return useContext(ScrollContext)
}
