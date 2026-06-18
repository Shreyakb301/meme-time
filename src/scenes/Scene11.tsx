'use client'

import DustField from '@/components/fx/DustField'
import { Vignette, FloorFog, LightPool } from '@/components/fx/Lighting'
import { Plaque, FieldNote } from '@/components/ui/Plaque'
import ArtifactImage from '@/components/fx/ArtifactImage'
import { useArtifact } from '@/components/ui/ArtifactModal'
import { getMeme } from '@/lib/memes'

/**
 * SCENE 11 — THE MEME GRAVEYARD.
 * Forgotten legends sink into pixel sand. Gravestones glow
 * softly; ghosts of the dead occasionally rise and drift off.
 * Nostalgic, not sad.
 */

const GRAVES: Array<{ id: string; epitaph: string; tilt: number }> = [
  { id: 'planking', epitaph: 'lay down everywhere', tilt: -2 },
  { id: 'harlem-shake', epitaph: 'shook for one month', tilt: 1.5 },
  { id: 'gangnam-style', epitaph: 'broke the counter', tilt: -1 },
  { id: 'bad-luck-brian', epitaph: 'actually doing fine', tilt: 2 },
  { id: 'forever-alone', epitaph: 'finally at peace', tilt: -1.5 },
]

const GHOSTS = ['harlem-shake', 'gangnam-style']

export default function Scene11() {
  const { open } = useArtifact()

  return (
    <section className="env s11-yard" data-mood="violet">
      <div className="s11-moon" aria-hidden="true" />
      <LightPool x="50%" />

      {/* ghosts rising from the sand */}
      {GHOSTS.map((id, i) => {
        const meme = getMeme(id)
        return (
          <div key={id} className="s11-ghost" style={{ left: `${24 + i * 44}%`, animationDelay: `${i * 9}s` }} aria-hidden="true">
            <ArtifactImage src={meme?.asset.localImage} apiQuery={meme?.asset.giphySearchTerm} alt="" />
          </div>
        )
      })}

      {/* the stones */}
      <div className="s11-row">
        {GRAVES.map((g, i) => {
          const meme = getMeme(g.id)
          if (!meme) return null
          return (
            <button
              key={g.id}
              type="button"
              className="s11-grave"
              style={{ transform: `rotate(${g.tilt}deg) translateY(${(i % 2) * 14}px)` }}
              onClick={() => open(g.id)}
              aria-label={`Visit the grave of ${meme.name}`}
            >
              <span className="s11-stone">
                <b>{meme.name}</b>
                <i>
                  {meme.createdYear}–{meme.peakYear}
                </i>
                <em>{g.epitaph}</em>
              </span>
              <span className="s11-mound" aria-hidden="true" />
            </button>
          )
        })}
      </div>

      <div className="s11-sand" aria-hidden="true" />

      <Plaque className="s11-plaque" id="memorial / the quiet wing" title="The Meme Graveyard">
        Nothing here is forgotten — just finished. Tap a stone to pay respects; the ghosts
        come out on their own schedule.
      </Plaque>
      <FieldNote className="s11-note">silence please · f to pay respects</FieldNote>

      <DustField density={35} drift={0.04} />
      <FloorFog />
      <FloorFog />
      <Vignette />
    </section>
  )
}
