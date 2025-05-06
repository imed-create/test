"use client"

import { motion } from "framer-motion"
import { Github, Linkedin, Twitter, Mail } from "lucide-react"
import MagneticButton from "./magnetic-button"

interface SocialLinksProps {
  onCursorHover: (hovering: boolean) => void
}

const SocialLinks = ({ onCursorHover }: SocialLinksProps) => {
  const socialLinks = [
    {
      name: "GitHub",
      icon: <Github size={20} />,
      url: "https://github.com/imedkhedimellah",
    },
    {
      name: "LinkedIn",
      icon: <Linkedin size={20} />,
      url: "https://linkedin.com/in/imedkhedimellah",
    },
    {
      name: "Twitter",
      icon: <Twitter size={20} />,
      url: "https://twitter.com/imedkhedimellah",
    },
    {
      name: "Email",
      icon: <Mail size={20} />,
      url: "mailto:contact@imedkhedimellah.com",
    },
  ]

  return (
    <div className="mt-8">
      <h3 className="text-xl font-medium mb-4">Connect with me</h3>
      <div className="flex space-x-4">
        {socialLinks.map((link) => (
          <MagneticButton key={link.name} onCursorHover={onCursorHover}>
            <motion.a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white hover:text-electric-blue transition-colors"
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
              aria-label={link.name}
            >
              {link.icon}
            </motion.a>
          </MagneticButton>
        ))}
      </div>
    </div>
  )
}

export default SocialLinks
