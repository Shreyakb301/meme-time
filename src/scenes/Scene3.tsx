'use client'

import { motion, useTransform, type MotionValue } from 'framer-motion'
import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from 'react'
import PinnedSequence from '@/components/layout/PinnedSequence'
import DustField from '@/components/fx/DustField'
import { Vignette, FloorFog, LightPool } from '@/components/fx/Lighting'
import { StratumNumeral } from '@/components/fx/Surfaces'
import { Plaque, FieldNote } from '@/components/ui/Plaque'
import PixelSprite from '@/components/fx/PixelSprite'
import ArtifactImage from '@/components/fx/ArtifactImage'
import { useArtifact } from '@/components/ui/ArtifactModal'
import { getMeme, peakScore, type MemeStatus } from '@/lib/memes'

/**
 * SCENE 3 — HALL II · The Social Web Emerges (2004–2008).
 * The internet connects: platforms switch on around the visitor,
 * browser windows multiply into cascades, comments rise like
 * bubbles, and glowing network lines grow between everything.
 * The era's specimens are mounted as collectible trading cards —
 * foil edges, holo sweep, full pointer tilt. Gotta cache 'em all.
 * Deliberately busier than Hall I: the crowd has arrived.
 */

/* Gray cat, two frames (G fur, D eyes) — fallback for both cat cards */
const CAT_FRAMES = [
  [
    '.G...G..',
    '.GGGGG..',
    '.GDGDG..',
    '.GGGGG..',
    '..GGG...',
    '.GGGGG.G',
    '.GGGGG.G',
    '.G...G.G',
  ],
  [
    '.G...G..',
    '.GGGGG..',
    '.GDGGG..',
    '.GGGGG..',
    '..GGG...',
    '.GGGGGG.',
    '.GGGGG..',
    '.G...G..',
  ],
]

const CAT_PALETTE = { G: '#9aa3b2', D: '#1c1c30' }

/* Network anchors (viewport %) — denser than Hall I had artifacts */
const NODES = [
  { x: 10, y: 22 },
  { x: 30, y: 10 },
  { x: 50, y: 16 },
  { x: 72, y: 9 },
  { x: 90, y: 24 },
  { x: 13, y: 60 },
  { x: 35, y: 80 },
  { x: 57, y: 72 },
  { x: 79, y: 62 },
  { x: 93, y: 82 },
]

const EDGES: Array<[number, number, number]> = [
  // [from, to, when the line starts growing (progress)]
  [0, 1, 0.05],
  [1, 2, 0.12],
  [2, 3, 0.18],
  [0, 5, 0.24],
  [3, 4, 0.3],
  [5, 6, 0.36],
  [2, 7, 0.42],
  [6, 7, 0.48],
  [4, 8, 0.54],
  [7, 8, 0.6],
  [1, 5, 0.66],
  [8, 9, 0.7],
  [3, 8, 0.74],
  [6, 9, 0.78],
]

function NetworkEdge({
  progress,
  from,
  to,
  start,
}: {
  progress: MotionValue<number>
  from: { x: number; y: number }
  to: { x: number; y: number }
  start: number
}) {
  const pathLength = useTransform(progress, [start, start + 0.12], [0, 1])
  const mx = (from.x + to.x) / 2 + (from.y - to.y) * 0.18
  const my = (from.y + to.y) / 2 + (to.x - from.x) * 0.18
  return (
    <motion.path
      className="s3-edge"
      d={`M ${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`}
      style={{ pathLength }}
    />
  )
}

