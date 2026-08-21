import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const variants = {
  up:    { hidden: { opacity: 0, y: 36 },   visible: { opacity: 1, y: 0 } },
  down:  { hidden: { opacity: 0, y: -30 },  visible: { opacity: 1, y: 0 } },
  left:  { hidden: { opacity: 0, x: -40 },  visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 40 },   visible: { opacity: 1, x: 0 } },
  fade:  { hidden: { opacity: 0 },           visible: { opacity: 1 } },
  zoom:  { hidden: { opacity: 0, scale: 0.85 }, visible: { opacity: 1, scale: 1 } },
}

export function Reveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.55,
  className,
  style,
  as: Tag = 'div',
  ...rest
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px 0px' })
  const chosen = variants[direction] || variants.up

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={chosen}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
