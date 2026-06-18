'use client'

import type { CSSProperties, ReactNode } from 'react'
import { getMeme } from '@/lib/memes'
import { useArtifact } from './ArtifactModal'
import ArtifactImage from '@/components/fx/ArtifactImage'

/**
 * MemeArtifact — a clickable exhibit. Renders the meme's archival
 * image (or a provided reconstruction), labels it like a museum
 * specimen, and opens the examination modal on click.
 */
export default function MemeArtifact({
  id,
  className = '',
  imgClassName = '',
  caption = true,
  style,
  children,
}: {
  id: string
  className?: string
  imgClassName?: string
  caption?: boolean
  style?: CSSProperties
  children?: ReactNode // fallback reconstruction
}) {
  const meme = getMeme(id)
  const { open } = useArtifact()
  if (!meme) return null

  return (
    <button
      type="button"
      className={`exhibit ${className}`}
      style={style}
      onClick={() => open(id)}
      aria-label={`Inspect ${meme.name}`}
    >
      <ArtifactImage
        src={meme.asset.localImage}
        apiQuery={meme.asset.giphySearchTerm}
        alt={meme.name}
        className={`exhibit__img ${imgClassName}`}
        fallback={children}
      />
      {caption && (
        <span className="exhibit-tag">
          {meme.name} · {meme.createdYear}
        </span>
      )}
    </button>
  )
}
