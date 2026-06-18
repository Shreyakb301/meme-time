'use client'

import { motion, useTransform, type MotionValue } from 'framer-motion'
import type { CSSProperties } from 'react'
import PinnedSequence from '@/components/layout/PinnedSequence'
import DustField from '@/components/fx/DustField'
import { LightShaft, LightPool, Vignette, FloorFog } from '@/components/fx/Lighting'
import { Scanlines, GridFloor, StratumNumeral } from '@/components/fx/Surfaces'
import { Plaque, FieldNote } from '@/components/ui/Plaque'
import PixelSprite from '@/components/fx/PixelSprite'
import ArtifactImage from '@/components/fx/ArtifactImage'
import { getMeme } from '@/lib/memes'

/**
 * SCENE 2 — HALL I · The Early Internet (1996–2004).
 * The room powers on like a CRT. In the middle, an illuminated
 * display case holds the Dancing Baby — reconstructed in pixels,
 * flipping at GIF speed, a fossil under a flickering tube light.
 * Dead web pages drift around it like suspended sediment.
 */

/* Dancing Baby, two-frame pixel reconstruction (S skin, D eyes, W diaper) */
const BABY_FRAMES = [
  [
    '...SSSS...',
    '..SSSSSS..',
    '..SDSSDS..',
    '..SSSSSS..',
    '...SSSS...',
    '..SSSSSS..',
    '.SSSSSSSS.',
    'S.SSSSSS.S',
    'S.WWWWWW.S',
    '..WWWWWW..',
    '...S..S...',
    '...S..S...',
    '..SS..SS..',
  ],
  [
    '...SSSS...',
    '..SSSSSS..',
    '..SDSSDS..',
    '..SSSSSS..',
    'S..SSSS..S',
    'S.SSSSSS.S',
    '.SSSSSSSS.',
    '..SSSSSS..',
    '..WWWWWW..',
    '..WWWWWW..',
    '..S....S..',
    '..S....S..',
    '.SS....SS.',
  ],
]

const BABY_PALETTE = { S: '#f0c8a2', D: '#202036', W: '#eef0f6' }

/* Hampster, two frames (O fur, D eye, W belly) */
const HAMSTER_FRAMES = [
  [
    '..OOOO..',
    '.OOOOOO.',
    '.ODOOOO.',
    '.OWWWOO.',
    '..OOOO..',
    '.O.OO.O.',
    '..O..O..',
  ],
  [
    '..OOOO..',
    '.OOOOOO.',
    '.ODOOOO.',
    'OOWWWOOO',
    '..OOOO..',
    '..OOOO..',
    '..O..O..',
  ],
]

const HAMSTER_PALETTE = { O: '#d99a4e', D: '#26203a', W: '#f4e3c8' }

function GeocitiesWindow() {
  return (
    <div className="s2-window s2-window--home">
      <div className="s2-window__bar">
        <span>Netscape — wELcOmE 2 mY hOmEpAgE</span>
        <span className="s2-window__btns" aria-hidden="true"><i /><i /><i /></span>
      </div>
      <div className="s2-window__body">
        <p className="s2-geo__title">~*~ WeLcOmE 2 mY CoRnEr oF tHe WeB ~*~</p>
        <div className="s2-uc" aria-hidden="true" />
        <p className="s2-geo__uc">** UNDER CONSTRUCTION **</p>
        <p className="s2-geo__counter">
          YOU ARE VISITOR <b>00001337</b>
        </p>
        <p className="s2-geo__links">sign my guestbook · cool links · my cat</p>
        <p className="s2-geo__badge">best viewed in Netscape Navigator at 800×600</p>
      </div>
    </div>
  )
}

