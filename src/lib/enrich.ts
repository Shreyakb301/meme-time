/**
 * Optional API enrichment. The museum is fully functional without
 * any of this: every fetcher fails soft to null, responses are
 * cached for the session, and callers must treat null as "use the
 * local curated data".
 */

export interface WikiSummary {
  title: string
  extract: string
  thumbnail?: string
}

const wikiCache = new Map<string, WikiSummary | null>()

/** Wikimedia REST summary for an article title (e.g. "Doge_(meme)"). */
export async function fetchWikiSummary(page: string): Promise<WikiSummary | null> {
  if (!page) return null
  if (wikiCache.has(page)) return wikiCache.get(page) ?? null
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(page)}`,
      { headers: { Accept: 'application/json' } },
    )
    if (!res.ok) throw new Error(String(res.status))
    const json = await res.json()
    const summary: WikiSummary = {
      title: json.title ?? page,
      extract: json.extract ?? '',
      thumbnail: json.thumbnail?.source,
    }
    wikiCache.set(page, summary)
    return summary
  } catch {
    wikiCache.set(page, null)
    return null
  }
}

/** Giphy preview GIF, only if NEXT_PUBLIC_GIPHY_KEY is configured. */
export async function fetchGiphyPreview(query: string): Promise<string | null> {
  const key = process.env.NEXT_PUBLIC_GIPHY_KEY
  if (!key) return null
  try {
    const res = await fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=${key}&q=${encodeURIComponent(query)}&limit=1&rating=g`,
    )
    if (!res.ok) return null
    const json = await res.json()
    return json.data?.[0]?.images?.fixed_height_small?.url ?? null
  } catch {
    return null
  }
}
