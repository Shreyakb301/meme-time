'use client'

import { useRef, useState } from 'react'
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import PinnedSequence from '@/components/layout/PinnedSequence'
import DustField from '@/components/fx/DustField'
import { Vignette } from '@/components/fx/Lighting'
import { Plaque, FieldNote } from '@/components/ui/Plaque'
import MemeArtifact from '@/components/ui/MemeArtifact'

/**
 * SCENE 5 — THE DOGE CHAMBER.
 * The timeline disappears. A circular cathedral in deep space;
 * the Doge monument levitates at the center while its liturgy
 * orbits like moons. Drag to rotate the chamber; hover a phrase
 * to read its inscription.
 */

const PHRASES: Array<{ word: string; fact: string }> = [
  { word: 'wow', fact: 'Kabosu, the shiba behind Doge, was photographed by her owner in February 2010.' },
  { word: 'such meme', fact: 'The photo sat quietly online for three years before exploding across Tumblr and Reddit in 2013.' },
  { word: 'very internet', fact: 'Doge grammar — wow, such X, very Y — became its own dialect of broken English.' },
  { word: 'much history', fact: 'In 2021 the original Doge photo sold as an NFT for about $4 million.' },
  { word: 'so culture', fact: 'Comic Sans, pastel colors, inner monologue: the whole format is instantly recognizable from ten meters.' },
  { word: 'many years', fact: 'Kabosu lived to 18, mourned worldwide in 2024 — a state funeral for a meme.' },
]

function Chamber({ progress }: { progress: MotionValue<number> }) {
  const zoom = useTransform(progress, [0, 1], [0.9, 1.08])
  const rotation = useMotionValue(0)
  const dragging = useRef<{ on: boolean; lastX: number }>({ on: false, lastX: 0 })
  const [fact, setFact] = useState<string | null>(null)

  // Slow liturgical spin unless the visitor is dragging
  useAnimationFrame((_, delta) => {
    if (!dragging.current.on) rotation.set(rotation.get() + delta * 0.008)
  })

  return (
    <motion.div
      className="s5-chamber"
      style={{ scale: zoom }}
      onPointerDown={(e) => {
        dragging.current = { on: true, lastX: e.clientX }
      }}
      onPointerMove={(e) => {
        if (!dragging.current.on) return
        rotation.set(rotation.get() + (e.clientX - dragging.current.lastX) * 0.35)
        dragging.current.lastX = e.clientX
      }}
      onPointerUp={() => (dragging.current.on = false)}
      onPointerLeave={() => (dragging.current.on = false)}
    >
      <div className="s5-space" aria-hidden="true" />
      <div className="s5-arches" aria-hidden="true" />

      <div className="s5-stage">
        {/* orbit ring of phrases */}
        <motion.div className="s5-ring" style={{ rotateY: rotation }} aria-hidden="false">
          {PHRASES.map((p, i) => (
            <span
              key={p.word}
              className="s5-moon"
              style={{ transform: `rotateY(${(360 / PHRASES.length) * i}deg) translateZ(min(34vw, 330px))` }}
              onMouseEnter={() => setFact(p.fact)}
              onMouseLeave={() => setFact(null)}
            >
              {p.word}
            </span>
          ))}
        </motion.div>

        {/* the monument */}
        <div className="s5-monument">
          <span className="s5-halo" aria-hidden="true" />
          <MemeArtifact id="doge" caption={false} imgClassName="s5-doge" />
          <div className="s5-pedestal">
            <span className="s5-pedestal__id">monument · doge · 2010 → forever</span>
          </div>
        </div>
      </div>

      <p className="s5-fact" aria-live="polite">
        {fact ?? 'hover an orbiting phrase · drag to rotate the chamber · click the monument'}
      </p>

      <Plaque className="s5-plaque" id="chamber / monument 001" title="The Doge Chamber">
        Some memes pass through culture. A few become architecture. The chamber rotates so
        every pilgrim sees the same dog from a different angle.
      </Plaque>

      <DustField density={120} drift={0.06} />
      <Vignette />
    </motion.div>
  )
}

export default function Scene5() {
  return (
    <PinnedSequence mood="lime" length={3}>
      {(progress) => <Chamber progress={progress} />}
    </PinnedSequence>
  )
}
