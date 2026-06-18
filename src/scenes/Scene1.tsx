'use client'

import { motion, useTransform, type MotionValue } from 'framer-motion'
import PinnedSequence from '@/components/layout/PinnedSequence'
import DustField from '@/components/fx/DustField'
import { Vignette, FloorFog } from '@/components/fx/Lighting'
import { Scanlines } from '@/components/fx/Surfaces'
import { blurIn, fadeUp, stagger } from '@/lib/motion'

/**
 * SCENE 1 — The Platform.
 * The visitor stands at the beginning of internet history. A rail
 * track recedes into darkness with the years engraved along it;
 * scrolling walks the camera forward down the line. MEMETIME is a
 * physical sign beside the track that you pass on the way in.
 */

const YEARS = [1996, 2000, 2005, 2010, 2015, 2020, 2026]
const FIRST = 460 // distance (track px) from the visitor to 1996
const SPACING = 720 // track px between engraved years
const TRAVEL = 4000 // how far the camera walks over the whole scroll

function Platform({ progress }: { progress: MotionValue<number> }) {
  // One value drives the walk: years slide toward the camera and
  // the cross-ties stream underfoot at the same rate.
  const walk = useTransform(progress, [0, 1], [0, TRAVEL])

  // The sign sits beside the entrance; walking forward carries it
  // past the visitor's left shoulder.
  const signZ = useTransform(progress, [0, 0.4], [-320, 420])
  const signX = useTransform(progress, [0, 0.4], [0, -280])
  const signOpacity = useTransform(progress, [0, 0.28, 0.4], [1, 1, 0])

  const hintOpacity = useTransform(progress, [0, 0.06], [1, 0])

  return (
    <>
      <div className="s1-sky" aria-hidden="true" />
      <div className="s1-horizon" aria-hidden="true" />

      <div className="s1-camera">
        <div className="s1-world">
          <div className="s1-track" aria-hidden="true">
            <motion.div className="s1-ties" style={{ backgroundPositionY: walk }} />
            <motion.div className="s1-years" style={{ y: walk }}>
              {YEARS.map((year, i) => (
                <span key={year} className="s1-year" style={{ bottom: FIRST + i * SPACING }}>
                  {year}
                </span>
              ))}
              <span
                className="s1-year s1-year--today"
                style={{ bottom: FIRST + YEARS.length * SPACING + 700 }}
              >
                TODAY
              </span>
            </motion.div>
          </div>

          <motion.div
            className="s1-sign"
            style={{ z: signZ, x: signX, opacity: signOpacity, rotateY: 18 }}
            variants={stagger(0.5)}
            initial="hidden"
            animate="show"
          >
            <motion.h1 className="s1-sign__name" variants={blurIn}>
              MEMETIME
            </motion.h1>
            <motion.p className="s1-sign__sub" variants={fadeUp}>
              The Visual History of Internet Culture
            </motion.p>
            <motion.p className="s1-sign__years" variants={fadeUp}>
              1996 → today
            </motion.p>
          </motion.div>
        </div>
      </div>

      <DustField density={90} drift={0.12} pixel />
      <Scanlines />
      <FloorFog />
      <Vignette />

      <motion.div className="s1-hint" style={{ opacity: hintOpacity }}>
        <span className="s1-hint__pulse field-note">scroll to enter the archive</span>
      </motion.div>
    </>
  )
}

export default function Scene1() {
  return (
    <PinnedSequence mood="cyan" length={5}>
      {(progress) => <Platform progress={progress} />}
    </PinnedSequence>
  )
}
