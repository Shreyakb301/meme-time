'use client'

import type { CSSProperties } from 'react'
import { Vignette } from '@/components/fx/Lighting'
import { Scanlines, StratumNumeral } from '@/components/fx/Surfaces'
import { Plaque, FieldNote } from '@/components/ui/Plaque'
import MemeArtifact from '@/components/ui/MemeArtifact'
import { getMeme } from '@/lib/memes'

/**
 * SCENE 10 — HALL V · The Fast Internet (2020–2026).
 * The algorithm era. Three vertical feeds auto-scroll at
 * different speeds; tiles surface and vanish; a scan beam sweeps
 * the room. Deliberately too much. That's the exhibit.
 */

type Tile = { kind: 'meme'; id: string } | { kind: 'text'; text: string; tone?: string }

const COLUMNS: Array<{ speed: string; tiles: Tile[] }> = [
  {
    speed: '14s',
    tiles: [
      { kind: 'meme', id: 'among-us' },
      { kind: 'text', text: 'POV: you opened the app for one minute', tone: 'cyan' },
      { kind: 'meme', id: 'wojak' },
      { kind: 'text', text: 'BERNIE · mittens · inauguration · 2021', tone: 'pink' },
      { kind: 'text', text: '⏵ sound on 🔊 wait for it…' },
    ],
  },
  {
    speed: '9s',
    tiles: [
      { kind: 'meme', id: 'skibidi-toilet' },
      { kind: 'text', text: 'NPC streamers say gang gang', tone: 'pink' },
      { kind: 'meme', id: 'distracted-boyfriend' },
      { kind: 'text', text: 'girl explaining » nobody listening', tone: 'cyan' },
      { kind: 'meme', id: 'dogecoin' },
    ],
  },
  {
    speed: '12s',
    tiles: [
      { kind: 'text', text: 'shrimp jesus has entered the feed', tone: 'cyan' },
      { kind: 'meme', id: 'npc-wojak' },
      { kind: 'text', text: 'this meme is already dead', tone: 'pink' },
      { kind: 'meme', id: 'ai-memes' },
      { kind: 'text', text: 'FOR YOU · FOR YOU · FOR YOU' },
    ],
  },
]

function FeedTile({ tile }: { tile: Tile }) {
  if (tile.kind === 'meme') {
    const meme = getMeme(tile.id)
    return (
      <div className="s10-tile">
        <MemeArtifact id={tile.id} caption={false} imgClassName="s10-tile__img">
          <span className="s10-tile__text">{meme?.name}</span>
        </MemeArtifact>
        <span className="s10-tile__meta">@{tile.id} · {meme?.peakYear}</span>
      </div>
    )
  }
  return (
    <div className={`s10-tile s10-tile--text ${tile.tone ? `is-${tile.tone}` : ''}`}>
      <span className="s10-tile__text">{tile.text}</span>
    </div>
  )
}

export default function Scene10() {
  return (
    <section className="env s10-hall" data-mood="cyan">
      <StratumNumeral style={{ left: '-4%', top: '4%' }}>2020</StratumNumeral>
      <div className="s10-scan" aria-hidden="true" />

      <div className="s10-feeds">
        {COLUMNS.map((col, i) => (
          <div key={i} className="s10-col">
            <div className="s10-col__track" style={{ '--feed-speed': col.speed } as CSSProperties}>
              {[0, 1].map((dup) => (
                <div key={dup} className="s10-col__set" aria-hidden={dup === 1}>
                  {col.tiles.map((t, j) => (
                    <FeedTile key={j} tile={t} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Plaque className="s10-plaque" id="hall v / stratum 2020–2026" title="The Fast Internet">
        The feed never ends and neither does the exhibit. Memes now live for a weekend;
        the algorithm is the curator.
      </Plaque>
      <FieldNote className="s10-note">attention span: 1.7s · autoplay: always</FieldNote>

      <Scanlines />
      <Vignette />
    </section>
  )
}
