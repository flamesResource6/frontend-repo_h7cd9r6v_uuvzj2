import { useEffect, useMemo, useRef } from 'react'
import Spline from '@splinetool/react-spline'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'

const lines = [
  "We Engineer",
  "Attention,",
  "Emotion,",
  "Action.",
]

function useTicker(messages, interval = 2600) {
  const indexRef = useRef(0)
  const subscribers = useRef(new Set())
  useEffect(() => {
    const id = setInterval(() => {
      indexRef.current = (indexRef.current + 1) % messages.length
      subscribers.current.forEach(fn => fn(indexRef.current))
    }, interval)
    return () => clearInterval(id)
  }, [messages, interval])
  return {
    subscribe: (fn) => {
      subscribers.current.add(fn)
      return () => subscribers.current.delete(fn)
    },
    get: () => indexRef.current,
  }
}

export default function Hero() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start','end start'] })

  // Scroll transforms
  const neuralScale = useTransform(scrollYProgress, [0, 1], [1, 0.7])
  const neuralY = useTransform(scrollYProgress, [0, 1], [0, -150])
  const headlineScale = useTransform(scrollYProgress, [0, 1], [1, 0.85])
  const headlineOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.3])

  const tickerItems = useMemo(() => ([
    'Currently accepting 3 clients this quarter',
    '127% average conversion lift',
    '50+ brands transformed',
  ]), [])

  // Ticker state via custom pub/sub to avoid re-render cost
  const ticker = useTicker(tickerItems)
  const tickIndexRef = useRef(0)
  const [, force] = useState(0)
  useEffect(() => ticker.subscribe((i) => { tickIndexRef.current = i; force(x => x ^ 1) }), [])

  return (
    <section ref={containerRef} className="relative h-[120vh] md:h-[140vh] bg-[#1A1A1A] overflow-hidden">
      {/* Fluid background */}
      <div className="absolute inset-0"><FluidBackground /></div>

      {/* Spline 3D element on the right side */}
      <motion.div
        style={{ scale: neuralScale, y: neuralY }}
        className="absolute right-0 top-0 h-full w-[60%] md:w-[62%] lg:w-[60%]"
      >
        <Spline scene="https://prod.spline.design/Gt5HUob8aGDxOUep/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </motion.div>

      {/* Dark gradient overlay to blend with background, pointer-events-none per Spline note */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-[#1A1A1A] via-transparent to-transparent" />

      {/* Content left */}
      <div className="relative h-screen max-w-[1200px] mx-auto px-6 sm:px-10">
        <motion.div
          style={{ scale: headlineScale, opacity: headlineOpacity }}
          className="absolute left-0 md:left-[5%] top-1/2 -translate-y-1/2 w-[85%] md:w-[45%]"
        >
          <h1 className="text-[44px] sm:text-[56px] lg:text-[64px] text-[#FAFAFA] tracking-[-0.02em] leading-[1.1] font-[\'Playfair Display\',serif]">
            {lines.map((l, i) => (
              <motion.span
                key={i}
                className="block"
                initial={{ opacity: 0, filter: 'blur(8px)', y: 8 }}
                animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                transition={{ duration: 0.9, delay: i * 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                {l}
              </motion.span>
            ))}
          </h1>

          <motion.p
            className="mt-6 text-[18px] leading-[1.6] text-[#999999] w-[60%]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: lines.length * 0.8 + 1.2, duration: 0.8 }}
          >
            Psychology-driven design for brands that demand measurable results.
          </motion.p>

          {/* Data ticker */}
          <div className="mt-10 text-[14px] font-mono" style={{ fontFamily: "'Space Mono', monospace" }}>
            <AnimatePresence mode="popLayout">
              <motion.div
                key={tickIndexRef.current}
                className="text-[#2C5F4D]"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.4 }}
              >
                {tickerItems[tickIndexRef.current]}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* CTA */}
          <motion.a
            href="#framework"
            className="inline-block mt-14 bg-[#2C5F4D] text-white text-[16px] font-medium px-9 py-[18px] rounded-[4px] shadow-[0_8px_24px_rgba(44,95,77,0.3)] hover:-translate-y-1 transition-all duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: lines.length * 0.8 + 1.8, duration: 0.6 }}
          >
            Explore The Framework →
          </motion.a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <ScrollIndicator />
    </section>
  )
}

function ScrollIndicator() {
  const [hide, setHide] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setHide(true), 3000)
    const onScroll = () => setHide(true)
    window.addEventListener('scroll', onScroll, { once: true })
    return () => { clearTimeout(t); window.removeEventListener('scroll', onScroll) }
  }, [])

  return (
    <AnimatePresence>
      {!hide && (
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 bottom-10 flex flex-col items-center text-[#2C5F4D]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="h-[60px] w-px bg-[#2C5F4D]/70" />
          <motion.div
            className="w-2 h-2 rounded-full bg-[#2C5F4D] mt-1"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          />
          <div className="mt-3 text-xs tracking-wide text-[#2C5F4D]">Scroll to see psychology in action</div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Local import to avoid circulars
import FluidBackground from './FluidBackground'
import { useState } from 'react'
