'use client'

import { useRef, type ReactNode } from 'react'
import { useScroll, type MotionValue } from 'framer-motion'
import type { Mood } from './Environment'

/**
 * PinnedSequence — sticky storytelling. The room stays pinned to
 * the viewport while the visitor scrolls through `length` screens
 * of story; children receive scroll progress (0→1 MotionValue)
 * and choreograph themselves with useTransform.
 */
export default function PinnedSequence({
  mood = 'lime',
  length = 3,
  className = '',
  children,
}: {
  mood?: Mood
  length?: number
  className?: string
  children: ReactNode | ((progress: MotionValue<number>) => ReactNode)
}) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  return (
    <section
      ref={ref}
      className={`pinned ${className}`}
      data-mood={mood}
      style={{ height: `${length * 100}svh` }}
    >
      <div className="pinned__viewport">
        {typeof children === 'function' ? children(scrollYProgress) : children}
      </div>
    </section>
  )
}
