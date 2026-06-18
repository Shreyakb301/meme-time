/**
 * NoiseOverlay — fixed film grain across the whole experience.
 * Documentary texture; mount once at the app root.
 */
export default function NoiseOverlay() {
  return (
    <svg className="noise" aria-hidden="true">
      <filter id="memetime-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#memetime-grain)" />
    </svg>
  )
}
