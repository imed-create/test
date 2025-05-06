"use client"

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export const ElectricEffects = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const lightningRef = useRef<HTMLDivElement>(null)
  const backgroundRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (!containerRef.current || !lightningRef.current) return

    // Create dramatic lightning effect
    const createLightning = (x: number, y: number, type: 'bolt' | 'flash' | 'thunderbolt' = 'bolt') => {
      const lightning = document.createElement("div")
      lightning.className = `lightning ${type}`
      
      // Random angle for lightning
      const angle = Math.random() * 360
      const scale = type === 'thunderbolt' ? 2 : 1
      
      lightning.style.left = `${x}px`
      lightning.style.top = `${y}px`
      lightning.style.transform = `rotate(${angle}deg) scale(${scale})`
      
      containerRef.current?.appendChild(lightning)
      
      // Animate lightning
      gsap.to(lightning, {
        scale: scale * 1.5,
        opacity: 0,
        duration: type === 'thunderbolt' ? 0.5 : 0.3,
        ease: "power2.out",
        onComplete: () => {
          lightning.remove()
        },
      })
    }

    // Create background electric effect
    const createBackgroundEffect = () => {
      const effect = document.createElement("div")
      effect.className = "electric-background"
      backgroundRef.current?.appendChild(effect)

      gsap.to(effect, {
        opacity: 0,
        duration: 2,
        ease: "power2.out",
        onComplete: () => {
          effect.remove()
        },
      })
    }

    // Handle mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
      }

      // Create different types of lightning based on random chance
      const random = Math.random()
      if (random < 0.6) {
        createLightning(e.clientX, e.clientY, 'bolt')
      } else if (random < 0.9) {
        createLightning(e.clientX, e.clientY, 'flash')
      } else {
        createLightning(e.clientX, e.clientY, 'thunderbolt')
      }
    }

    // Create periodic background effects
    const createPeriodicEffects = () => {
      createBackgroundEffect()
      setTimeout(createPeriodicEffects, Math.random() * 2000 + 1000)
    }

    // Set up event listeners and intervals
    window.addEventListener("mousemove", handleMouseMove)
    createPeriodicEffects()

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    >
      <div
        ref={backgroundRef}
        className="absolute inset-0"
      />
      <div
        ref={lightningRef}
        className="absolute w-full h-full"
      />
      <style jsx>{`
        .electric-background {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at center,
            rgba(0, 255, 157, 0.1) 0%,
            transparent 70%
          );
          filter: blur(20px);
          opacity: 0.5;
        }

        .lightning {
          position: absolute;
          pointer-events: none;
          transform-origin: center;
        }

        .lightning.bolt {
          width: 2px;
          height: 100px;
          background: linear-gradient(
            to bottom,
            transparent,
            #00ff9d,
            transparent
          );
          filter: blur(1px);
          opacity: 0.8;
        }

        .lightning.flash {
          width: 4px;
          height: 150px;
          background: linear-gradient(
            to bottom,
            transparent,
            #00ff9d,
            #00bfff,
            transparent
          );
          filter: blur(2px);
          opacity: 0.9;
        }

        .lightning.thunderbolt {
          width: 6px;
          height: 200px;
          background: linear-gradient(
            to bottom,
            transparent,
            #00ff9d,
            #00bfff,
            #00ff9d,
            transparent
          );
          filter: blur(3px);
          opacity: 1;
          box-shadow: 0 0 20px #00ff9d;
        }
      `}</style>
    </div>
  )
}

export default ElectricEffects 