'use client'

import { useEffect, useRef } from 'react'

interface Mote {
  x: number
  y: number
  r: number
  vx: number
  vy: number
  a: number
  phase: number
}

/**
 * DustField — fine motes drifting through the room's light, like
 * particles caught in a projector beam. Canvas-based, tinted by
 * the environment's --era-accent, paused when offscreen, skipped
 * entirely under prefers-reduced-motion. `pixel` renders square
 * motes for the older strata.
 */
export default function DustField({
  density = 70,
  drift = 0.18,
  pixel = false,
}: {
  density?: number
  drift?: number
  pixel?: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let frame: number | null = null
    let motes: Mote[] = []

    const tint = () =>
      (canvas.parentElement &&
        getComputedStyle(canvas.parentElement).getPropertyValue('--era-accent').trim()) ||
      '#d7ff3f'

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2)
      canvas.width = canvas.offsetWidth * dpr
      canvas.height = canvas.offsetHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      motes = Array.from({ length: density }, () => ({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        r: 0.4 + Math.random() * 1.4,
        vx: (Math.random() - 0.5) * drift,
        vy: -drift * (0.3 + Math.random() * 0.7),
        a: 0.08 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2,
      }))
    }

    const tick = (t: number) => {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = tint()
      for (const m of motes) {
        m.x += m.vx + Math.sin(t / 2400 + m.phase) * 0.08
        m.y += m.vy
        if (m.y < -4) {
          m.y = h + 4
          m.x = Math.random() * w
        }
        if (m.x < -4) m.x = w + 4
        if (m.x > w + 4) m.x = -4
        ctx.globalAlpha = m.a * (0.7 + 0.3 * Math.sin(t / 1600 + m.phase))
        if (pixel) {
          ctx.fillRect(m.x, m.y, m.r * 2.2, m.r * 2.2)
        } else {
          ctx.beginPath()
          ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      ctx.globalAlpha = 1
      frame = requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        frame = requestAnimationFrame(tick)
      } else if (frame) {
        cancelAnimationFrame(frame)
        frame = null
      }
    })

    resize()
    window.addEventListener('resize', resize)
    observer.observe(canvas)

    return () => {
      window.removeEventListener('resize', resize)
      observer.disconnect()
      if (frame) cancelAnimationFrame(frame)
    }
  }, [density, drift, pixel])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      aria-hidden="true"
    />
  )
}
