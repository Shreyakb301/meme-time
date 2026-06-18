'use client'

import { motion, useTransform, type MotionValue } from 'framer-motion'
import type { CSSProperties, ReactNode } from 'react'
import PinnedSequence from '@/components/layout/PinnedSequence'
import DustField from '@/components/fx/DustField'
import { Vignette, FloorFog } from '@/components/fx/Lighting'
import { StratumNumeral } from '@/components/fx/Surfaces'
import { Plaque, FieldNote } from '@/components/ui/Plaque'
import MemeArtifact from '@/components/ui/MemeArtifact'
import { getMeme } from '@/lib/memes'

/**
 * SCENE 4 — HALL III · The Meme Boom (2010–2014).
 * The internet gets loud. Artifacts burst into existence, Nyan
 * Cat streaks rainbow trails across the hall, Trollface glitches
 * in and out, the room itself shakes every twelve seconds
 * (Harlem Shake protocol), and Doge materializes like a small
 * celestial event.
 */

function Burst({
  progress,
  at,
  style,
  children,
}: {
  progress: MotionValue<number>
  at: number
  style?: CSSProperties
  children: ReactNode
}) {
  const opacity = useTransform(progress, [at, at + 0.05], [0, 1])
  const scale = useTransform(progress, [at, at + 0.04, at + 0.07], [0.2, 1.15, 1])
  const y = useTransform(progress, [at, 1], [30, -80])
  return (
    <motion.div className="s4-artifact" style={{ ...style, opacity, scale, y }}>
      {children}
    </motion.div>
  )
}

function Hall({ progress }: { progress: MotionValue<number> }) {
  const push = useTransform(progress, [0, 1], [0.97, 1.06])
  const numeralY = useTransform(progress, [0, 1], [70, -160])

  // Doge: slow celestial reveal through the back half of the hall
  const dogeOpacity = useTransform(progress, [0.5, 0.8], [0, 1])
  const dogeScale = useTransform(progress, [0.5, 0.85], [0.6, 1])
  const dogeBlur = useTransform(progress, [0.5, 0.8], ['blur(18px)', 'blur(0px)'])

  return (
    <motion.div className="s4-room" style={{ scale: push }}>
      <div className="s4-air" aria-hidden="true" />

      <motion.div style={{ position: 'absolute', inset: 0, y: numeralY }} aria-hidden="true">
        <StratumNumeral style={{ left: '-4%', bottom: '-6%' }}>2010</StratumNumeral>
      </motion.div>

      {/* nyan cat streaking through the hall */}
      <div className="s4-nyan" aria-hidden="true">
        <span className="s4-nyan__trail" />
        <MemeArtifact id="nyan-cat" caption={false} imgClassName="s4-nyan__img" />
      </div>

      <Burst progress={progress} at={0.08} style={{ left: '7%', top: '14%' }}>
        <div className="s2-float" style={{ '--bob': '8s', '--rot': '-1.4deg' } as CSSProperties}>
          <MemeArtifact id="trollface" imgClassName="s4-troll" />
        </div>
      </Burst>

      <Burst progress={progress} at={0.18} style={{ right: '8%', top: '12%' }}>
        <div className="s2-float" style={{ '--bob': '10s', '--rot': '1.2deg' } as CSSProperties}>
          <MemeArtifact id="rage-comics" imgClassName="s4-frame" />
        </div>
      </Burst>

      <Burst progress={progress} at={0.28} style={{ left: '12%', bottom: '20%' }}>
        <div className="s2-float" style={{ '--bob': '9s', '--rot': '0.8deg' } as CSSProperties}>
          <MemeArtifact id="bad-luck-brian" imgClassName="s4-frame" />
        </div>
      </Burst>

      <Burst progress={progress} at={0.38} style={{ right: '10%', bottom: '22%' }}>
        <div className="s2-float" style={{ '--bob': '11s', '--rot': '-0.9deg' } as CSSProperties}>
          <MemeArtifact id="grumpy-cat" imgClassName="s4-frame" />
        </div>
      </Burst>

      <Burst progress={progress} at={0.48} style={{ right: '30%', top: '8%' }}>
        <div className="s4-quake-tag">
          <MemeArtifact id="harlem-shake" imgClassName="s4-frame s4-frame--wide" />
          <FieldNote>seismic event · every 12s · do the shake</FieldNote>
        </div>
      </Burst>

      {/* the celestial doge */}
      <motion.div
        className="s4-doge"
        style={{ opacity: dogeOpacity, scale: dogeScale, filter: dogeBlur }}
      >
        <span className="s4-doge__rays" aria-hidden="true" />
        <MemeArtifact id="doge" caption={false} imgClassName="s4-doge__img" />
        <p className="s4-doge__wow">wow</p>
        <span className="exhibit-tag">doge · 2010 · {getMeme('doge')?.originPlatform}</span>
      </motion.div>

      <Plaque className="s4-plaque" id="hall iii / stratum 2010–2014" title="The Meme Boom">
        Smartphones in every pocket, image macros in every feed. Internet culture stops
        being a place you visit and becomes the weather.
      </Plaque>
      <FieldNote
        style={{ position: 'absolute', top: 'var(--space-scene)', right: 'var(--gutter)', zIndex: 4 }}
      >
        volume rising · stratum iii
      </FieldNote>

      <DustField density={90} drift={0.22} />
      <FloorFog />
      <Vignette />
    </motion.div>
  )
}

export default function Scene4() {
  return (
    <PinnedSequence mood="pink" length={5}>
      {(progress) => <Hall progress={progress} />}
    </PinnedSequence>
  )
}
