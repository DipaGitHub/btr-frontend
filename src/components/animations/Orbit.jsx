import { Logo } from '../shared/SiteComponents'
import { 
  Code, Terminal, Database, Cloud, Cpu, Globe, Monitor, 
  Smartphone, Layout, Server, PenTool, ShoppingCart
} from 'lucide-react'
import { FaPython, FaNodeJs, FaHtml5, FaCss3Alt, FaReact, FaJava } from 'react-icons/fa'

// Outer orbit ring - tech icons with their glow colors
const OUTER_NODES = [
  { Icon: FaPython, color: '#3776AB', glow: 'rgba(55, 118, 171, 0.5)', label: 'Python' },
  { Icon: Globe, color: '#c8a8ff', glow: 'rgba(200, 168, 255, 0.5)', label: 'Web' },
  { Icon: Code, color: '#3dd4ff', glow: 'rgba(61, 212, 255, 0.5)', label: 'Code' },
  { Icon: Database, color: '#5ae8cc', glow: 'rgba(90, 232, 204, 0.5)', label: 'Database' },
  { Icon: FaNodeJs, color: '#68A063', glow: 'rgba(104, 160, 99, 0.5)', label: 'Node.js' },
  { Icon: Cloud, color: '#ffad4a', glow: 'rgba(255, 173, 74, 0.5)', label: 'Cloud' },
  { Icon: ShoppingCart, color: '#ffc84a', glow: 'rgba(255, 200, 74, 0.5)', label: 'Commerce' },
  { Icon: Cpu, color: '#ff7470', glow: 'rgba(255, 116, 112, 0.5)', label: 'Hardware' },
]

// Inner orbit ring - tech icons
const INNER_NODES = [
  { Icon: Layout, color: '#c090ff', glow: 'rgba(192, 144, 255, 0.5)', label: 'UI/UX' },
  { Icon: FaReact, color: '#61DAFB', glow: 'rgba(97, 218, 251, 0.5)', label: 'React' },
  { Icon: Smartphone, color: '#ff7070', glow: 'rgba(255, 112, 112, 0.5)', label: 'Mobile' },
  { Icon: PenTool, color: '#f0b840', glow: 'rgba(240, 184, 64, 0.5)', label: 'Design' },
]

/**
 * Compute (x, y) percentage positions on a circle.
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
 * Orbital animation system with tech icons as orbiting planets
 */
export function OrbitSystem() {
  const outerPos = ringPositions(OUTER_NODES.length, 50)
  const innerPos = ringPositions(INNER_NODES.length, 26)

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
            key={`outer-${i}`}
            className="orbit-node-wrap orbit-counter-cw"
            style={{ left: `${outerPos[i].x}%`, top: `${outerPos[i].y}%` }}
          >
            <div 
              className="orbit-icon-bubble"
              style={{ 
                border: `1.5px solid ${node.color}`,
                boxShadow: `0 0 12px ${node.glow}`,
              }}
            >
              <node.Icon size={16} color={node.color} />
            </div>
            <span className="orbit-icon-label" style={{ color: node.color, textShadow: `0 0 8px ${node.glow}` }}>
              {node.label}
            </span>
          </div>
        ))}
      </div>

      {/* Inner CCW spinning ring */}
      <div className="orbit-spinner orbit-spin-ccw">
        {INNER_NODES.map((node, i) => (
          <div
            key={`inner-${i}`}
            className="orbit-node-wrap orbit-counter-ccw"
            style={{ left: `${innerPos[i].x}%`, top: `${innerPos[i].y}%` }}
          >
            <div 
              className="orbit-icon-bubble"
              style={{ 
                border: `1.5px solid ${node.color}`,
                boxShadow: `0 0 12px ${node.glow}`,
              }}
            >
              <node.Icon size={16} color={node.color} />
            </div>
            <span className="orbit-icon-label" style={{ color: node.color, textShadow: `0 0 8px ${node.glow}` }}>
              {node.label}
            </span>
          </div>
        ))}
      </div>

      {/* Central BTR logo */}
      <div className="orbit-center">
        <Logo className="header-logo" />
      </div>

      {/* Ambient glow */}
      <div className="orbit-glow" />
    </div>
  )
}
