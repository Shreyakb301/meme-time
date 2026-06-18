import type { Variants } from 'framer-motion'

/**
 * MEMETIME — Motion presets
 *
 * Shared Framer Motion vocabulary so every scene animates with the
 * same accent. Micro-interactions are fast (ADHD-friendly: feedback
 * lands within ~250ms); only ambient drift is slow.
 */

export const EASE_OUT = [0.16, 1, 0.3, 1] as const
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const

/** Default viewport config: animate once, fire a little early. */
export const VIEWPORT_ONCE = { once: true, margin: '0px 0px -15% 0px' as const }

/** Fade up — the workhorse entrance for copy. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_OUT },
  },
}

/** Stagger container — children cascade in, never all at once. */
export const stagger = (delayChildren = 0, staggerChildren = 0.09): Variants => ({
  hidden: {},
  show: {
    transition: { delayChildren, staggerChildren },
  },
})

/** Scale-in for media and monuments. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: EASE_OUT },
  },
}

/** Line reveal — for headlines split into rows (wrap rows in overflow:clip). */
export const lineReveal: Variants = {
  hidden: { y: '110%' },
  show: {
    y: '0%',
    transition: { duration: 0.9, ease: EASE_OUT },
  },
}

/** Blur-in — for giant numerals and era titles. */
export const blurIn: Variants = {
  hidden: { opacity: 0, filter: 'blur(16px)' },
  show: {
    opacity: 1,
    filter: 'blur(0px)',
    transition: { duration: 1, ease: EASE_OUT },
  },
}
