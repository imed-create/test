"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface TimelineItem {
  year: string
  title: string
  description: string
}

const timelineData: TimelineItem[] = [
  {
    year: "2023",
    title: "Full Stack Developer",
    description: "Working on cutting-edge web applications and blockchain projects"
  },
  {
    year: "2022",
    title: "Blockchain Developer",
    description: "Developed smart contracts and DApps"
  },
  {
    year: "2021",
    title: "Web Developer",
    description: "Started my journey in web development"
  }
]

export const Timeline = () => {
  const timelineRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (!timelineRef.current) return

    // Animate timeline line
    gsap.fromTo(
      ".timeline-line",
      { scaleY: 0 },
      {
        scaleY: 1,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: timelineRef.current,
          start: "top center",
        }
      }
    )

    // Animate timeline items
    itemsRef.current.forEach((item, index) => {
      if (!item) return

      gsap.fromTo(
        item,
        {
          opacity: 0,
          x: index % 2 === 0 ? -50 : 50,
        },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: item,
            start: "top center",
          }
        }
      )
    })
  }, [])

  return (
    <div ref={timelineRef} className="relative py-20">
      {/* Timeline line */}
      <div className="timeline-line absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#00bfff] to-[#0066ff] transform -translate-x-1/2" />

      {/* Timeline items */}
      <div className="relative z-10">
        {timelineData.map((item, index) => (
          <div
            key={item.year}
            ref={el => itemsRef.current[index] = el}
            className={`relative mb-20 ${
              index % 2 === 0 ? "ml-auto mr-[calc(50%+2rem)]" : "mr-auto ml-[calc(50%+2rem)]"
            } w-[calc(50%-4rem)]`}
          >
            {/* Year marker */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-4 h-4 rounded-full bg-[#00bfff] shadow-[0_0_15px_#00bfff]" />
            </div>

            {/* Content */}
            <div className="bg-black/50 backdrop-blur-sm p-6 rounded-lg border border-[#00bfff]/20 shadow-[0_0_20px_rgba(0,191,255,0.1)] hover:shadow-[0_0_30px_rgba(0,191,255,0.2)] transition-all duration-300">
              <div className="text-[#00bfff] text-2xl font-bold mb-2">{item.year}</div>
              <h3 className="text-white text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-300">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 