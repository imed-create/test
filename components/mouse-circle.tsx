"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

export const MouseCircle = () => {
  const circleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!circleRef.current) return

    const circle = circleRef.current
    let mouseX = 0
    let mouseY = 0
    let circleX = 0
    let circleY = 0

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    window.addEventListener("mousemove", handleMouseMove)

    // Smooth follow animation
    gsap.ticker.add(() => {
      // Calculate distance between mouse and circle
      const dx = mouseX - circleX
      const dy = mouseY - circleY

      // Update circle position with smooth easing
      circleX += dx * 0.1
      circleY += dy * 0.1

      // Apply the new position
      gsap.set(circle, {
        x: circleX - circle.offsetWidth / 2,
        y: circleY - circle.offsetHeight / 2,
      })
    })

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      gsap.ticker.removeAll()
    }
  }, [])

  return (
    <div
      ref={circleRef}
      className="fixed pointer-events-none z-50 mix-blend-screen"
      style={{
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,191,255,0.2) 0%, rgba(0,191,255,0.1) 50%, transparent 70%)",
        boxShadow: "0 0 20px #00bfff, 0 0 40px #00bfff",
        transform: "translate(-50%, -50%)",
      }}
    />
  )
} 