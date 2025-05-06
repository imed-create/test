"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { GalaxyDoor } from "@/components/galaxy-door"
import { Hero } from "@/components/sections/hero"
import { About } from "@/components/sections/about"
import { Works } from "@/components/sections/works"
import { Contact } from "@/components/sections/contact"
import { ElectricEffects } from "@/components/electric-effects"
import { ElectricCharacter } from "@/components/electric-character"
import { Preloader } from "@/components/preloader"
import CustomCursor from "@/components/custom-cursor"
import ThemeToggle from "@/components/theme-toggle"

export default function Home() {
  const [showIntro, setShowIntro] = useState(true)
  const [showOutro, setShowOutro] = useState(false)
  const [showCharacter, setShowCharacter] = useState(false)

  useEffect(() => {
    // Show outro when user reaches the bottom of the page
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY + window.innerHeight
      
      if (scrollTop >= scrollHeight - 100) {
        setShowOutro(true)
      } else {
        setShowOutro(false)
      }

      // Show character before contact section
      const worksSection = document.getElementById("works")
      if (worksSection) {
        const worksBottom = worksSection.getBoundingClientRect().bottom
        if (worksBottom <= window.innerHeight) {
          setShowCharacter(true)
        } else {
          setShowCharacter(false)
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <main className="relative">
      <Preloader />
      
      {showIntro && (
        <GalaxyDoor
          type="intro"
          onComplete={() => setShowIntro(false)}
        />
      )}

      {showOutro && (
        <GalaxyDoor
          type="outro"
          onComplete={() => setShowOutro(false)}
        />
      )}

      <Navbar />
      <ElectricEffects />

      <CustomCursor />
      <ThemeToggle />

      <Hero />
      <About />
      <Works />
      {showCharacter && <ElectricCharacter />}
      <Contact />
    </main>
  )
}
