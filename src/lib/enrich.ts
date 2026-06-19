/**
 * Optional API enrichment. Every fetcher fails soft to null,
 * responses are cached for the session, and callers should always
 * keep curated local data as a fallback.
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

const giphyCache = new Map<string, string | null>()
const giphyPending = new Map<string, Promise<string | null>>()
let giphyApiCalls = 0

function logGiphyCall(query: string) {
  if (process.env.NODE_ENV !== 'development') return
  giphyApiCalls += 1
  console.info(`[Giphy API] ${giphyApiCalls} unique GIF search calls`, { query })
}

/** Giphy preview GIF, only if NEXT_PUBLIC_GIPHY_KEY is configured. */
export async function fetchGiphyPreview(query: string): Promise<string | null> {
  const key = process.env.NEXT_PUBLIC_GIPHY_KEY
  if (!key || !query) return null
  if (giphyCache.has(query)) return giphyCache.get(query) ?? null
  if (giphyPending.has(query)) return giphyPending.get(query) ?? null

  logGiphyCall(query)
  const request = fetch(
    `https://api.giphy.com/v1/gifs/search?api_key=${key}&q=${encodeURIComponent(query)}&limit=1&rating=g`,
  )
    .then(async (res) => {
      if (!res.ok) throw new Error(String(res.status))
      const json = await res.json()
      return json.data?.[0]?.images?.fixed_height?.url ?? null
    })
    .catch(() => null)
    .then((preview) => {
      giphyCache.set(query, preview)
      giphyPending.delete(query)
      return preview
    })

  giphyPending.set(query, request)
  return request
}
