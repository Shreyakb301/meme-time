# MEMETIME

**The Visual History of Internet Culture** — an interactive museum exhibit, not a website.
A Smithsonian for the online age: the visitor descends through strata of internet history,
1996 → today, walking through one environment per era.

```bash
npm install
npm run dev   # http://localhost:3000
```

**Stack:** Next.js · React · TypeScript · Tailwind · Framer Motion · Lenis ·
GSAP ScrollTrigger / React Flow / Three.js (reserved for the lab, simulator, monument and
skyline scenes).

## Design philosophy

Environments, not pages. Every scene is a **room** the visitor walks through: it owns its
own lighting, its own atmosphere, its own motion language. No cards, no glass panels, no
centered marketing sections, no dashboards.

- **Dark internet archaeology** — depth = time; the visitor digs.
- **Museum lighting** — light shafts, floor pools, dust in the beam, darkness at the edges.
- **Documentary texture** — film grain, mono field notes, engraved plaques.
- **ADHD-friendly motion** — something moves every few seconds; micro-feedback ≤250 ms;
  `prefers-reduced-motion` strips ambience while keeping the story intact.

## Data system

`/data/memes.json` is the primary source: a curated archive of ~36 memes with origin year,
peak year, platform, status (extinct / dormant / active / immortal), genealogy links and
popularity curves. `src/lib/memes.ts` provides typed access (`getMeme`, `memesInEra`,
`popularityAt`). APIs (`src/lib/enrich.ts`: Wikimedia, Giphy) only ever *enrich* and fail
soft to null — **the museum works fully offline.**

## Architecture

```
data/memes.json             ← the curated archive (primary source of truth)
src/
  app/                      ← Next.js app router: layout (fonts, metadata), page (the dig)
  styles/                   ← tokens.css (design tokens + era moods), base, components
  lib/                      ← memes.ts, enrich.ts, motion.ts (presets), SmoothScroll (Lenis)
  components/
    layout/                 ← Environment, PinnedSequence, Corridor, ParallaxLayer
    fx/                     ← Lighting, Surfaces, DustField, PixelSprite, NoiseOverlay
    ui/                     ← Plaque, FieldNote (the only "containers" — wall labels)
    chrome/                 ← Wordmark + DepthRail, fixed over every hall
  scenes/                   ← one environment per scene + its stylesheet
```

## The journey (all 12 scenes built)

| # | Scene |
| - | ----- |
| 1 | **The Platform** — 3D rail track into history, years engraved 1996→2026, MEMETIME station sign |
| 2 | **Hall I · The Early Internet** 1996–2004 — Dancing Baby vitrine, GeoCities sediment, Hampster Dance, All Your Base |
| 3 | **Hall II · The Social Web** 2005–2009 — growing network lines, Rickroll, LOLcats, Keyboard Cat, Leeroy, Tom |
| 4 | **Hall III · The Meme Boom** 2010–2014 — Nyan rainbow transit, Trollface glitch, 12s Harlem quake, celestial Doge |
| 5 | **The Doge Chamber** — drag-to-rotate cathedral, orbiting liturgy, hover inscriptions |
| 6 | **Meme Evolution Lab** — React Flow genealogy derived from `relatedMemes`, pan/zoom/inspect |
| 7 | **Viral Spread Simulator** — platform islands, RELEASE MEME, BFS outbreak waves, reach readout |
| 8 | **Popularity Landscape** — memes as mountains, 1996→2026 year instrument, peaks rise/fade/glow |
| 9 | **Hall IV · Memes Become Language** 2015–2019 — comic remix machine: original → variation → corporate → dead |
| 10 | **Hall V · The Fast Internet** 2020–2026 — three auto-scrolling vertical feeds, scan beam, deliberate overload |
| 11 | **The Meme Graveyard** — glowing gravestones, pixel sand, ghosts rising on their own schedule |
| 12 | **Internet Culture Skyline** — every meme a building (height = peak score), districts, landmarks, finale |

Clicking any exhibit anywhere opens the **examination modal** (`ArtifactModal`): provenance,
description, status, references, plus a Wikipedia summary fetched as soft-fail enrichment
("consulting the archive…"). `node scripts/fetch-artifacts.mjs` re-downloads artifact images
into `/public/memes/<id>/original.*`.

## Era moods

Each room declares `data-mood` and the entire subtree retints through `--era-accent`:
plaques, lighting, dust, grid lines, glows, selection.

| Mood     | Accent    | Register                       |
| -------- | --------- | ------------------------------ |
| `lime`   | `#D7FF3F` | present-day, the dig itself    |
| `violet` | `#9F7AEA` | social web, held chambers      |
| `cyan`   | `#00E5FF` | early-web / CRT strata         |
| `pink`   | `#FF4D8D` | chaotic, high-energy strata    |

One mood per room. Never mixed.

## 3D note

Scene 1's track and year slabs depend on an unbroken `preserve-3d` chain — never add
`mask`, `filter`, or `overflow` to `.s1-world`, `.s1-track`, or `.s1-years`; fades are done
with gradients on leaf elements instead.