/** An artifact that switches on at `at`, then keeps drifting up. */
function Arrival({
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
  const opacity = useTransform(progress, [at, at + 0.08], [0, 1])
  const scale = useTransform(progress, [at, at + 0.08], [0.8, 1])
  const y = useTransform(progress, [at, 1], [40, -90])
  return (
    <motion.div className="s3-artifact" style={{ ...style, opacity, scale, y }}>
      {children}
    </motion.div>
  )
}

/* ---------- The collectible deck ---------- */

const RARITY: Record<MemeStatus, string> = {
  immortal: '★ legendary',
  active: '◆ rare',
  revived: '◆ rare',
  dormant: '● uncommon',
  extinct: '○ common',
}

/** A trading card with full pointer tilt + glare; click to examine. */
function CollectibleCard({
  id,
  serial,
  fallback,
}: {
  id: string
  serial: number
  fallback?: ReactNode
}) {
  const meme = getMeme(id)
  const { open } = useArtifact()
  const ref = useRef<HTMLButtonElement>(null)
  if (!meme) return null

  const onMove = (e: PointerEvent<HTMLButtonElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    el.style.setProperty('--tilt-x', `${((0.5 - py) * 14).toFixed(2)}deg`)
    el.style.setProperty('--tilt-y', `${((px - 0.5) * 18).toFixed(2)}deg`)
    el.style.setProperty('--glare-x', `${(px * 100).toFixed(1)}%`)
    el.style.setProperty('--glare-y', `${(py * 100).toFixed(1)}%`)
  }

  const onLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--tilt-x', '0deg')
    el.style.setProperty('--tilt-y', '0deg')
  }

  return (
    <button
      type="button"
      ref={ref}
      className="s3-card"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onClick={() => open(id)}
      aria-label={`Inspect ${meme.name}`}
    >
      <span className="s3-card__rarity">{RARITY[meme.status]}</span>
      <span className="s3-card__art">
        <ArtifactImage
          src={meme.asset.localImage}
          alt={meme.name}
          className="s3-card__img"
          fallback={fallback}
        />
      </span>
      <span className="s3-card__name">{meme.name}</span>
      <span className="s3-card__type">viral artifact · {meme.originPlatform}</span>
      <span className="s3-card__stats">
        origin <b>{meme.createdYear}</b> · peak <b>{meme.peakYear}</b> · pwr <b>{peakScore(meme)}</b>
      </span>
      <span className="s3-card__serial">
        № {String(serial).padStart(3, '0')} · series ii · 2004–2008
      </span>
      <i className="s3-card__glare" aria-hidden="true" />
    </button>
  )
}

/** A deck slot that deals its card in at `at`, pre-fanned by `tilt`. */
function DeckSlot({
  progress,
  at,
  tilt,
  lift = 0,
  children,
}: {
  progress: MotionValue<number>
  at: number
  tilt: number
  lift?: number
  children: ReactNode
}) {
  const opacity = useTransform(progress, [at, at + 0.08], [0, 1])
  const y = useTransform(progress, [at, at + 0.1], [70 + lift, lift])
  return (
    <motion.div className="s3-deck__slot" style={{ opacity, y, rotate: tilt }}>
      {children}
    </motion.div>
  )
}

/* ---------- The platforms switching on ---------- */

function PlatformWindow({
  title,
  multi = false,
  children,
}: {
  title: string
  multi?: boolean
  children?: ReactNode
}) {
  return (
    <div className={multi ? 's3-win s3-win--multi' : 's3-win'}>
      <div className="s3-win__bar">
        <span>{title}</span>
        <span className="s3-win__btns" aria-hidden="true"><i /><i /><i /></span>
      </div>
      <div className="s3-win__body">
        {children ?? (
          <>
            <i className="s3-win__skel" />
            <i className="s3-win__skel" />
            <i className="s3-win__skel s3-win__skel--short" />
          </>
        )}
      </div>
    </div>
  )
}

function MyspaceTom() {
  return (
    <div className="s3-myspace">
      <div className="s3-myspace__head">MySpace — a place for friends</div>
      <div className="s3-myspace__row">
        <span className="s3-myspace__ava" aria-hidden="true">TOM</span>
        <p>
          <b>Tom</b> is your friend!
          <br />
          <small>&ldquo;Thanks for the add!&rdquo;</small>
        </p>
      </div>
      <div className="s3-myspace__top8" aria-hidden="true">
        {Array.from({ length: 8 }, (_, i) => (
          <i key={i} />
        ))}
      </div>
      <span className="s3-tag">myspace · 2004 · everyone&rsquo;s first friend</span>
    </div>
  )
}

