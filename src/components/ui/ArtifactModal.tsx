'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { getMeme } from '@/lib/memes'
import { fetchWikiSummary } from '@/lib/enrich'
import ArtifactImage from '@/components/fx/ArtifactImage'

/**
 * ArtifactModal — the examination room. Clicking any exhibit
 * anywhere in the museum opens the specimen on a study plate:
 * image, provenance, description, references. Wikipedia context
 * is fetched as optional enrichment and fails silently.
 */

const ArtifactContext = createContext<{ open: (id: string) => void }>({ open: () => {} })

export const useArtifact = () => useContext(ArtifactContext)

export function ArtifactModalProvider({ children }: { children: ReactNode }) {
  const [memeId, setMemeId] = useState<string | null>(null)
  const [wiki, setWiki] = useState<string | null>(null)
  const [consulting, setConsulting] = useState(false)

  const meme = memeId ? getMeme(memeId) : undefined
  const open = useCallback((id: string) => setMemeId(id), [])
  const close = useCallback(() => setMemeId(null), [])

  useEffect(() => {
    setWiki(null)
    if (!meme?.asset.wikipediaPage) return
    let live = true
    setConsulting(true)
    fetchWikiSummary(meme.asset.wikipediaPage).then((s) => {
      if (!live) return
      setConsulting(false)
      if (s?.extract && s.extract !== meme.description) setWiki(s.extract)
    })
    return () => {
      live = false
    }
  }, [memeId]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [close])

  return (
    <ArtifactContext.Provider value={{ open }}>
      {children}
      <AnimatePresence>
        {meme && (
          <motion.div
            className="amodal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
          >
            <motion.div
              className="amodal__plate"
              role="dialog"
              aria-modal="true"
              aria-label={`${meme.name} — specimen record`}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="amodal__close" onClick={close} aria-label="Close specimen record">
                ✕
              </button>

              <div className="amodal__media">
                <ArtifactImage
                  src={meme.asset.localImage}
                  apiQuery={meme.asset.giphySearchTerm}
                  alt={meme.name}
                  fallback={<span className="amodal__noimg">ARTIFACT IMAGE NOT RECOVERED</span>}
                />
              </div>

              <div className="amodal__info">
                <span className="amodal__id">
                  specimen · {meme.id} · {meme.category}
                </span>
                <h3 className="amodal__name">{meme.name}</h3>
                <div className="amodal__meta">
                  <span>origin {meme.createdYear}</span>
                  <span>peak {meme.peakYear}</span>
                  <span>{meme.originPlatform}</span>
                  <span data-status={meme.status}>{meme.status}</span>
                </div>
                <p className="amodal__desc">{meme.description}</p>
                {consulting && <p className="amodal__loading">consulting the archive…</p>}
                {wiki && <p className="amodal__wiki">{wiki}</p>}
                <div className="amodal__refs">
                  {meme.asset.wikipediaPage && (
                    <a
                      href={`https://en.wikipedia.org/wiki/${meme.asset.wikipediaPage}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      wikipedia ↗
                    </a>
                  )}
                  {meme.asset.knowYourMemeUrl && (
                    <a href={meme.asset.knowYourMemeUrl} target="_blank" rel="noreferrer">
                      know your meme ↗
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ArtifactContext.Provider>
  )
}
