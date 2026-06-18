'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import DustField from '@/components/fx/DustField'
import { Vignette, FloorFog } from '@/components/fx/Lighting'
import { Plaque, FieldNote } from '@/components/ui/Plaque'
import { useArtifact } from '@/components/ui/ArtifactModal'
import { getMeme, popularityAt } from '@/lib/memes'

/**
 * SCENE 8 — POPULARITY LANDSCAPE.
 * Not a chart: a mountain range. Each meme is a peak whose height
 * is its cultural footprint in the chosen year. Drag the year and
 * watch ranges rise, fall, fade out, and glow back to life.
 */

const RANGE: Array<{ id: string; width: number }> = [
  { id: 'rickroll', width: 150 },
  { id: 'nyan-cat', width: 100 },
  { id: 'gangnam-style', width: 120 },
  { id: 'doge', width: 170 },
  { id: 'pepe', width: 130 },
  { id: 'distracted-boyfriend', width: 110 },
  { id: 'among-us', width: 140 },
  { id: 'skibidi-toilet', width: 100 },
]

export default function Scene8() {
  const [year, setYear] = useState(2013)
  const { open } = useArtifact()

  return (
    <section className="env s8-land" data-mood="violet">
      <Plaque className="s8-plaque" id="terrain / cultural footprint" title="Popularity Landscape">
        Height is attention. Drag through thirty years and watch the range change: peaks
        erode, dead ranges fade, revived ones glow again.
      </Plaque>

      <div className="s8-ridge s8-ridge--far" aria-hidden="true" />
      <div className="s8-ridge s8-ridge--near" aria-hidden="true" />

      <div className="s8-range">
        {RANGE.map((r, i) => {
          const meme = getMeme(r.id)
          if (!meme) return null
          const score = popularityAt(meme, year)
          const h = Math.max(score * 3.4, 8)
          const dead = score < 5
          return (
            <button
              key={r.id}
              type="button"
              className="s8-mountain"
              onClick={() => open(r.id)}
              aria-label={`${meme.name} — popularity ${Math.round(score)} in ${year}`}
            >
              <motion.span
                className={`s8-peak ${dead ? 'is-dead' : ''} ${score > 60 ? 'is-hot' : ''}`}
                animate={{ height: h, opacity: dead ? 0.3 : 1 }}
                transition={{ type: 'spring', stiffness: 60, damping: 16 }}
                style={{ width: r.width, animationDelay: `${i * 0.4}s` }}
              />
              <span className="s8-label">{meme.name}</span>
            </button>
          )
        })}
      </div>

      {/* the time instrument */}
      <div className="s8-instrument">
        <span className="s8-year" aria-live="polite">{year}</span>
        <input
          type="range"
          min={1996}
          max={2026}
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="s8-slider"
          aria-label="Year"
        />
        <div className="s8-ticks" aria-hidden="true">
          <span>1996</span>
          <span>2005</span>
          <span>2015</span>
          <span>2026</span>
        </div>
      </div>

      <FieldNote className="s8-note">drag through time · click a peak to inspect</FieldNote>

      <DustField density={50} drift={0.07} />
      <FloorFog />
      <Vignette />
    </section>
  )
}
