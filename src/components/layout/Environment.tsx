import type { CSSProperties, ReactNode } from 'react'

export type Mood = 'lime' | 'violet' | 'cyan' | 'pink'
export type Stage = 'corner-tl' | 'corner-br' | 'floor' | 'center' | 'split'

/**
 * Environment — the root of every scene. A room, not a section.
 *
 * Owns the era mood (lighting tint for the whole subtree) and an
 * atmosphere layer rendered behind the stage. Content is composed
 * on the stage via a layout preset, then positioned freely.
 */
export default function Environment({
  mood = 'lime',
  stage = 'floor',
  atmosphere = null,
  className = '',
  style,
  children,
}: {
  mood?: Mood
  stage?: Stage
  atmosphere?: ReactNode
  className?: string
  style?: CSSProperties
  children?: ReactNode
}) {
  return (
    <section className={`env ${className}`} data-mood={mood} style={style}>
      {atmosphere}
      <div className={`env__stage env__stage--${stage}`}>{children}</div>
    </section>
  )
}
