'use client'

import { useEffect, type ReactNode } from 'react'
import Lenis from 'lenis'

/**
 * Wraps the app in Lenis smooth scrolling. Disabled automatically
 * for users who prefer reduced motion — native scroll stays intact.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 0.9,
    })

    let frame: number
    const raf = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
    }
  }, [])

  return children
}
