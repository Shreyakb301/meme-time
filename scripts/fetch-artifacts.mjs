/**
 * Fetch real artifact images for the archive from Wikipedia.
 *
 * For every meme in data/memes.json with an asset.wikipediaPage,
 * pull the article's lead image via the Wikimedia REST summary
 * API, save it to public/memes/<id>/original.<ext>, and write the
 * local path back into asset.localImage. Already-downloaded memes
 * are skipped, so it's safe to re-run.
 *
 * Usage: node scripts/fetch-artifacts.mjs
 */
import fs from 'node:fs/promises'

const dataUrl = new URL('../data/memes.json', import.meta.url)
const memes = JSON.parse(await fs.readFile(dataUrl, 'utf8'))

const HEADERS = { 'User-Agent': 'MEMETIME-museum/0.1 (local educational art project)' }

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function politeFetch(url, attempts = 4) {
  for (let i = 0; i < attempts; i++) {
    const res = await fetch(url, { headers: HEADERS })
    if (res.status !== 429) return res
    const wait = 3000 * (i + 1)
    console.log(`    429 from wikipedia, backing off ${wait / 1000}s…`)
    await sleep(wait)
  }
  return fetch(url, { headers: HEADERS })
}

function pickImage(summary) {
  const orig = summary.originalimage
  if (orig?.source && orig.width <= 1600) return orig.source
  const thumb = summary.thumbnail?.source
  if (thumb) return thumb.replace(/\/(\d+)px-/, '/800px-')
  return orig?.source ?? null
}

let ok = 0
let skipped = 0
let failed = 0

for (const meme of memes) {
  const page = meme.asset?.wikipediaPage
  if (!page) {
    skipped++
    console.log(`--  ${meme.id}: no wikipedia page, keeping local reconstruction`)
    continue
  }
  if (meme.asset.localImage) {
    ok++
    console.log(`ok  ${meme.id}: already downloaded`)
    continue
  }
  try {
    await sleep(1200)
    const res = await politeFetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(page)}`,
    )
    if (!res.ok) throw new Error(`summary HTTP ${res.status}`)
    const summary = await res.json()
    const src = pickImage(summary)
    if (!src) throw new Error('article has no lead image')

    const ext = (new URL(src).pathname.match(/\.(gif|png|jpe?g|webp)$/i)?.[1] ?? 'jpg').toLowerCase()
    const dir = new URL(`../public/memes/${meme.id}/`, import.meta.url)
    await fs.mkdir(dir, { recursive: true })
    const imgRes = await politeFetch(src)
    if (!imgRes.ok) throw new Error(`image HTTP ${imgRes.status}`)
    const buf = Buffer.from(await imgRes.arrayBuffer())
    await fs.writeFile(new URL(`original.${ext}`, dir), buf)

    meme.asset.localImage = `/memes/${meme.id}/original.${ext}`
    ok++
    console.log(`ok  ${meme.id} ← ${src} (${(buf.length / 1024).toFixed(0)} kB)`)
  } catch (e) {
    failed++
    console.log(`!!  ${meme.id}: ${e.message}`)
  }
}

await fs.writeFile(dataUrl, JSON.stringify(memes, null, 2) + '\n')
console.log(`\n${ok} ok, ${skipped} without wikipedia page, ${failed} failed`)
