"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"

gsap.registerPlugin(ScrollTrigger)

interface Project {
  title: string
  description: string
  image: string
  link: string
  tags: string[]
}

const projects: Project[] = [
  {
    title: "Project 1",
    description: "A cutting-edge web application with blockchain integration",
    image: "/project1.jpg",
    link: "#",
    tags: ["Next.js", "Blockchain", "Web3"]
  },
  {
    title: "Project 2",
    description: "AI-powered analytics dashboard",
    image: "/project2.jpg",
    link: "#",
    tags: ["React", "AI", "Data Visualization"]
  },
  {
    title: "Project 3",
    description: "Decentralized finance platform",
    image: "/project3.jpg",
    link: "#",
    tags: ["Solidity", "DeFi", "Ethereum"]
  }
]

export const Works = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (!containerRef.current) return

    // Animate cards on scroll
    cardsRef.current.forEach((card, index) => {
      if (!card) return

      gsap.fromTo(
        card,
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top bottom-=100",
          }
        }
      )
    })
  }, [])

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#00bfff]/5 to-transparent" />
      
      <div ref={containerRef} className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-white">
          <span className="text-[#00bfff]">My</span> Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={project.title}
              ref={el => cardsRef.current[index] = el}
              className="group relative bg-black/50 backdrop-blur-sm rounded-lg overflow-hidden border border-[#00bfff]/20 hover:border-[#00bfff] transition-all duration-300"
            >
              {/* Card content */}
              <div className="relative aspect-video">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-[#00bfff] transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="text-gray-300 mb-4">{project.description}</p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-sm rounded-full bg-[#00bfff]/10 text-[#00bfff] border border-[#00bfff]/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#00bfff]/0 via-[#00bfff]/5 to-[#00bfff]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Glow effect */}
              <div className="absolute inset-0 shadow-[0_0_30px_rgba(0,191,255,0.1)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 