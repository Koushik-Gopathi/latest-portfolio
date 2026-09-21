import type Lenis from 'lenis'

/**
 * The page's one Lenis instance, for the few things that must pause it.
 *
 * A modal is the case that needs this: Lenis listens for wheel events on the
 * window, so a video playing over the page would still scroll the page behind
 * it. SmoothScroll registers the instance here; nothing else creates one.
 */
let instance: Lenis | null = null

export function registerLenis(lenis: Lenis | null) {
  instance = lenis
}

/** Stops page scrolling until the returned function is called. */
export function lockScroll() {
  const root = document.documentElement
  const previous = root.style.overflow
  instance?.stop()
  // Covers reduced motion too, where Lenis never started and native scroll runs.
  root.style.overflow = 'hidden'
  return () => {
    root.style.overflow = previous
    instance?.start()
  }
}
