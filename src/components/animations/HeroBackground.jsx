import { useMemo } from 'react'

const DOM_PARTICLE_COUNT = 22

export function HeroBackground() {
  const particles = useMemo(
    () =>
      Array.from({ length: DOM_PARTICLE_COUNT }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 2 + Math.random() * 3,
        duration: 14 + Math.random() * 16,
        delay: -Math.random() * 20,
      })),
    []
  )

  return (
    <div className="hero-cinematic-bg" aria-hidden="true">
      <div className="hero-bg-gradient" />
      <div className="hero-bg-blob blob-a" />
      <div className="hero-bg-blob blob-b" />
      <div className="hero-bg-blob blob-c" />
      <div className="hero-bg-grid" />
      <div className="hero-bg-noise" />
      <div className="hero-bg-rays" />
      <div className="hero-dom-particles">
        {particles.map(p => (
          <span
            key={p.id}
            className="hero-dom-particle"
            style={{
              left: `${p.left}%`,
              bottom: '-10px',
              width: p.size,
              height: p.size,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
