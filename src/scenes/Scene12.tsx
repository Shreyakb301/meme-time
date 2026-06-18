'use client'

import { motion, useTransform, type MotionValue } from 'framer-motion'
import PinnedSequence from '@/components/layout/PinnedSequence'
import DustField from '@/components/fx/DustField'
import { Vignette } from '@/components/fx/Lighting'
import { Plaque } from '@/components/ui/Plaque'
import { useArtifact } from '@/components/ui/ArtifactModal'
import { getMeme, peakScore } from '@/lib/memes'

/**
 * SCENE 12 — INTERNET CULTURE SKYLINE · finale.
 * The camera rises out of the graveyard and the whole archive
 * becomes a city: every meme a building, height = peak cultural
 * footprint, grouped into districts. Click any building to read
 * its story; the closing text sends you back to 1996.
 */

const LANDMARKS: Record<string, string> = {
  doge: 'DOGE TOWER',
  pepe: 'PEPE TOWER',
  rickroll: 'RICKROLL PLAZA',
  'nyan-cat': 'NYAN CAT BRIDGE',
  'distracted-boyfriend': 'DISTRACTED BLVD',
}

const DISTRICTS: Array<{ name: string; ids: string[] }> = [
  { name: 'ancient web', ids: ['dancing-baby', 'hampster-dance', 'all-your-base'] },
  { name: 'video memes', ids: ['rickroll', 'gangnam-style', 'harlem-shake', 'skibidi-toilet'] },
  { name: 'image macros', ids: ['lolcats', 'bad-luck-brian', 'grumpy-cat', 'nyan-cat'] },
  { name: 'reaction district', ids: ['distracted-boyfriend', 'mocking-spongebob', 'wojak', 'pepe'] },
  { name: 'crypto quarter', ids: ['doge', 'dogecoin', 'rare-pepe'] },
  { name: 'tiktok district', ids: ['among-us', 'girl-explaining', 'npc-wojak', 'ai-memes'] },
]

function City({ progress }: { progress: MotionValue<number> }) {
  const { open } = useArtifact()

  // the ascent: fog clears, city rises, finale fades in
  const fogOpacity = useTransform(progress, [0, 0.3], [1, 0])
  const cityY = useTransform(progress, [0, 0.55], ['46%', '0%'])
  const skyGlow = useTransform(progress, [0.2, 0.6], [0, 1])
  const finaleOpacity = useTransform(progress, [0.78, 0.92], [0, 1])
  const finaleY = useTransform(progress, [0.78, 0.92], [30, 0])

  return (
    <>
      <div className="s12-sky" aria-hidden="true" />
      <motion.div className="s12-dawn" style={{ opacity: skyGlow }} aria-hidden="true" />

      <motion.div className="s12-city" style={{ y: cityY }}>
        {DISTRICTS.map((d) => (
          <div key={d.name} className="s12-district">
            <div className="s12-buildings">
              {d.ids.map((id) => {
                const meme = getMeme(id)
                if (!meme) return null
                const h = Math.max(peakScore(meme) * 2.6, 36)
                const landmark = LANDMARKS[id]
                return (
                  <button
                    key={id}
                    type="button"
                    className={`s12-tower ${landmark ? 'is-landmark' : ''}`}
                    style={{ height: h }}
                    onClick={() => open(id)}
                    aria-label={`${meme.name} — enter the building`}
                  >
                    {landmark && <span className="s12-tower__crown">{landmark}</span>}
                    <span className="s12-tower__name">{meme.name}</span>
                  </button>
                )
              })}
            </div>
            <span className="s12-district__name">{d.name}</span>
          </div>
        ))}
      </motion.div>

      {/* graveyard fog you rise out of */}
      <motion.div className="s12-fog" style={{ opacity: fogOpacity }} aria-hidden="true" />

      <motion.div className="s12-finale" style={{ opacity: finaleOpacity, y: finaleY }}>
        <p className="s12-finale__line">
          You have traveled through <span>30 years</span> of internet culture.
        </p>
        <button
          type="button"
          className="s12-again"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          ↺ EXPLORE THE ARCHIVE AGAIN
        </button>
      </motion.div>

      <Plaque className="s12-plaque" id="finale / the city of memes" title="Internet Culture Skyline">
        Every building is a meme; every district an era. The taller the tower, the harder
        we all looked at it. Click any building to enter.
      </Plaque>

      <DustField density={70} drift={0.05} />
      <Vignette />
    </>
  )
}

export default function Scene12() {
  return (
    <PinnedSequence mood="lime" length={5}>
      {(progress) => <City progress={progress} />}
    </PinnedSequence>
  )
}
