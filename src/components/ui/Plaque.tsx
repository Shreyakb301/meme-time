import type { CSSProperties, ReactNode } from 'react'

/**
 * Plaque — a museum wall label. The only "container" in the
 * system, and it is deliberately not a card: a rule, an exhibit
 * number, a title, a caption. Pin it anywhere on the stage.
 */
export function Plaque({
  id,
  title,
  children,
  className = '',
  style,
}: {
  id?: string
  title?: string
  children?: ReactNode
  className?: string
  style?: CSSProperties
}) {
  return (
    <div className={`plaque ${className}`} style={style}>
      {id && <span className="plaque__id">{id}</span>}
      {title && <span className="plaque__title">{title}</span>}
      {children && <span className="plaque__body">{children}</span>}
    </div>
  )
}

/** Free-floating mono annotation — a curator's pencil note. */
export function FieldNote({
  children,
  className = '',
  style,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  return (
    <span className={`field-note ${className}`} style={style}>
      {children}
    </span>
  )
}
