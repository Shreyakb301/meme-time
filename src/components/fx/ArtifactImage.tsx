'use client'

import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { fetchGiphyPreview } from '@/lib/enrich'

/**
 * ArtifactImage — a Giphy-powered artifact image with a graceful
 * local fallback. If the API is unavailable, misses, or returns a
 * broken URL, the curated local asset is used instead.
 */
export default function ArtifactImage({
  src,
  apiQuery,
  alt,
  className = '',
  style,
  fallback = null,
}: {
  src?: string
  apiQuery?: string
  alt: string
  className?: string
  style?: CSSProperties
  fallback?: ReactNode
}) {
  const [failed, setFailed] = useState(false)
  const [apiSrc, setApiSrc] = useState<string | null>(null)
  const [apiFailed, setApiFailed] = useState(false)

  useEffect(() => {
    let live = true
    setFailed(false)
    setApiFailed(false)
    setApiSrc(null)
    if (!apiQuery) return
    fetchGiphyPreview(apiQuery).then((preview) => {
      if (live) setApiSrc(preview)
    })
    return () => {
      live = false
    }
  }, [apiQuery, src])

  const displaySrc = apiSrc && !apiFailed ? apiSrc : src

  if (!displaySrc || failed) return <>{fallback}</>
  return (
    <img
      src={displaySrc}
      alt={alt}
      className={className}
      style={style}
      draggable={false}
      onError={() => {
        if (displaySrc === apiSrc && src) {
          setApiFailed(true)
          return
        }
        setFailed(true)
      }}
    />
  )
}
