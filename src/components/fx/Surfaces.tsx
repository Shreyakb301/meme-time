import type { CSSProperties, ReactNode } from 'react'

/**
 * Surfaces — archaeology textures for a room: dig-site grid floor,
 * CRT scanlines, half-buried strata numerals.
 */

/** Perspective wireframe floor — the excavation grid. */
export function GridFloor() {
  return <div className="grid-floor" aria-hidden="true" />
}

/** CRT scanlines for rooms set in older strata. */
export function Scanlines() {
  return <div className="scanlines" aria-hidden="true" />
}

/** Giant outlined era numeral, half-buried behind the content. */
export function StratumNumeral({
  style,
  children,
}: {
  style?: CSSProperties
  children: ReactNode
}) {
  return (
    <div className="stratum-numeral" style={style} aria-hidden="true">
      {children}
    </div>
  )
}
