'use client'

import { useRef, type CSSProperties, type ReactNode } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { SCROLL_SPRING } from '@/lib/motion'

/**
 * ParallaxLayer — absolute-positioned depth layer. `depth` sets
 * how far it lags the scroll: negative drifts up (background),
 * positive drifts down (foreground). 0.1–0.3 is subtle; keep it
 * subtle.
 */
export default function ParallaxLayer({
  depth = 0.2,
  className = '',
  style,
  children,
}: {
  depth?: number
  className?: string
  style?: CSSProperties
  children?: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const progress = useSpring(scrollYProgress, SCROLL_SPRING)
  const y = useTransform(progress, [0, 1], [depth * -200, depth * 200])

  return (
    <motion.div ref={ref} className={`parallax-layer ${className}`} style={{ ...style, y }}>
      {children}
    </motion.div>
  )
}
