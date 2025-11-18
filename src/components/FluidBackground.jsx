import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

// Organic gradient mesh with subtle morphing + grain overlay
export default function FluidBackground() {
  const canvasRef = useRef(null)
  const { scrollYProgress } = useScroll()
  const hueShift = useTransform(scrollYProgress, [0, 1], [0, 25])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf

    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    function resize() {
      const { innerWidth: w, innerHeight: h } = window
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    window.addEventListener('resize', resize)

    // control points for radial gradients
    const points = Array.from({ length: 4 }).map(() => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() * 0.4 - 0.2) * 0.001,
      vy: (Math.random() * 0.4 - 0.2) * 0.001,
      r: 220 + Math.random() * 180,
    }))

    let t = 0

    function draw() {
      t += 1 / 60
      const w = canvas.width / dpr
      const h = canvas.height / dpr

      // background charcoal
      ctx.fillStyle = '#1A1A1A'
      ctx.fillRect(0, 0, w, h)

      // morph points
      for (const p of points) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > 1) p.vx *= -1
        if (p.y < 0 || p.y > 1) p.vy *= -1
      }

      // gradient mesh
      const gradients = [
        { color: 'rgba(44,95,77,0.38)', px: points[0] }, // hunter green soft
        { color: 'rgba(34,34,34,0.6)', px: points[1] },
        { color: 'rgba(26,26,26,0.7)', px: points[2] },
        { color: 'rgba(80,120,105,0.18)', px: points[3] },
      ]

      for (const g of gradients) {
        const cx = g.px.x * w
        const cy = g.px.y * h
        const r = g.px.r
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
        grad.addColorStop(0, g.color)
        grad.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.rect(0, 0, w, h)
        ctx.fill()
      }

      // subtle vignette
      const vg = ctx.createRadialGradient(w * 0.5, h * 0.6, 0, w * 0.5, h * 0.6, Math.max(w, h) * 0.8)
      vg.addColorStop(0, 'rgba(0,0,0,0)')
      vg.addColorStop(1, 'rgba(0,0,0,0.45)')
      ctx.fillStyle = vg
      ctx.fillRect(0, 0, w, h)

      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <motion.div
      aria-hidden
      className="absolute inset-0 overflow-hidden"
      style={{ filter: hueShift.to(h => `hue-rotate(${h}deg)`) }}
    >
      <canvas ref={canvasRef} className="w-full h-full" />
      {/* Grain overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-5 mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml;utf8,\
        <svg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' viewBox=\'0 0 100 100\'>\
          <filter id=\'n\'>\
            <feTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'2\' stitchTiles=\'stitch\'/>\
            <feColorMatrix type=\'saturate\' values=\'0\'/>\
          </filter>\
          <rect width=\'100%\' height=\'100%\' filter=\'url(%23n)\' opacity=\'0.3\'/>\
        </svg>\n")' }} />
    </motion.div>
  )
}
