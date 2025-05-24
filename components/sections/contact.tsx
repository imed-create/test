"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import MagneticButton from "../magnetic-button"
import SocialLinks from "../social-links"
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const socialLinks = [
  {
    name: 'GitHub',
    url: 'https://github.com/yourusername',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/yourusername',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
      </svg>
    ),
  },
  {
    name: 'Email',
    url: 'mailto:your.email@example.com',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l10 8.104 10-8.104v11.817h-20z"/>
      </svg>
    ),
  },
];

export const Contact = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })
  const sectionRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSubmitted(true)
    setFormData({ name: "", email: "", message: "" })

    // Reset success message after 5 seconds
    setTimeout(() => {
      setIsSubmitted(false)
    }, 5000)
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Form field animations
      const formFields = formRef.current?.querySelectorAll('input, textarea')
      if (formFields) {
        gsap.fromTo(
          formFields,
          {
            y: 50,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: formRef.current,
              start: 'top center',
              end: 'bottom center',
              toggleActions: 'play none none reverse',
            },
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen py-20 overflow-hidden"
    >
      <div className="container-custom">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold mb-12 electric-text text-center"
        >
          Get in Touch
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <p className="text-xl text-silver">
              Let's discuss your next project or just say hello! I'm always open to
              new opportunities and collaborations.
            </p>

            <div className="flex gap-6">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-black/50 electric-border hover:scale-110 transition-transform"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {link.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.form
            ref={formRef}
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-silver"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none transition-all duration-300 font-inter text-silver"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-silver font-montserrat"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none transition-all duration-300 font-inter text-silver"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="message"
                className="block text-sm font-medium text-silver font-montserrat"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                className="form-input w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none transition-all duration-300 resize-none font-inter text-silver"
                required
              />
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="form-submit w-full px-6 py-3 bg-electric-blue text-black rounded-lg font-bold font-montserrat hover:bg-gold transition-all duration-300 focus:outline-none relative overflow-hidden"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {isSubmitting ? "Sending..." : isSubmitted ? "Message Sent!" : "Send Message"}
               {/* Energy flow on button */}
              <div className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 
                              bg-[conic-gradient(from_90deg_at_50%_50%,#ffd700_-20%,#00ff9d_30%,#00bfff_50%,#ffd700_120%)] 
                              animate-spin-slow group-focus:opacity-100"></div>
              <span className="relative z-10">{isSubmitting ? "Sending..." : isSubmitted ? "Message Sent!" : "Send Message"}</span>
            </motion.button>
          </motion.form>
        </div>
      </div>

      {/* Cosmic Background & Lightning */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Static stars */}
        <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_center,_rgba(200,200,255,0.3)_0,_rgba(200,200,255,0.3)_1px,transparent_1px,transparent_100%)] [background-size:20px_20px]"></div>
        {/* Lightning pulses */}
        <div className="absolute inset-0 animate-lightning-pulse-bg opacity-0"></div>
      </div>
      
      {/* CSS for animations (can be moved to globals.css) */}
      <style jsx global>{`
        @keyframes inputPulse {
          0%, 100% { box-shadow: 0 0 0px theme('colors.electric-blue.DEFAULT_ALPHA_0.3'); border-color: theme('colors.gray.700'); }
          50% { box-shadow: 0 0 12px theme('colors.electric-blue.DEFAULT'), 0 0 3px theme('colors.electric-blue.DEFAULT') inset; border-color: theme('colors.electric-blue.DEFAULT'); }
        }
        .form-input:focus, .form-submit:focus {
          animation: inputPulse 0.6s ease-out;
          border-color: theme('colors.electric-blue.DEFAULT'); /* Keep border color during/after pulse */
        }

        @keyframes energyFlowBorder {
          0% { border-image-source: linear-gradient(0deg, theme('colors.gold.DEFAULT'), theme('colors.electric-blue.DEFAULT'), theme('colors.teal.DEFAULT')); }
          25% { border-image-source: linear-gradient(90deg, theme('colors.gold.DEFAULT'), theme('colors.electric-blue.DEFAULT'), theme('colors.teal.DEFAULT')); }
          50% { border-image-source: linear-gradient(180deg, theme('colors.gold.DEFAULT'), theme('colors.electric-blue.DEFAULT'), theme('colors.teal.DEFAULT')); }
          75% { border-image-source: linear-gradient(270deg, theme('colors.gold.DEFAULT'), theme('colors.electric-blue.DEFAULT'), theme('colors.teal.DEFAULT')); }
          100% { border-image-source: linear-gradient(360deg, theme('colors.gold.DEFAULT'), theme('colors.electric-blue.DEFAULT'), theme('colors.teal.DEFAULT')); }
        }
        .form-container-energy-flow {
          border: 3px solid transparent;
          border-image-slice: 1;
          animation: energyFlowBorder 4s linear infinite;
          padding: 1.5rem; /* Adjust padding to be inside the animated border */
          border-radius: 0.75rem; /* Match form card rounding */
        }
        
        @keyframes lightningPulseBg {
          0%, 100% { background-color: rgba(0, 255, 157, 0); } /* electric-blue transparent */
          50% { background-color: rgba(0, 255, 157, 0.05); } /* electric-blue subtle flash */
        }
        .animate-lightning-pulse-bg {
            animation: lightningPulseBg 5s infinite ease-in-out alternate;
            animation-delay: ${Math.random() * 2}s; /* Random start */
        }
        .animate-spin-slow {
            animation-duration: 5s; /* Slower spin for button energy */
        }
      `}</style>
    </section>
  )
}
