import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const PHRASES = [
  'ideas into impact.',
  'visions to reality.',
  'digital into growth.',
]

/**
 * Hero headline with animated rotating phrase.
 * Static prefix + animated em portion cycles every 3.5s.
 */
export function HeroHeadline() {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % PHRASES.length), 3500)
    return () => clearInterval(id)
  }, [])

  return (
    <h1>
      Helping businesses turn{' '}
      <span className="hero-phrase-wrap">
        <AnimatePresence mode="wait" initial={false}>
          <motion.em
            key={idx}
            initial={{ opacity: 0, y: 28, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -22, filter: 'blur(4px)' }}
            transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: 'block' }}
          >
            {PHRASES[idx]}
          </motion.em>
        </AnimatePresence>
      </span>
    </h1>
  )
}
