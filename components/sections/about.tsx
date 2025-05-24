"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import MagneticButton from "../magnetic-button" // Assuming this is a styled button component

interface Milestone {
  year: string
  title: string // Added title for more context, can be same as description if not provided
  description: string
}

const milestones: Milestone[] = [
  {
    year: "2023",
    title: "Full-stack & 3D Web Dev",
    description: "Deep dive into full-stack development with a focus on Next.js, TypeScript, and creating immersive 3D web experiences with Three.js and WebGL.",
  },
  {
    year: "2022",
    title: "Crypto Researcher",
    description: "Explored blockchain technology, decentralized finance (DeFi), and cryptocurrency market trends, contributing to research and analysis.",
  },
  {
    year: "2020",
    title: "WordPress Freelance",
    description: "Began freelance web development journey, creating and customizing websites using WordPress, Elementor, and custom CSS/JS.",
  },
  {
    year: "2019",
    title: "Master’s in Aeronautics",
    description: "Completed Master's degree in Aeronautical Engineering, specializing in aerodynamics and fluid dynamics, with extensive research and simulation work.",
  },
]

const skills = [
  "React", "Next.js", "TypeScript", "Three.js", "WebGL", "GSAP",
  "Tailwind CSS", "Framer Motion", "Node.js", "Python", "Blockchain",
  "Solidity", "Crypto Research", "UI/UX Design", "Aerospace Engineering",
]

