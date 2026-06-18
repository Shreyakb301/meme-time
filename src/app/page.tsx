'use client'

import SmoothScroll from '@/lib/SmoothScroll'
import NoiseOverlay from '@/components/fx/NoiseOverlay'
import { Wordmark, DepthRail } from '@/components/chrome/Chrome'
import { ArtifactModalProvider } from '@/components/ui/ArtifactModal'
import Scene1 from '@/scenes/Scene1'
import Scene2 from '@/scenes/Scene2'
import Scene3 from '@/scenes/Scene3'
import Scene4 from '@/scenes/Scene4'
import Scene5 from '@/scenes/Scene5'
import Scene6 from '@/scenes/Scene6'
import Scene7 from '@/scenes/Scene7'
import Scene8 from '@/scenes/Scene8'
import Scene9 from '@/scenes/Scene9'
import Scene10 from '@/scenes/Scene10'
import Scene11 from '@/scenes/Scene11'
import Scene12 from '@/scenes/Scene12'

/**
 * The full dig, top to bottom: platform → halls → chambers →
 * laboratories → graveyard → skyline. Chrome (wordmark, depth
 * gauge, grain) persists across every room; clicking any exhibit
 * anywhere opens the examination modal.
 */
export default function Page() {
  return (
    <SmoothScroll>
      <ArtifactModalProvider>
        <Wordmark />
        <DepthRail />
        <main>
          <Scene1 />
          <Scene2 />
          <Scene3 />
          <Scene4 />
          <Scene5 />
          <Scene6 />
          <Scene7 />
          <Scene8 />
          <Scene9 />
          <Scene10 />
          <Scene11 />
          <Scene12 />
        </main>
        <NoiseOverlay />
      </ArtifactModalProvider>
    </SmoothScroll>
  )
}
