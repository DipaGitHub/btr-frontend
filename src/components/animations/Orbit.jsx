import { Logo } from '../shared/SiteComponents'

// Outer orbit ring nodes - coloured pill badges
const OUTER_NODES = [
  { label: 'API', bg: '#2d0e2a', border: '#c840b8', color: '#ff92ec' },
  { label: 'AI/ML', bg: '#1e1240', border: '#8860d8', color: '#c8a8ff' },
  { label: 'Code', bg: '#0a2238', border: '#0892c4', color: '#3dd4ff' },
  { label: 'DNS', bg: '#0b2a26', border: '#29b09b', color: '#5ae8cc' },
  { label: 'Database', bg: '#082550', border: '#1478d8', color: '#5ab8ff' },
  { label: 'Cloud', bg: '#301808', border: '#c46c18', color: '#ffad4a' },
  { label: 'Shopping', bg: '#281808', border: '#d4941a', color: '#ffc84a' },
  { label: 'ERP', bg: '#400c0a', border: '#e02420', color: '#ff7470' },
]

// Inner orbit ring nodes
const INNER_NODES = [
  { label: 'UI/UX', bg: '#160e2a', border: '#7040b0', color: '#c090ff' },
  { label: 'SEO', bg: '#0c1e14', border: '#22904c', color: '#50e890' },
  { label: 'Mobile', bg: '#280e0e', border: '#b83030', color: '#ff7070' },
  { label: 'Brand', bg: '#261a06', border: '#a07018', color: '#f0b840' },
]

/**
 * Compute (x, y) percentage positions on a circle.
 * radiusFactor is in percentage units relative to the container (0-50).
 */
function ringPositions(count, radiusFactor) {
  return Array.from({ length: count }, (_, i) => {
    const angle = ((360 / count) * i - 90) * (Math.PI / 180)
    return {
      x: 50 + radiusFactor * Math.cos(angle),
      y: 50 + radiusFactor * Math.sin(angle),
    }
  })
}

/**
 * Orbital animation system:
 *  - Outer ring spins CW at 22s; nodes counter-rotate to stay upright
 *  - Inner ring spins CCW at 34s; nodes counter-rotate (CW) to stay upright
 *  - Central BTR logo is static
 */
export function OrbitSystem() {
  const outerPos = ringPositions(OUTER_NODES.length, 44)
  const innerPos = ringPositions(INNER_NODES.length, 24)

  return (
    <div className="orbit-art">
      {/* Decorative concentric rings */}
      <div className="orbit-deco orbit-deco-border" />
      <div className="orbit-deco orbit-deco-mid" />
      <div className="orbit-deco orbit-deco-core" />

      {/* Outer CW spinning ring */}
      <div className="orbit-spinner orbit-spin-cw">
        {OUTER_NODES.map((node, i) => (
          <div
            key={node.label}
            className="orbit-node-wrap orbit-counter-cw"
            style={{ left: `${outerPos[i].x}%`, top: `${outerPos[i].y}%` }}
          >
            <span
              className="orbit-badge"
              style={{ background: node.bg, border: `1px solid ${node.border}`, color: node.color }}
            >
              {node.label}
            </span>
          </div>
        ))}
      </div>

      {/* Inner CCW spinning ring */}
      <div className="orbit-spinner orbit-spin-ccw">
        {INNER_NODES.map((node, i) => (
          <div
            key={node.label}
            className="orbit-node-wrap orbit-counter-ccw"
            style={{ left: `${innerPos[i].x}%`, top: `${innerPos[i].y}%` }}
          >
            <span
              className="orbit-badge orbit-badge-sm"
              style={{ background: node.bg, border: `1px solid ${node.border}`, color: node.color }}
            >
              {node.label}
            </span>
          </div>
        ))}
      </div>

      {/* Central BTR logo */}
      <div className="orbit-center">
        <Logo light />
      </div>

      {/* Ambient glow */}
      <div className="orbit-glow" />
    </div>
  )
}
