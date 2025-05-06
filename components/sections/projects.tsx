"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/dist/ScrollTrigger"
import MagneticButton from "../magnetic-button"

interface ProjectProps {
  onCursorHover: (hovering: boolean) => void
}

interface Project {
  id: number
  title: string
  description: string
  image: string
  category: string
  link: string
}

const Projects = ({ onCursorHover }: ProjectProps) => {
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })
  const horizontalRef = useRef<HTMLDivElement>(null)

  const projects: Project[] = [
    {
      id: 1,
      title: "Zeind Food",
      description: "A modern food delivery platform with real-time order tracking and payment integration.",
      image: "/placeholder.svg?height=600&width=800",
      category: "Web Development",
      link: "https://zeindfood.com",
    },
    {
      id: 2,
      title: "Syrian Stone",
      description: "E-commerce platform for natural stone products with 3D visualization.",
      image: "/placeholder.svg?height=600&width=800",
      category: "3D & WebGL",
      link: "https://syrian-stone.com",
    },
    {
      id: 3,
      title: "Iron Pro TV",
      description: "Streaming platform for fitness content with subscription management.",
      image: "/placeholder.svg?height=600&width=800",
      category: "Web Development",
      link: "https://iron-protv.fr",
    },
    {
      id: 4,
      title: "Atlas OnTV Pro",
      description: "IPTV service management platform with user authentication and billing.",
      image: "/placeholder.svg?height=600&width=800",
      category: "Full Stack",
      link: "https://atlas-ontvpro.com",
    },
    {
      id: 5,
      title: "Phoenix Web Labs",
      description: "Digital agency website with interactive 3D elements and animations.",
      image: "/placeholder.svg?height=600&width=800",
      category: "3D & WebGL",
      link: "#",
    },
    {
      id: 6,
      title: "Freelancer DZ",
      description: "Freelancing platform connecting Algerian talent with global opportunities.",
      image: "/placeholder.svg?height=600&width=800",
      category: "Full Stack",
      link: "#",
    },
  ]

  useEffect(() => {
    if (typeof window !== "undefined" && horizontalRef.current) {
      gsap.registerPlugin(ScrollTrigger)

      // Only apply horizontal scrolling on desktop
      if (window.innerWidth >= 768) {
        const sections = gsap.utils.toArray(".project-card")

        gsap.to(sections, {
          xPercent: -100 * (sections.length - 1),
          ease: "none",
          scrollTrigger: {
            trigger: horizontalRef.current,
            pin: true,
            scrub: 1,
            snap: 1 / (sections.length - 1),
            end: () => "+=" + horizontalRef.current.offsetWidth,
          },
        })
      }
    }
  }, [])

  return (
    <div className="py-20">
      <div className="container-custom mb-16">
        <motion.div
          ref={ref}
          className="mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">Selected Projects</h2>
          <p className="text-silver max-w-2xl">
            A selection of my recent work spanning web development, 3D visualization, and blockchain applications.
          </p>
        </motion.div>
      </div>

      <div ref={horizontalRef} className="projects-container relative md:h-screen overflow-hidden">
        <div className="projects-track md:flex md:w-[400%] md:relative">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              className="project-card md:w-screen md:h-screen md:flex md:items-center md:justify-center p-4 md:p-0"
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div
                className="project-inner max-w-lg mx-auto bg-white/5 rounded-xl overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:shadow-electric-blue/20"
                onMouseEnter={() => {
                  setActiveProject(project)
                  onCursorHover(true)
                }}
                onMouseLeave={() => {
                  setActiveProject(null)
                  onCursorHover(false)
                }}
              >
                <div className="relative overflow-hidden aspect-video">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <MagneticButton onCursorHover={onCursorHover}>
                      <a href={project.link} className="btn btn-primary">
                        View Project
                      </a>
                    </MagneticButton>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold">{project.title}</h3>
                    <span className="text-xs text-electric-blue">{project.category}</span>
                  </div>
                  <p className="text-silver/80">{project.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="container-custom">
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <MagneticButton onCursorHover={onCursorHover}>
            <a href="#" className="btn btn-outline">
              View All Projects
            </a>
          </MagneticButton>
        </motion.div>
      </div>
    </div>
  )
}

export default Projects
