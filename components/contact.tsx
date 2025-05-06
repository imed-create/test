"use client"

import type React from "react"
import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import MagneticButton from "../magnetic-button"
import SocialLinks from "../social-links"
import ContactBackground from "./contact-background"

interface ContactProps {
  onCursorHover: (hovering: boolean) => void
}

const Contact = ({ onCursorHover }: ContactProps) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })

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

  return (
    <div className="container-custom py-20 relative min-h-screen">
      {/* 3D Background */}
      <ContactBackground />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            <span className="text-[#00bfff]">Let's</span> Connect
          </h2>

          <div className="space-y-6 text-gray-300">
            <p>
              I'm always open to discussing new projects, creative ideas or opportunities to be part of your vision.
            </p>

            <div className="space-y-4 mt-8">
              <div
                className="flex items-center group"
                onMouseEnter={() => onCursorHover(true)}
                onMouseLeave={() => onCursorHover(false)}
              >
                <div className="w-12 h-12 rounded-full bg-[#00bfff]/10 border border-[#00bfff]/20 flex items-center justify-center mr-4 group-hover:bg-[#00bfff]/20 group-hover:border-[#00bfff] transition-all duration-300">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#00bfff]">
                    <path
                      d="M22 12C22 6.48 17.52 2 12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12ZM16 12C16 14.21 14.21 16 12 16C9.79 16 8 14.21 8 12C8 9.79 9.79 8 12 8C14.21 8 16 9.79 16 12Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-white">Location</h3>
                  <p className="text-gray-400">Algeria</p>
                </div>
              </div>

              <div
                className="flex items-center group"
                onMouseEnter={() => onCursorHover(true)}
                onMouseLeave={() => onCursorHover(false)}
              >
                <div className="w-12 h-12 rounded-full bg-[#00bfff]/10 border border-[#00bfff]/20 flex items-center justify-center mr-4 group-hover:bg-[#00bfff]/20 group-hover:border-[#00bfff] transition-all duration-300">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#00bfff]">
                    <path
                      d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-white">Email</h3>
                  <p className="text-gray-400">contact@imedkhedimellah.com</p>
                </div>
              </div>

              <SocialLinks onCursorHover={onCursorHover} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h3 className="text-2xl font-bold mb-8">
            <span className="text-[#00bfff]">Send</span> a Message
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-black/50 backdrop-blur-sm border border-[#00bfff]/20 rounded-lg focus:outline-none focus:border-[#00bfff] text-white transition-all duration-300"
                placeholder="Your name"
                onMouseEnter={() => onCursorHover(true)}
                onMouseLeave={() => onCursorHover(false)}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-black/50 backdrop-blur-sm border border-[#00bfff]/20 rounded-lg focus:outline-none focus:border-[#00bfff] text-white transition-all duration-300"
                placeholder="your.email@example.com"
                onMouseEnter={() => onCursorHover(true)}
                onMouseLeave={() => onCursorHover(false)}
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-3 bg-black/50 backdrop-blur-sm border border-[#00bfff]/20 rounded-lg focus:outline-none focus:border-[#00bfff] text-white resize-none transition-all duration-300"
                placeholder="Your message..."
                onMouseEnter={() => onCursorHover(true)}
                onMouseLeave={() => onCursorHover(false)}
              />
            </div>

            <div>
              <MagneticButton onCursorHover={onCursorHover}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 rounded-lg font-medium flex items-center justify-center transition-all duration-300 ${
                    isSubmitting 
                      ? "bg-[#00bfff]/50 text-white/70 cursor-not-allowed" 
                      : "bg-[#00bfff] hover:bg-[#00bfff]/80 text-white shadow-[0_0_20px_rgba(0,191,255,0.3)]"
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    <span>Send Message</span>
                  )}
                </button>
              </MagneticButton>

              {isSubmitted && (
                <motion.div
                  className="mt-4 p-3 bg-[#00bfff]/10 border border-[#00bfff]/30 rounded-lg text-[#00bfff] text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  Thank you! Your message has been sent successfully.
                </motion.div>
              )}
            </div>
          </form>
        </motion.div>
      </div>

      <motion.div
        className="mt-20 text-center text-gray-500 text-sm"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <p>&copy; {new Date().getFullYear()} Imed Khedimellah. All rights reserved.</p>
      </motion.div>
    </div>
  )
}

export default Contact 