"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

export const ThunderstormBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Create lightning bolt
    const createLightningBolt = (startX: number, startY: number, endX: number, endY: number) => {
      const points: { x: number; y: number }[] = []
      const segments = 15 // More segments for more detailed lightning
      const deviation = 80 // More deviation for more dramatic effect

      points.push({ x: startX, y: startY })

      for (let i = 1; i < segments; i++) {
        const t = i / segments
        const x = startX + (endX - startX) * t
        const y = startY + (endY - startY) * t
        points.push({
          x: x + (Math.random() - 0.5) * deviation,
          y: y + (Math.random() - 0.5) * deviation
        })
      }

      points.push({ x: endX, y: endY })

      // Draw main lightning
      ctx.beginPath()
      ctx.moveTo(points[0].x, points[0].y)
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y)
      }

      // Lightning style - neon blue
      ctx.strokeStyle = "#00bfff"
      ctx.lineWidth = 3
      ctx.shadowColor = "#00bfff"
      ctx.shadowBlur = 30
      ctx.stroke()

      // Draw secondary lightning (branches)
      for (let i = 0; i < 3; i++) {
        const branchStart = points[Math.floor(Math.random() * points.length)]
        const branchEnd = {
          x: branchStart.x + (Math.random() - 0.5) * 100,
          y: branchStart.y + Math.random() * 100
        }

        ctx.beginPath()
        ctx.moveTo(branchStart.x, branchStart.y)
        ctx.lineTo(branchEnd.x, branchEnd.y)
        ctx.strokeStyle = "#00bfff"
        ctx.lineWidth = 1.5
        ctx.shadowBlur = 20
        ctx.stroke()
      }

      // Flash effect
      ctx.fillStyle = "rgba(0, 191, 255, 0.15)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Fade out
      gsap.to(ctx, {
        shadowBlur: 0,
        duration: 0.4,
        ease: "power2.out"
      })
    }

    // Create random lightning
    const createRandomLightning = () => {
      const startX = Math.random() * canvas.width
      const startY = 0
      const endX = startX + (Math.random() - 0.5) * 300 // Wider spread
      const endY = canvas.height
      createLightningBolt(startX, startY, endX, endY)
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Random lightning with increased frequency
      if (Math.random() < 0.03) { // Increased chance of lightning
        createRandomLightning()
      }

      requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ 
          mixBlendMode: "screen"
        }}
      />
    </div>
  )
} 