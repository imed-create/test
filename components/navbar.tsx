"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import Link from "next/link"

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const lightningRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const mouseTrailRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!navRef.current || !lightningRef.current) return

    // Create electric mouse trail
    const handleMouseMove = (e: MouseEvent) => {
      const rect = navRef.current?.getBoundingClientRect()
      if (!rect || !mouseTrailRef.current) return

      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Update mouse trail position
      gsap.to(mouseTrailRef.current, {
        x,
        y,
        duration: 0.1,
        ease: "power2.out",
      })

      // Create lightning effect
      if (Math.random() < 0.1) {
        const lightning = document.createElement("div")
        lightning.className = "nav-lightning"
        lightning.style.left = `${x}px`
        lightning.style.top = `${y}px`
        lightningRef.current?.appendChild(lightning)

        gsap.to(lightning, {
          scale: 1.5,
          opacity: 0,
          duration: 0.3,
          ease: "power2.out",
          onComplete: () => lightning.remove(),
        })
      }
    }

    // Animate menu
    const animateMenu = () => {
      if (!menuRef.current) return

      const tl = gsap.timeline()
      if (isOpen) {
        tl.to(menuRef.current, {
          height: "100vh",
          duration: 0.5,
          ease: "power4.inOut",
        })
      } else {
        tl.to(menuRef.current, {
          height: "0",
          duration: 0.5,
          ease: "power4.inOut",
        })
      }
    }

    navRef.current.addEventListener("mousemove", handleMouseMove)
    animateMenu()

    return () => {
      navRef.current?.removeEventListener("mousemove", handleMouseMove)
    }
  }, [isOpen])

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 w-full z-50 bg-transparent"
    >
      <div className="container-custom h-20 flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold electric-text"
        >
          Imed Khedimellah
        </Link>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-2 electric-hover"
        >
          <div className="w-6 h-0.5 bg-electric-blue mb-1.5" />
          <div className="w-6 h-0.5 bg-electric-blue mb-1.5" />
          <div className="w-6 h-0.5 bg-electric-blue" />
        </button>

        <div
          ref={lightningRef}
          className="absolute inset-0 pointer-events-none"
        />
        <div
          ref={mouseTrailRef}
          className="mouse-trail"
        />

        <div
          ref={menuRef}
          className="fixed top-20 left-0 w-full bg-black/90 overflow-hidden"
          style={{ height: 0 }}
        >
          <div className="container-custom py-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-4xl font-bold mb-8 electric-text">
                  Navigation
                </h2>
                <ul className="space-y-4">
                  <li>
                    <Link
                      href="/"
                      className="text-2xl electric-hover"
                      onClick={() => setIsOpen(false)}
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/#about"
                      className="text-2xl electric-hover"
                      onClick={() => setIsOpen(false)}
                    >
                      About
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/#works"
                      className="text-2xl electric-hover"
                      onClick={() => setIsOpen(false)}
                    >
                      Works
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/#contact"
                      className="text-2xl electric-hover"
                      onClick={() => setIsOpen(false)}
                    >
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="text-4xl font-bold mb-8 electric-text">
                  Connect
                </h2>
                <ul className="space-y-4">
                  <li>
                    <a
                      href="https://github.com/yourusername"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-2xl electric-hover"
                    >
                      GitHub
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://linkedin.com/in/yourusername"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-2xl electric-hover"
                    >
                      LinkedIn
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://twitter.com/yourusername"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-2xl electric-hover"
                    >
                      Twitter
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .nav-lightning {
          position: absolute;
          width: 2px;
          height: 50px;
          background: linear-gradient(
            to bottom,
            transparent,
            #00ff9d,
            transparent
          );
          filter: blur(1px);
          opacity: 0.8;
          transform-origin: center;
          pointer-events: none;
        }

        .mouse-trail {
          position: absolute;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: radial-gradient(
            circle at center,
            #00ff9d,
            transparent 70%
          );
          filter: blur(2px);
          opacity: 0.5;
          pointer-events: none;
          transform: translate(-50%, -50%);
          mix-blend-mode: screen;
        }
      `}</style>
    </nav>
  )
}
