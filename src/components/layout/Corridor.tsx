'use client'

import { useRef, type ReactNode } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import type { Mood } from './Environment'

/**
 * Corridor — a horizontal gallery you walk along sideways.
 * Vertical scroll is converted into lateral movement through
 * a row of bays. Each child becomes one bay.
 */
export default function Corridor({
  mood = 'lime',
  bays = 3,
  atmosphere = null,
  children,
}: {
  mood?: Mood
  bays?: number
  atmosphere?: ReactNode
  children: ReactNode
}) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-75%'])

  return (
    <section
      ref={ref}
      className="pinned"
      data-mood={mood}
      style={{ height: `${bays * 100}svh` }}
    >
      <div className="pinned__viewport">
        {atmosphere}
        <motion.div className="corridor__track" style={{ x }}>
          {children}
        </motion.div>
      </div>
    </section>
  )
}

export function Bay({ className = '', children }: { className?: string; children: ReactNode }) {
  return <div className={`corridor__bay ${className}`}>{children}</div>
}
