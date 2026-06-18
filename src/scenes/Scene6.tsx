'use client'

import { useMemo } from 'react'
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  Position,
  type Node,
  type Edge,
  type NodeTypes,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import DustField from '@/components/fx/DustField'
import { Vignette } from '@/components/fx/Lighting'
import { Plaque, FieldNote } from '@/components/ui/Plaque'
import ArtifactImage from '@/components/fx/ArtifactImage'
import { useArtifact } from '@/components/ui/ArtifactModal'
import { getMeme, type Meme } from '@/lib/memes'

/**
 * SCENE 6 — MEME EVOLUTION LAB.
 * Internet DNA on a zoomable bench. Genealogy is derived from
 * relatedMemes in the dataset — nothing is hardcoded except the
 * specimen positions on the slide.
 */

const SPECIMENS: Array<{ id: string; x: number; y: number }> = [
  { id: 'lolcats', x: 40, y: 40 },
  { id: 'grumpy-cat', x: 0, y: 280 },
  { id: 'doge', x: 420, y: 80 },
  { id: 'cheems', x: 260, y: 360 },
  { id: 'swole-doge', x: 480, y: 400 },
  { id: 'dogecoin', x: 700, y: 330 },
  { id: 'nyan-cat', x: 680, y: 60 },
  { id: 'pepe', x: 1000, y: 60 },
  { id: 'rare-pepe', x: 900, y: 360 },
  { id: 'wojak', x: 1160, y: 320 },
  { id: 'npc-wojak', x: 1160, y: 560 },
  { id: 'rage-comics', x: 1420, y: 80 },
  { id: 'forever-alone', x: 1450, y: 340 },
  { id: 'trollface', x: 1650, y: 200 },
]

function MemeNode({ data }: { data: { meme: Meme } }) {
  const { meme } = data
  return (
    <div className="s6-node">
      <Handle type="target" position={Position.Top} className="s6-handle" />
      <ArtifactImage
        src={meme.asset.localImage}
        apiQuery={meme.asset.giphySearchTerm}
        alt={meme.name}
        className="s6-node__img"
        fallback={<span className="s6-node__noimg">?</span>}
      />
      <span className="s6-node__name">{meme.name}</span>
      <span className="s6-node__year">{meme.createdYear}</span>
      <Handle type="source" position={Position.Bottom} className="s6-handle" />
    </div>
  )
}

const nodeTypes = { meme: MemeNode } as unknown as NodeTypes

export default function Scene6() {
  const { open } = useArtifact()

  const { nodes, edges } = useMemo(() => {
    const ids = new Set(SPECIMENS.map((s) => s.id))
    const nodes: Node[] = SPECIMENS.flatMap((s) => {
      const meme = getMeme(s.id)
      if (!meme) return []
      return [{ id: s.id, type: 'meme', position: { x: s.x, y: s.y }, data: { meme } }]
    })
    const seen = new Set<string>()
    const edges: Edge[] = []
    for (const s of SPECIMENS) {
      const meme = getMeme(s.id)
      for (const rel of meme?.relatedMemes ?? []) {
        if (!ids.has(rel)) continue
        const key = [s.id, rel].sort().join('~')
        if (seen.has(key)) continue
        seen.add(key)
        // older meme is the ancestor
        const [a, b] =
          (getMeme(s.id)?.createdYear ?? 0) <= (getMeme(rel)?.createdYear ?? 0)
            ? [s.id, rel]
            : [rel, s.id]
        edges.push({ id: key, source: a, target: b, animated: true, className: 's6-edge' })
      }
    }
    return { nodes, edges }
  }, [])

  return (
    <section className="env s6-lab" data-mood="lime">
      <div className="s6-canvas">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.25 }}
          minZoom={0.3}
          maxZoom={1.8}
          zoomOnScroll={false}
          zoomOnPinch
          panOnDrag
          preventScrolling={false}
          nodesDraggable={false}
          nodesConnectable={false}
          proOptions={{ hideAttribution: true }}
          onNodeClick={(_, node) => open(node.id)}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={28}
            size={1.2}
            color="rgba(215,255,63,0.16)"
          />
          <Controls showInteractive={false} className="s6-controls" />
        </ReactFlow>
      </div>

      <Plaque className="s6-plaque" id="laboratory / internet dna" title="Meme Evolution Lab">
        Every meme descends from another. Pan the slide, zoom with the bench controls, and
        click a specimen to read its genome.
      </Plaque>
      <FieldNote className="s6-note">drag to pan · click a node to inspect</FieldNote>

      <DustField density={50} drift={0.08} />
      <Vignette />
    </section>
  )
}
