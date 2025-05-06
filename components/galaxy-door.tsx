"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

interface GalaxyDoorProps {
  type: "intro" | "outro"
  onComplete?: () => void
}

export const GalaxyDoor = ({ type, onComplete }: GalaxyDoorProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const doorRef = useRef<HTMLDivElement>(null)
  const starsRef = useRef<HTMLDivElement>(null)
  const lightningRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !doorRef.current || !starsRef.current) return

    // Create stars
    const createStars = () => {
      const stars = starsRef.current
      if (!stars) return

      for (let i = 0; i < 100; i++) {
        const star = document.createElement("div")
        star.className = "star"
        star.style.left = `${Math.random() * 100}%`
        star.style.top = `${Math.random() * 100}%`
        star.style.animationDelay = `${Math.random() * 3}s`
        stars.appendChild(star)
      }
    }

    // Create dramatic lightning effect
    const createLightning = (type: 'bolt' | 'flash' | 'thunderbolt' = 'bolt') => {
      const lightning = document.createElement("div")
      lightning.className = `galaxy-lightning ${type}`
      
      // Random position
      const x = Math.random() * window.innerWidth
      const y = Math.random() * window.innerHeight
      lightning.style.left = `${x}px`
      lightning.style.top = `${y}px`
      
      // Random angle and scale
      const angle = Math.random() * 360
      const scale = type === 'thunderbolt' ? 2 : 1
      lightning.style.transform = `rotate(${angle}deg) scale(${scale})`
      
      lightningRef.current?.appendChild(lightning)
      
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

    // Create periodic lightning
    const createPeriodicLightning = () => {
      const random = Math.random()
      if (random < 0.6) {
        createLightning('bolt')
      } else if (random < 0.9) {
        createLightning('flash')
      } else {
        createLightning('thunderbolt')
      }
      setTimeout(createPeriodicLightning, Math.random() * 500 + 200)
    }

    // Animation sequence
    const animate = () => {
      const tl = gsap.timeline({
        onComplete: () => onComplete?.(),
      })

      if (type === "intro") {
        tl.fromTo(
          doorRef.current,
          {
            scaleY: 0,
            opacity: 0,
          },
          {
            scaleY: 1,
            opacity: 1,
            duration: 1.5,
            ease: "power4.inOut",
          }
        )
          .fromTo(
            starsRef.current,
            {
              opacity: 0,
              scale: 0.5,
            },
            {
              opacity: 1,
              scale: 1,
              duration: 1,
              ease: "power2.out",
            },
            "-=1"
          )
          .to(containerRef.current, {
            opacity: 0,
            duration: 1,
            delay: 1,
            ease: "power2.inOut",
          })
      } else {
        tl.fromTo(
          containerRef.current,
          {
            opacity: 0,
          },
          {
            opacity: 1,
            duration: 0.5,
          }
        )
          .fromTo(
            starsRef.current,
            {
              opacity: 0,
              scale: 1.5,
            },
            {
              opacity: 1,
              scale: 1,
              duration: 1,
              ease: "power2.out",
            }
          )
          .to(doorRef.current, {
            scaleY: 0,
            opacity: 0,
            duration: 1.5,
            ease: "power4.inOut",
          })
      }
    }

    createStars()
    createPeriodicLightning()
    animate()
  }, [type, onComplete])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
    >
      <div
        ref={doorRef}
        className="relative w-full h-full overflow-hidden"
      >
        <div
          ref={starsRef}
          className="absolute inset-0"
        />
        <div
          ref={lightningRef}
          className="absolute inset-0"
        />
      </div>

      <style jsx>{`
        .star {
          position: absolute;
          width: 2px;
          height: 2px;
          background: white;
          border-radius: 50%;
          animation: twinkle 3s infinite;
        }

        .galaxy-lightning {
          position: absolute;
          pointer-events: none;
          transform-origin: center;
        }

        .galaxy-lightning.bolt {
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

        .galaxy-lightning.flash {
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

        .galaxy-lightning.thunderbolt {
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

        @keyframes twinkle {
          0%, 100% {
            opacity: 0.2;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  )
} 