"use client"

import { useRef, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/dist/ScrollTrigger"
import MagneticButton from "../magnetic-button"

interface TimelineItem {
  year: string
  title: string
  description: string
}

export const About = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })
  const timelineRef = useRef(null)

  const timelineItems: TimelineItem[] = [
    {
      year: "2023",
      title: "Full-stack Developer",
      description: "Specializing in React, Next.js, and Three.js for interactive web experiences",
    },
    {
      year: "2022",
      title: "Crypto Researcher",
      description: "Conducting research on blockchain technologies and cryptocurrency markets",
    },
    {
      year: "2020",
      title: "WordPress Freelance",
      description: "Started freelancing with WordPress and basic web development",
    },
    {
      year: "2019",
      title: "Master's in Aeronautics",
      description: "Completed Master's degree in Aeronautical Engineering with focus on fluid dynamics",
    },
  ]

  const skills = [
    "React",
    "Next.js",
    "TypeScript",
    "Three.js",
    "WebGL",
    "Tailwind CSS",
    "Framer Motion",
    "Node.js",
    "Blockchain",
    "Crypto Research",
    "Aeronautical Engineering",
    "UI/UX Design",
  ]

  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger)

      if (timelineRef.current) {
        gsap.from(".timeline-item", {
          y: 100,
          opacity: 0,
          stagger: 0.2,
          duration: 0.8,
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 80%",
            end: "top 30%",
            scrub: 1,
          },
        })
      }
    }
  }, [])

  return (
    <div className="container-custom py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gradient">From Skies to Code</h2>

          <div className="space-y-6 text-silver">
            <p>
              My journey from aeronautical engineering to web development has been driven by a passion for innovation
              and problem-solving across different domains.
            </p>

            <p>
              With a master's degree in Aeronautical Engineering and experience in fluid dynamics and aircraft design, I
              bring a unique analytical perspective to web development.
            </p>

            <p>
              I've since transitioned to full-stack development with React, Next.js, and Three.js, specializing in
              interactive web experiences while also conducting research on blockchain technologies and cryptocurrency
              markets.
            </p>

            <div className="pt-4">
              <MagneticButton>
                <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                  Download Resume
                </a>
              </MagneticButton>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h3 className="text-2xl font-bold mb-8 text-gradient">Skills & Expertise</h3>

          <div className="flex flex-wrap gap-3">
            {skills.map((skill, index) => (
              <motion.div
                key={skill}
                className="px-4 py-2 bg-white/5 rounded-full text-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                {skill}
              </motion.div>
            ))}
          </div>

          <div className="mt-12" ref={timelineRef}>
            <h3 className="text-2xl font-bold mb-6 text-gradient">Experience Timeline</h3>

            <div className="space-y-8">
              {timelineItems.map((item, index) => (
                <motion.div
                  key={item.year}
                  className="timeline-item p-6 bg-white/5 rounded-xl transform transition-all duration-300 hover:bg-electric-blue/10 hover:-translate-y-2 hover:shadow-lg hover:shadow-electric-blue/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                >
                  <div className="text-electric-blue font-medium mb-1">{item.year}</div>
                  <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                  <p className="text-silver/80">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
