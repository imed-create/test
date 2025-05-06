"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"

export const Preloader = () => {
  const [isLoading, setIsLoading] = useState(true)
  const preloaderRef = useRef<HTMLDivElement>(null)
  const lightningRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const thunderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!preloaderRef.current || !lightningRef.current || !progressRef.current) return

    // Create thunder effect
    const createThunder = () => {
      if (!thunderRef.current) return
      thunderRef.current.style.opacity = "1"
      gsap.to(thunderRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
      })
    }

    // Create lightning effect
    const createLightning = () => {
      const lightning = document.createElement("div")
      lightning.className = "lightning"
      
      // Random position
      const x = Math.random() * window.innerWidth
      const y = Math.random() * window.innerHeight
      lightning.style.left = `${x}px`
      lightning.style.top = `${y}px`
      
      // Random angle and scale
      const angle = Math.random() * 360
      const scale = Math.random() * 2 + 1
      lightning.style.transform = `rotate(${angle}deg) scale(${scale})`
      
      lightningRef.current?.appendChild(lightning)
      
      // Animate lightning
      gsap.to(lightning, {
        scale: scale * 1.5,
        opacity: 0,
        duration: 0.3,
        ease: "power2.out",
        onComplete: () => {
          lightning.remove()
          if (Math.random() < 0.3) {
            createThunder()
          }
        },
      })
    }

    // Simulate loading progress
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 10
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        setTimeout(() => {
          gsap.to(preloaderRef.current, {
            opacity: 0,
            duration: 1,
            ease: "power2.inOut",
            onComplete: () => setIsLoading(false),
          })
        }, 500)
      }
      gsap.to(progressRef.current, {
        width: `${progress}%`,
        duration: 0.5,
        ease: "power2.out",
      })
    }, 200)

    // Create periodic lightning
    const createPeriodicLightning = () => {
      createLightning()
      setTimeout(createPeriodicLightning, Math.random() * 500 + 200)
    }

    createPeriodicLightning()

    return () => {
      clearInterval(interval)
    }
  }, [])

  if (!isLoading) return null

  return (
    <div
      ref={preloaderRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
    >
      <div
        ref={lightningRef}
        className="absolute inset-0"
      />
      <div
        ref={thunderRef}
        className="absolute inset-0 bg-white opacity-0"
      />
      <div className="relative z-10 flex flex-col items-center gap-8">
        <div className="text-4xl font-bold text-electric-blue animate-pulse">
          Loading...
        </div>
        <div className="w-64 h-2 bg-gray-800/50 rounded-full overflow-hidden backdrop-blur-sm">
          <div
            ref={progressRef}
            className="h-full bg-gradient-to-r from-electric-blue to-cyan-400 transition-all duration-300"
            style={{ width: "0%" }}
          />
        </div>
      </div>

      <style jsx>{`
        .lightning {
          position: absolute;
          width: 6px;
          height: 200px;
          background: linear-gradient(
            to bottom,
            transparent,
            #00ff9d,
            #00bfff,
            transparent
          );
          filter: blur(3px);
          opacity: 0.9;
          transform-origin: center;
          pointer-events: none;
          box-shadow: 0 0 20px #00ff9d;
        }
      `}</style>
    </div>
  )
}
