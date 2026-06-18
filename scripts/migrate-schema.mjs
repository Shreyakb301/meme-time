/** One-off: migrate memes.json to the asset/popularity schema. */
import fs from 'node:fs/promises'

const url = new URL('../data/memes.json', import.meta.url)
const memes = JSON.parse(await fs.readFile(url, 'utf8'))

const YOUTUBE = {
  rickroll: 'dQw4w9WgXcQ',
  'keyboard-cat': 'J---aiyznGQ',
  'nyan-cat': 'QH2-TGUlwu4',
  'chocolate-rain': 'EwTZ2xpQwpA',
  'gangnam-style': '9bZkp7q19f0',
  'harlem-shake': '8vJiSSAMNWw',
}

for (const m of memes) {
  if (m.popularityData) {
    m.popularity = m.popularityData.map((p) => ({ year: p.year, score: p.value }))
    delete m.popularityData
  }
  const wiki = m.sources?.wikipedia ?? ''
  const title = wiki ? decodeURIComponent(wiki.split('/wiki/')[1] ?? '') : ''
  let localImage = ''
  if (m.imageUrl) {
    const ext = m.imageUrl.split('.').pop()
    localImage = `/memes/${m.id}/original.${ext}`
  }
  m.asset = {
    localImage,
    localGif: '',
    giphySearchTerm: `${m.name} meme`,
    youtubeVideoId: YOUTUBE[m.id] ?? '',
    wikipediaPage: title,
    knowYourMemeUrl: m.sources?.knowYourMeme ?? '',
  }
  delete m.imageUrl
  delete m.sources
}

await fs.writeFile(url, JSON.stringify(memes, null, 2) + '\n')
console.log(`migrated ${memes.length} memes`)
