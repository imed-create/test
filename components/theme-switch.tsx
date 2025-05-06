"use client"

import { useTheme } from "next-themes"
import { useEffect, useState, useRef } from "react"
import { gsap } from "gsap"

export const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const sunRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!sunRef.current) return

    if (theme === "light") {
      // Sun rise animation
      gsap.fromTo(
        sunRef.current,
        {
          y: 20,
          opacity: 0,
          scale: 0.5,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "power2.out",
        }
      )
    } else {
      // Sun set animation
      gsap.to(sunRef.current, {
        y: 20,
        opacity: 0,
        scale: 0.5,
        duration: 0.5,
        ease: "power2.in",
      })
    }
  }, [theme])

  if (!mounted) return null

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative w-12 h-12 rounded-full bg-black/20 backdrop-blur-sm border border-white/10 hover:border-[#00bfff] transition-colors duration-300"
    >
      {/* Moon/Sun container */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Moon (always visible) */}
        <div className="w-6 h-6 rounded-full bg-white" />
        
        {/* Sun (animated) */}
        <div
          ref={sunRef}
          className="absolute w-6 h-6"
          style={{
            background: "radial-gradient(circle, #ffd700 0%, #ffa500 100%)",
            borderRadius: "50%",
            boxShadow: "0 0 20px #ffd700, 0 0 40px #ffa500",
            opacity: theme === "light" ? 1 : 0,
            transform: `scale(${theme === "light" ? 1 : 0.5})`,
          }}
        >
          {/* Sun rays */}
          <div className="absolute inset-0 animate-spin-slow">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-3 bg-yellow-400"
                style={{
                  left: "50%",
                  top: "50%",
                  transform: `rotate(${i * 45}deg) translateY(-8px)`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </button>
  )
} 