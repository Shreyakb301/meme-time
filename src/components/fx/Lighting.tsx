import type { CSSProperties } from 'react'

/**
 * Lighting — museum light fixtures. All are absolutely positioned
 * inside an environment and tint themselves from --era-accent.
 */

/** Angled beam falling from above, like a skylight on an artifact. */
export function LightShaft({
  x = '50%',
  angle = -8,
  style,
}: {
  x?: string
  angle?: number
  style?: CSSProperties
}) {
  return (
    <div
      className="light-shaft"
      style={{ left: x, '--shaft-angle': `${angle}deg`, ...style } as CSSProperties}
      aria-hidden="true"
    />
  )
}

/** Pool of light where a beam meets the floor. */
export function LightPool({ x = '50%', style }: { x?: string; style?: CSSProperties }) {
  return (
    <div
      className="light-pool"
      style={{ left: x, transform: 'translateX(-50%)', ...style }}
      aria-hidden="true"
    />
  )
}

/** Darkness pressing in at the edges of the room. */
export function Vignette() {
  return <div className="vignette" aria-hidden="true" />
}

/** Low fog hugging the floor. */
export function FloorFog() {
  return <div className="floor-fog" aria-hidden="true" />
}
