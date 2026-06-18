'use client'

import { useEffect, useRef, useState } from 'react'
import DustField from '@/components/fx/DustField'
import { Vignette } from '@/components/fx/Lighting'
import { Plaque, FieldNote } from '@/components/ui/Plaque'
import ArtifactImage from '@/components/fx/ArtifactImage'
import { getMeme, peakScore } from '@/lib/memes'

/**
 * SCENE 7 — VIRAL SPREAD SIMULATOR.
 * Platform islands in the dark. Load a specimen, press RELEASE,
 * and watch it travel the routes like an outbreak: glowing paths,
 * platforms lighting up wave by wave, reach climbing.
 */

const PLATFORMS = [
  { id: '4chan', label: '4chan', x: 14, y: 30 },
  { id: 'reddit', label: 'Reddit', x: 30, y: 56 },
  { id: 'tumblr', label: 'Tumblr', x: 24, y: 80 },
  { id: 'twitter', label: 'Twitter', x: 50, y: 42 },
  { id: 'facebook', label: 'Facebook', x: 68, y: 64 },
  { id: 'youtube', label: 'YouTube', x: 54, y: 78 },
  { id: 'instagram', label: 'Instagram', x: 80, y: 36 },
  { id: 'tiktok', label: 'TikTok', x: 88, y: 70 },
] as const

type PlatformId = (typeof PLATFORMS)[number]['id']

const ROUTES: Array<[PlatformId, PlatformId]> = [
  ['4chan', 'reddit'],
  ['4chan', 'tumblr'],
  ['reddit', 'twitter'],
  ['tumblr', 'twitter'],
  ['reddit', 'youtube'],
  ['twitter', 'facebook'],
  ['twitter', 'instagram'],
  ['youtube', 'tiktok'],
  ['facebook', 'youtube'],
  ['instagram', 'tiktok'],
]

const SUBJECTS: Array<{ id: string; origin: PlatformId }> = [
  { id: 'doge', origin: 'tumblr' },
  { id: 'rickroll', origin: '4chan' },
  { id: 'among-us', origin: 'tiktok' },
]

/** Breadth-first waves out from the origin platform. */
function spreadWaves(origin: PlatformId): PlatformId[][] {
  const adj = new Map<PlatformId, PlatformId[]>()
  for (const [a, b] of ROUTES) {
    adj.set(a, [...(adj.get(a) ?? []), b])
    adj.set(b, [...(adj.get(b) ?? []), a])
  }
  const seen = new Set<PlatformId>([origin])
  const waves: PlatformId[][] = [[origin]]
  let frontier: PlatformId[] = [origin]
  while (frontier.length) {
    const next = frontier.flatMap((p) => (adj.get(p) ?? []).filter((n) => !seen.has(n)))
    const unique = [...new Set(next)]
    unique.forEach((n) => seen.add(n))
    if (unique.length) waves.push(unique)
    frontier = unique
  }
  return waves
}

export default function Scene7() {
  const [subject, setSubject] = useState(SUBJECTS[0])
  const [live, setLive] = useState<Set<PlatformId>>(new Set())
  const [running, setRunning] = useState(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  const meme = getMeme(subject.id)
  const reach = Math.round((live.size / PLATFORMS.length) * (meme ? peakScore(meme) : 100))

  const clearTimers = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  const reset = () => {
    clearTimers()
    setLive(new Set())
    setRunning(false)
  }

  const release = () => {
    reset()
    setRunning(true)
    const waves = spreadWaves(subject.origin)
    waves.forEach((wave, i) => {
      timers.current.push(
        setTimeout(() => {
          setLive((prev) => new Set([...prev, ...wave]))
          if (i === waves.length - 1) setRunning(false)
        }, i * 1000),
      )
    })
  }

  useEffect(() => clearTimers, [])

  const pos = (id: PlatformId) => PLATFORMS.find((p) => p.id === id)!

  return (
    <section className="env s7-map" data-mood="cyan">
      <Plaque className="s7-plaque" id="simulation / patient zero" title="Viral Spread Simulator">
        Every meme is an outbreak. Choose a specimen, release it on its home platform, and
        watch the infection travel the old routes.
      </Plaque>

      {/* routes */}
      <svg className="s7-routes" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {ROUTES.map(([a, b]) => {
          const A = pos(a)
          const B = pos(b)
          const on = live.has(a) && live.has(b)
          return (
            <line
              key={`${a}-${b}`}
              x1={A.x}
              y1={A.y}
              x2={B.x}
              y2={B.y}
              className={`s7-route ${on ? 'is-live' : ''}`}
            />
          )
        })}
      </svg>

      {/* islands */}
      {PLATFORMS.map((p) => (
        <div
          key={p.id}
          className={`s7-island ${live.has(p.id) ? 'is-live' : ''} ${p.id === subject.origin ? 'is-origin' : ''}`}
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
        >
          <span className="s7-island__pad" aria-hidden="true" />
          <span className="s7-island__label">{p.label}</span>
        </div>
      ))}

      {/* control bench */}
      <div className="s7-bench">
        <div className="s7-bench__subjects" role="group" aria-label="Choose a specimen">
          {SUBJECTS.map((s) => {
            const m = getMeme(s.id)
            return (
              <button
                key={s.id}
                type="button"
                className={`s7-slide ${s.id === subject.id ? 'is-active' : ''}`}
                onClick={() => {
                  setSubject(s)
                  reset()
                }}
              >
                <ArtifactImage
                  src={m?.asset.localImage}
                  apiQuery={m?.asset.giphySearchTerm}
                  alt={m?.name ?? s.id}
                  className="s7-slide__img"
                />
                <span>{m?.name}</span>
              </button>
            )
          })}
        </div>
        <button type="button" className="s7-release" onClick={release} disabled={running}>
          {running ? 'SPREADING…' : 'RELEASE MEME'}
        </button>
        <div className="s7-readout" aria-live="polite">
          <span>
            reach <b>{reach}%</b>
          </span>
          <span>
            platforms <b>{live.size}/{PLATFORMS.length}</b>
          </span>
          <button type="button" className="s7-reset" onClick={reset}>
            reset
          </button>
        </div>
      </div>

      <FieldNote className="s7-note">epidemic model · patient zero: {subject.origin}</FieldNote>

      <DustField density={60} drift={0.1} />
      <Vignette />
    </section>
  )
}
