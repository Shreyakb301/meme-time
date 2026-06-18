'use client'

import { motion, useScroll, useSpring } from 'framer-motion'

/**
 * Chrome — the expedition instruments fixed over every room:
 * the wordmark and the depth gauge. Mount once at the app root.
 */

export function Wordmark() {
  return <div className="wordmark">MEMETIME</div>
}

/** Depth gauge — how far down the strata the visitor has dug. */
export function DepthRail({ label = 'DEPTH' }: { label?: string }) {
  const { scrollYProgress } = useScroll()
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 28 })

  return (
    <div className="depth-rail" aria-hidden="true">
      <span className="depth-rail__readout">{label}</span>
      <div className="depth-rail__track">
        <motion.div className="depth-rail__fill" style={{ scaleY }} />
      </div>
    </div>
  )
}