function UploadWindow() {
  return (
    <PlatformWindow title="YouTube — Broadcast Yourself™" multi>
      <p className="s3-win__line">upload complete: <b>keyboard_cat.avi</b></p>
      <div className="s3-upload" aria-hidden="true"><i /></div>
      <p className="s3-win__line">processing… 240p · views so far: 3</p>
    </PlatformWindow>
  )
}

function FriendRequestPopup() {
  return (
    <div className="s3-popup">
      <p className="s3-popup__title">⚑ new friend request</p>
      <p>1 of 4,302 people you may know</p>
      <div className="s3-popup__btns" aria-hidden="true">
        <span className="is-yes">Accept</span>
        <span>Deny</span>
      </div>
    </div>
  )
}

const BUBBLES = [
  { text: 'FIRST!!', x: '8%', delay: '0s', dur: '11s' },
  { text: 'lol', x: '20%', delay: '3s', dur: '9s' },
  { text: 'sub 4 sub?', x: '31%', delay: '6s', dur: '12s' },
  { text: 'thumbs up if ur watching in 2008', x: '44%', delay: '1.5s', dur: '13s' },
  { text: 'omg so random xD', x: '56%', delay: '7.5s', dur: '10s' },
  { text: 'add me!!1', x: '65%', delay: '4.5s', dur: '9.5s' },
  { text: '~*~ new pics up ~*~', x: '74%', delay: '2.2s', dur: '12.5s' },
  { text: 'poked you back', x: '84%', delay: '8.4s', dur: '11s' },
  { text: 'EPIC WIN', x: '92%', delay: '5.6s', dur: '10.5s' },
]

