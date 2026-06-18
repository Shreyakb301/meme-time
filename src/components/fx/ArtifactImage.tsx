'use client'

import { useState, type CSSProperties, type ReactNode } from 'react'

/**
 * ArtifactImage — a real archival image with a graceful fallback.
 * If the file is missing or fails to load, the fallback (usually
 * a pixel reconstruction) is shown instead — the museum never
 * shows a broken frame, except the one that's an exhibit.
 */
export default function ArtifactImage({
  src,
  alt,
  className = '',
  style,
  fallback = null,
}: {
  src?: string
  alt: string
  className?: string
  style?: CSSProperties
  fallback?: ReactNode
}) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) return <>{fallback}</>
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      draggable={false}
      onError={() => setFailed(true)}
    />
  )
}