export const About = () => {
  const sectionRef = useRef(null)
  const sectionInView = useInView(sectionRef, { once: false, amount: 0.1 })

  const cardVariants = {
    hidden: { opacity: 0, y: 50, filter: "blur(5px)" }, // Added blur for "motion blur" placeholder
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.2,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  }

  const lineVariants = {
    hidden: { scaleY: 0, originY: 0 },
    visible: (i: number) => ({
      scaleY: 1,
      transition: {
        delay: i * 0.2 + 0.3, // Delay slightly after card
        duration: 0.4,
        ease: "easeOut",
      },
    }),
  }
  
  const lightningTrailVariants = {
    hidden: { scaleX: 0, opacity: 0, originX: 0 },
    visible: (i: number) => ({
      scaleX: 1,
      opacity: [0, 0.8, 0], // Flash effect
      transition: {
        delay: i * 0.2 + 0.1, // Between card reveals
        duration: 0.4,
        times: [0, 0.5, 1], // Control opacity keyframes
        ease: "circOut",
      },
    }),
  }


  return (
    <section ref={sectionRef} id="about" className="py-20 md:py-32 bg-black text-white font-inter">
      <div className="container-custom mx-auto px-4">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold mb-16 md:mb-24 text-center font-montserrat electric-text"
          initial={{ opacity: 0, y: 30 }}
          animate={sectionInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          My Journey
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          {/* Left Column: Intro Text & Skills */}
          <motion.div 
            className="md:col-span-5 space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={sectionInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4 font-montserrat text-gradient">From Skies to Pixels</h3>
              <p className="text-silver text-base md:text-lg leading-relaxed">
                My path from aeronautical engineering to the dynamic world of web development and blockchain technology is fueled by a relentless curiosity and a drive to innovate. The analytical rigor from aerospace finds new expression in crafting elegant code and immersive digital experiences.
              </p>
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-6 font-montserrat text-gradient">Skills & Technologies</h3>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, index) => (
                  <motion.div
                    key={skill}
                    className="px-4 py-2 bg-gray-800/70 rounded-lg text-sm text-silver hover:text-electric-blue transition-colors duration-300 shadow-md"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={sectionInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.05 }}
                  >
                    {skill}
                  </motion.div>
                ))}
              </div>
            </div>
             <div className="pt-4">
              <MagneticButton>
                <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="btn btn-outline electric-border hover:bg-electric-blue/20">
                  Download Resume
                </a>
              </MagneticButton>
            </div>
          </motion.div>

          {/* Right Column: Vertical Timeline */}
          <motion.div 
            className="md:col-span-7 relative" // Added relative for positioning timeline line
            initial={{ opacity: 0, x: 50 }}
            animate={sectionInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          >
            {/* Central connecting line - placeholder */}
            <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-1 bg-gray-700/50 rounded-full hidden md:block"></div>

            {milestones.map((item, index) => (
              <div key={item.year} className="mb-10 md:mb-0 flex md:items-center w-full">
                {/* Timeline Item Structure */}
                <div className={`flex w-full items-start md:items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                  {/* Dot on the central line */}
                  <motion.div 
                    className="hidden md:flex items-center justify-center"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                    variants={cardVariants} // Reuse card variant for dot reveal
                    custom={index}
                  >
                    <div className={`w-10 h-1 ${index % 2 === 0 ? 'bg-gray-700/50' : 'bg-transparent md:bg-gray-700/50'}`}></div> {/* Connector to card */}
                    <div className="w-5 h-5 rounded-full bg-electric-blue border-2 border-black ring-2 ring-electric-blue shadow-lg z-10"></div>
                    <div className={`w-10 h-1 ${index % 2 !== 0 ? 'bg-gray-700/50' : 'bg-transparent md:bg-gray-700/50'}`}></div> {/* Connector to card */}
                  </motion.div>

                  {/* Milestone Card */}
                  <motion.div
                    custom={index}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.3 }} // Trigger when 30% in view, allow re-trigger
                    variants={cardVariants}
                    className={`w-full md:w-[calc(50%-2.5rem-0.25rem)] p-6 bg-gray-800/60 backdrop-blur-sm rounded-xl shadow-xl relative overflow-hidden
                                ${index % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'}
                                border border-transparent hover:border-electric-blue/50 transition-colors duration-300 group`}
                    style={{
                      boxShadow: "0 0 0px 0px rgba(0, 255, 157, 0)", // Initial for GSAP/Framer to animate to electric glow
                    }}
                    onViewportEnter={() => { // Animate glow on enter
                        gsap.to(`.milestone-card-glow-${index}`, {
                           boxShadow: "0 0 20px 3px rgba(0, 255, 157, 0.3), 0 0 30px 5px rgba(0, 191, 255, 0.2)", // Electric blue + teal
                           duration: 0.5,
                           delay: 0.3
                        });
                    }}
                     onViewportLeave={() => { // Optional: Reset glow on leave
                        gsap.to(`.milestone-card-glow-${index}`, {
                           boxShadow: "0 0 0px 0px rgba(0, 255, 157, 0)",
                           duration: 0.3
                        });
                    }}
                  >
                    <div className={`milestone-card-glow-${index} absolute inset-0 rounded-xl pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity duration-300`} />
                    
                    <h4 className="text-2xl font-bold mb-2 font-montserrat text-electric-blue">{item.year}</h4>
                    <h5 className="text-lg font-semibold mb-1 font-montserrat text-white">{item.title}</h5>
                    <p className="text-silver/90 text-sm leading-relaxed">{item.description}</p>

                    {/* Lightning Trail Placeholder */}
                    {index < milestones.length -1 && ( // Don't add after the last item
                       <motion.div
                         custom={index}
                         initial="hidden"
                         whileInView="visible"
                         viewport={{ once: true, amount: 0.3 }}
                         variants={lightningTrailVariants}
                         className="absolute top-1/2 -translate-y-1/2 h-1 w-full bg-gradient-to-r from-transparent via-gold to-transparent md:hidden" // Mobile trail below card
                       />
                    )}
                  </motion.div>
                </div>
                {/* Desktop Lightning Trail connecting central dots - this is more complex to place correctly with dynamic card heights.
                    A simpler approach is to animate parts of the central line itself or use absolute positioned elements.
                    For now, the mobile trail serves as a placeholder.
                */}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default About;