function Hall({ progress }: { progress: MotionValue<number> }) {
  const push = useTransform(progress, [0, 1], [0.98, 1.05])
  const numeralY = useTransform(progress, [0, 1], [80, -180])
  const deckY = useTransform(progress, [0, 1], [30, -60])

  return (
    <motion.div style={{ position: 'absolute', inset: 0, scale: push }}>
      <div className="s3-air" aria-hidden="true" />
      <LightPool x="50%" />

      <motion.div style={{ position: 'absolute', inset: 0, y: numeralY }} aria-hidden="true">
        <StratumNumeral style={{ right: '-4%', top: '6%' }}>2004</StratumNumeral>
      </motion.div>

      {/* the network grows as the room connects */}
      <svg className="s3-network" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {EDGES.map(([a, b, start]) => (
          <NetworkEdge key={`${a}-${b}`} progress={progress} from={NODES[a]} to={NODES[b]} start={start} />
        ))}
        {NODES.map((n, i) => (
          <circle key={i} className="s3-node" cx={n.x} cy={n.y} r="0.5" style={{ animationDelay: `${i * 0.6}s` }} />
        ))}
      </svg>

      {/* the era's specimens, dealt onto the table as a fanned hand */}
      <motion.div className="s3-deck" style={{ y: deckY }}>
        <DeckSlot progress={progress} at={0.1} tilt={-7} lift={14}>
          <CollectibleCard id="rickroll" serial={4} />
        </DeckSlot>
        <DeckSlot progress={progress} at={0.18} tilt={0}>
          <CollectibleCard
            id="lolcats"
            serial={5}
            fallback={<PixelSprite frames={CAT_FRAMES} palette={CAT_PALETTE} px={9} fps={1.6} label="LOLcat, pixel reconstruction" />}
          />
        </DeckSlot>
        <DeckSlot progress={progress} at={0.26} tilt={7} lift={14}>
          <CollectibleCard
            id="keyboard-cat"
            serial={6}
            fallback={<PixelSprite frames={CAT_FRAMES} palette={CAT_PALETTE} px={9} fps={2.6} label="Keyboard Cat, pixel reconstruction" />}
          />
        </DeckSlot>
      </motion.div>

      {/* platforms switching on, browser windows multiplying */}
      <Arrival progress={progress} at={0.3} style={{ left: '5%', top: '12%' }}>
        <div className="s2-float" style={{ '--bob': '10s', '--rot': '-1.2deg' } as CSSProperties}>
          <MyspaceTom />
        </div>
      </Arrival>

      <Arrival progress={progress} at={0.38} style={{ right: '6%', top: '13%' }}>
        <div className="s2-float" style={{ '--bob': '8.5s', '--rot': '1.2deg' } as CSSProperties}>
          <UploadWindow />
        </div>
      </Arrival>

      <Arrival progress={progress} at={0.46} style={{ left: '6%', bottom: '20%' }}>
        <div className="s2-float" style={{ '--bob': '11s', '--rot': '0.8deg' } as CSSProperties}>
          <PlatformWindow title="thefacebook — login" multi />
        </div>
      </Arrival>

      <Arrival progress={progress} at={0.56} style={{ right: '9%', bottom: '22%' }}>
        <div className="s2-float" style={{ '--bob': '9s', '--rot': '-0.9deg' } as CSSProperties}>
          <FriendRequestPopup />
        </div>
      </Arrival>

      <Arrival progress={progress} at={0.64} style={{ left: '28%', top: '6%' }}>
        <div className="s2-float" style={{ '--bob': '12s', '--rot': '0.5deg' } as CSSProperties}>
          <PlatformWindow title="flickr — your photos" multi />
        </div>
      </Arrival>

      <Arrival progress={progress} at={0.72} style={{ right: '27%', top: '5%' }}>
        <div className="s2-float" style={{ '--bob': '7.5s', '--rot': '-0.6deg' } as CSSProperties}>
          <PlatformWindow title="twttr — what are you doing?" />
        </div>
      </Arrival>

      {/* user-generated content rising like bubbles in the tank */}
      <div className="s3-bubbles" aria-hidden="true">
        {BUBBLES.map((b) => (
          <span
            key={b.text}
            className="s3-bubble"
            style={{ left: b.x, animationDelay: b.delay, animationDuration: b.dur }}
          >
            {b.text}
          </span>
        ))}
      </div>

      {/* the inevitable interruption */}
      <div className="s3-rickbanner" aria-hidden="true">
        ♪ NEVER GONNA GIVE YOU UP ♪ NEVER GONNA LET YOU DOWN ♪ NEVER GONNA RUN AROUND AND DESERT YOU ♪
      </div>

      {/* the upload firehose along the floor */}
      <div className="s3-ticker" aria-hidden="true">
        <div className="s3-ticker__track">
          {[0, 1].map((k) => (
            <span key={k}>
              ▲ UPLOADS THIS MINUTE: 14,302 ▲ NEW FRIENDS: 88 ▲ COMMENTS POSTED: 240,116 ▲ THE
              AUDIENCE IS NOW THE AUTHOR ▲&nbsp;
            </span>
          ))}
        </div>
      </div>

      <Plaque className="s3-plaque" id="hall ii / stratum 2004–2008" title="The Social Web Emerges">
        Broadband arrives and the wires light up. Platforms multiply, windows stack on
        windows, and the audience becomes the author. Collect them all.
      </Plaque>
      <FieldNote style={{ position: 'absolute', top: 'var(--space-scene)', right: 'var(--gutter)', zIndex: 4 }}>
        user-generated content detected · volume rising
      </FieldNote>

      <DustField density={75} drift={0.16} />
      <FloorFog />
      <Vignette />
    </motion.div>
  )
}

export default function Scene3() {
  return (
    <PinnedSequence mood="violet" length={4}>
      {(progress) => <Hall progress={progress} />}
    </PinnedSequence>
  )
}
