import memesJson from '../../data/memes.json'

/**
 * The curated archive. Local data is the primary source — APIs
 * only ever enrich it (see lib/enrich.ts) and the museum must
 * work fully offline.
 */

export interface PopularityPoint {
  year: number
  score: number // 0–100, relative cultural footprint
}

export interface MemeAsset {
  localImage: string
  localGif: string
  giphySearchTerm: string
  youtubeVideoId: string
  wikipediaPage: string
  knowYourMemeUrl: string
}

export type MemeStatus = 'extinct' | 'dormant' | 'active' | 'immortal' | 'revived'

export interface Meme {
  id: string
  name: string
  createdYear: number
  peakYear: number
  category: string
  originPlatform: string
  description: string
  status: MemeStatus
  relatedMemes: string[]
  popularity: PopularityPoint[]
  asset: MemeAsset
}

export const memes = memesJson as Meme[]

const byId = new Map(memes.map((m) => [m.id, m]))

export function getMeme(id: string): Meme | undefined {
  return byId.get(id)
}

/** Memes whose lifetime intersects an era (used by the halls). */
export function memesInEra(from: number, to: number): Meme[] {
  return memes.filter((m) => m.createdYear <= to && m.peakYear >= from)
}

/** Peak score across a meme's whole life. */
export function peakScore(meme: Meme): number {
  return Math.max(...meme.popularity.map((p) => p.score), 0)
}

/** Popularity at a given year, linearly interpolated (landscape scene). */
export function popularityAt(meme: Meme, year: number): number {
  const pts = meme.popularity
  if (pts.length === 0) return 0
  if (year <= pts[0].year) return year < meme.createdYear ? 0 : pts[0].score
  const last = pts[pts.length - 1]
  if (year >= last.year) return last.score
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i]
    const b = pts[i + 1]
    if (year >= a.year && year <= b.year) {
      const t = (year - a.year) / (b.year - a.year)
      return a.score + (b.score - a.score) * t
    }
  }
  return 0
}