function BrokenGifWindow() {
  return (
    <div className="s2-window s2-window--gif">
      <div className="s2-window__bar">
        <span>baby2.gif — Netscape</span>
        <span className="s2-window__btns" aria-hidden="true"><i /><i /><i /></span>
      </div>
      <div className="s2-window__body">
        <div className="s2-broken" aria-hidden="true"><span>✕</span></div>
        <p className="s2-404">baby2.gif — 404 Not Found</p>
      </div>
    </div>
  )
}

function DialupWindow() {
  return (
    <div className="s2-window s2-window--dial">
      <div className="s2-window__bar">
        <span>Dial-Up Networking</span>
        <span className="s2-window__btns" aria-hidden="true"><i /><i /><i /></span>
      </div>
      <div className="s2-window__body">
        <p>Connecting to 1996 at 28.8 kbps…</p>
        <div className="s2-progress" aria-hidden="true">
          <i /><i /><i /><i /><i /><i className="is-blink" />
          <i className="is-dim" /><i className="is-dim" /><i className="is-dim" /><i className="is-dim" />
        </div>
        <span className="s2-btn" aria-hidden="true">OK</span>
      </div>
    </div>
  )
}

function HampsterWindow() {
  return (
    <div className="s2-window s2-window--hamster">
      <div className="s2-window__bar">
        <span>hampsterdance.com — Netscape</span>
        <span className="s2-window__btns" aria-hidden="true"><i /><i /><i /></span>
      </div>
      <div className="s2-window__body">
        <div className="s2-hamster-row">
          {[0, 1, 2, 3].map((i) => (
            <PixelSprite
              key={i}
              frames={HAMSTER_FRAMES}
              palette={HAMSTER_PALETTE}
              px={5}
              fps={i % 2 === 0 ? 3 : 2.4}
              label={i === 0 ? 'Hampster Dance hamsters, pixel reconstruction' : undefined}
            />
          ))}
        </div>
        <p className="s2-hamster-tune">♪ dee da dee da do do ♪</p>
        <p className="s2-404">{getMeme('hampster-dance')?.peakYear ?? 1999} · 17 million visitors on dial-up</p>
      </div>
    </div>
  )
}

function AllYourBaseScreen() {
  return (
    <div className="s2-ayb">
      <Scanlines />
      <ArtifactImage
        src={getMeme('all-your-base')?.asset.localImage}
        alt="All Your Base Are Belong To Us — Zero Wing intro screenshot"
        className="s2-ayb__img"
      />
      <p className="s2-ayb__cats">CATS:</p>
      <p className="s2-ayb__line">ALL YOUR BASE ARE BELONG TO US.</p>
      <p className="s2-ayb__sub">YOU HAVE NO CHANCE TO SURVIVE MAKE YOUR TIME.</p>
      <p className="s2-ayb__meta">ZERO WING — SEGA MEGA DRIVE — 1991 / MEME 2001</p>
    </div>
  )
}

