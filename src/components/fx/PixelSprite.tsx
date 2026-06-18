import type { CSSProperties } from 'react'

/**
 * PixelSprite — a hand-drawn pixel artifact rendered from a text
 * grid via box-shadow, animated like a primitive 2-frame GIF.
 * No image assets: the crudeness is the point.
 *
 * Note: the opacity-flip keyframes assume exactly 2 frames.
 */
export default function PixelSprite({
  frames,
  palette,
  px = 10,
  fps = 2,
  label,
  className = '',
  style,
}: {
  frames: string[][]
  palette: Record<string, string>
  px?: number
  fps?: number
  label?: string
  className?: string
  style?: CSSProperties
}) {
  const rows = frames[0].length
  const cols = frames[0][0].length
  const dur = frames.length / fps

  return (
    <div
      className={`px-sprite ${className}`}
      role="img"
      aria-label={label}
      style={
        { width: cols * px, height: rows * px, '--px-dur': `${dur}s`, ...style } as CSSProperties
      }
    >
      {frames.map((frame, i) => {
        const shadow: string[] = []
        frame.forEach((row, r) => {
          ;[...row].forEach((ch, c) => {
            const color = palette[ch]
            if (color) shadow.push(`${c * px}px ${r * px}px 0 0 ${color}`)
          })
        })
        return (
          <i
            key={i}
            className="px-sprite__frame"
            style={{
              width: px,
              height: px,
              boxShadow: shadow.join(', '),
              animationDelay: `${(-dur * (frames.length - i)) / frames.length}s`,
            }}
          />
        )
      })}
    </div>
  )
}
