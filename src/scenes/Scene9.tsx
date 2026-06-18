'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import DustField from '@/components/fx/DustField'
import { Vignette } from '@/components/fx/Lighting'
import { StratumNumeral } from '@/components/fx/Surfaces'
import { Plaque, FieldNote } from '@/components/ui/Plaque'
import ArtifactImage from '@/components/fx/ArtifactImage'
import { useArtifact } from '@/components/ui/ArtifactModal'
import { getMeme } from '@/lib/memes'

/**
 * SCENE 9 — HALL IV · Memes Become Language (2015–2019).
 * A comic-book remix machine. The same template cycles through
 * its life: original → variation → corporate version → dead meme.
 * Captions swap every few seconds; formats are the grammar.
 */

const STAGES = ['ORIGINAL', 'VARIATION', 'CORPORATE VERSION', 'DEAD MEME'] as const

const REMIXES: Array<{ id: string; captions: [string, string, string, string] }> = [
  {
    id: 'distracted-boyfriend',
    captions: [
      'guy · girlfriend · other girl — stock photo, 2015',
      'me · my responsibilities · one more episode',
      'CONSUMERS · legacy brands · OUR EXCITING NEW APP',
      'nobody · this format · whatever format came next',
    ],
  },
  {
    id: 'drake-hotline-bling',
    captions: [
      'drake recoiling · drake approving — 2015',
      'reading the article · reading the comments',
      'organic reach · SPONSORED CONTENT',
      'using this template · admitting it died in 2019',
    ],
  },
  {
    id: 'expanding-brain',
    captions: [
      'small brain → cosmic brain — 2017',
      'sleeping early → one more meme at 3am',
      'four panels of brand synergy, ascending',
      'explaining this meme to your parents (final form)',
    ],
  },
  {
    id: 'woman-yelling-at-cat',
    captions: [
      'real housewives scream · smudge at a salad — 2019',
      'me arguing · the cat who is right',
      'MARKETING TEAM · q4 engagement cat',
      'the scream fades · the cat remains',
    ],
  },
  {
    id: 'is-this-a-pigeon',
    captions: [
      'android · butterfly · "is this a pigeon?" — 1991/2018',
      'me · any minor success · is this a personality?',
      'brands · any trend · IS THIS RELATABLE CONTENT?',
      'archaeologists · this exhibit · is this a museum?',
    ],
  },
]

export default function Scene9() {
  const [memeIdx, setMemeIdx] = useState(0)
  const [stage, setStage] = useState(0)
  const { open } = useArtifact()

  const remix = REMIXES[memeIdx]
  const meme = getMeme(remix.id)

  // the machine never stops: next stage every 3 seconds
  useEffect(() => {
    const t = setInterval(() => setStage((s) => (s + 1) % STAGES.length), 3000)
    return () => clearInterval(t)
  }, [memeIdx])

  return (
    <section className="env s9-hall" data-mood="pink">
      <div className="s9-halftone" aria-hidden="true" />
      <StratumNumeral style={{ right: '-4%', bottom: '-8%' }}>2015</StratumNumeral>

      <Plaque className="s9-plaque" id="hall iv / stratum 2015–2019" title="Memes Become Language">
        Templates replace sentences. The image stays; the captions cycle until the joke is
        a corpse — then the corpse becomes the joke.
      </Plaque>

      {/* the remix machine */}
      <div className="s9-machine">
        <div className="s9-stagecount" aria-hidden="true">
          {STAGES.map((s, i) => (
            <span key={s} className={i === stage ? 'is-on' : ''}>
              {s}
              {i < STAGES.length - 1 && <i> ↓ </i>}
            </span>
          ))}
        </div>

        <button
          type="button"
          className={`s9-panel ${stage === 3 ? 'is-dead' : ''}`}
          onClick={() => open(remix.id)}
          aria-label={`Inspect ${meme?.name}`}
        >
          <ArtifactImage
            src={meme?.asset.localImage}
            alt={meme?.name ?? remix.id}
            className="s9-panel__img"
            fallback={<span className="s9-panel__type">{meme?.name}</span>}
          />
          <AnimatePresence mode="wait">
            <motion.span
              key={`${remix.id}-${stage}`}
              className="s9-caption"
              initial={{ opacity: 0, scale: 1.3, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.25 }}
            >
              {remix.captions[stage]}
            </motion.span>
          </AnimatePresence>
        </button>

        <div className="s9-feed" role="group" aria-label="Choose a template">
          {REMIXES.map((r, i) => {
            const m = getMeme(r.id)
            return (
              <button
                key={r.id}
                type="button"
                className={`s9-tab ${i === memeIdx ? 'is-active' : ''}`}
                onClick={() => {
                  setMemeIdx(i)
                  setStage(0)
                }}
              >
                {m?.name}
              </button>
            )
          })}
        </div>
      </div>

      <FieldNote className="s9-note">remix machine · cycle time 3s · stratum iv</FieldNote>

      <DustField density={40} drift={0.12} />
      <Vignette />
    </section>
  )
}