function Hall({ progress }: { progress: MotionValue<number> }) {
  // CRT power-on: the room unsquashes over the first few percent
  const powerY = useTransform(progress, [0, 0.07], [0.004, 1])
  // Slow dolly into the room
  const push = useTransform(progress, [0, 1], [0.97, 1.05])

  // Sediment layers: each artifact rises past at its own rate
  const homeY = useTransform(progress, [0, 1], [70, -170])
  const gifY = useTransform(progress, [0, 1], [140, -300])
  const dialY = useTransform(progress, [0, 1], [40, -120])
  const hamY = useTransform(progress, [0, 1], [90, -200])
  const aybY = useTransform(progress, [0, 1], [120, -240])
  const numeralY = useTransform(progress, [0, 1], [90, -190])

  return (
    <motion.div className="s2-room" style={{ scaleY: powerY }}>
      <motion.div style={{ position: 'absolute', inset: 0, scale: push }}>
        <div className="s2-air" aria-hidden="true" />
        <GridFloor />

        <motion.div style={{ position: 'absolute', inset: 0, y: numeralY }} aria-hidden="true">
          <StratumNumeral style={{ left: '-3%', top: '4%' }}>1996</StratumNumeral>
        </motion.div>

        <LightShaft x="50%" angle={0} />
        <LightPool x="50%" />

        {/* drifting artifacts */}
        <motion.div className="s2-artifact" style={{ y: homeY, left: '6%', top: '14%' }}>
          <div className="s2-float" style={{ '--bob': '10s', '--rot': '-1.2deg' } as CSSProperties}>
            <GeocitiesWindow />
          </div>
        </motion.div>

        <motion.div className="s2-artifact" style={{ y: gifY, right: '9%', top: '12%' }}>
          <div className="s2-float" style={{ '--bob': '7.5s', '--rot': '1.6deg' } as CSSProperties}>
            <BrokenGifWindow />
          </div>
        </motion.div>

        <motion.div className="s2-artifact" style={{ y: dialY, right: '7%', bottom: '24%' }}>
          <div className="s2-float" style={{ '--bob': '12s', '--rot': '-0.8deg' } as CSSProperties}>
            <DialupWindow />
          </div>
        </motion.div>

        <motion.div className="s2-artifact" style={{ y: hamY, left: '16%', bottom: '30%' }}>
          <div className="s2-float" style={{ '--bob': '8.5s', '--rot': '1deg' } as CSSProperties}>
            <HampsterWindow />
          </div>
        </motion.div>

        <motion.div className="s2-artifact" style={{ y: aybY, left: '56%', top: '5%' }}>
          <div className="s2-float" style={{ '--bob': '11s', '--rot': '0.7deg' } as CSSProperties}>
            <AllYourBaseScreen />
          </div>
        </motion.div>

        {/* the fossil */}
        <div className="s2-case">
          <div className="s2-case__glass">
            <div className="s2-case__lamp" aria-hidden="true" />
            <Scanlines />
            <div>
              <ArtifactImage
                src={getMeme('dancing-baby')?.asset.localImage}
                alt="Dancing Baby — the 1996 animation"
                className="s2-case__img"
                fallback={
                  <PixelSprite
                    className="s2-case__specimen"
                    frames={BABY_FRAMES}
                    palette={BABY_PALETTE}
                    px={13}
                    fps={2}
                    label="Dancing Baby — pixel reconstruction of the 1996 animation"
                  />
                }
              />
              <div className="s2-case__plinth" aria-hidden="true" />
            </div>
          </div>
          <div className="s2-case__pedestal">
            <span className="s2-case__id">specimen 001 · baby_cha.gif · c. 1996</span>
            <span className="s2-case__name">Dancing Baby</span>
            <span className="s2-case__desc">{getMeme('dancing-baby')?.description}</span>
          </div>
        </div>

        <div className="marquee s2-marquee" aria-hidden="true">
          <div className="marquee__track">
            {[0, 1].map((k) => (
              <span key={k}>
                ★ YOU ARE VISITOR 14,302,114 ★ THIS PAGE IS UNDER CONSTRUCTION ★ SIGN THE
                GUESTBOOK ★ ADD ME TO YOUR WEBRING ★&nbsp;
              </span>
            ))}
          </div>
        </div>

        <Plaque className="s2-plaque" id="hall i / stratum 1996–2004" title="The Early Internet">
          Hand-built homepages, dial-up tones, and animations the size of a floppy disk.
        </Plaque>
        <FieldNote
          style={{ position: 'absolute', top: 'var(--space-scene)', right: 'var(--gutter)', zIndex: 4 }}
        >
          connection: 28.8 kbps · stratum i
        </FieldNote>

        <DustField density={60} drift={0.1} pixel />
        <div className="s2-crt" aria-hidden="true" />
        <FloorFog />
        <Vignette />
      </motion.div>
    </motion.div>
  )
}

export default function Scene2() {
  return (
    <PinnedSequence mood="cyan" length={4}>
      {(progress) => <Hall progress={progress} />}
    </PinnedSequence>
  )
}
