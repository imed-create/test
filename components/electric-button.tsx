"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface ElectricButtonProps {
  children: ReactNode
  href?: string
  onClick?: () => void
  className?: string
  variant?: "primary" | "secondary" | "outline"
}

const ElectricButton = ({ children, href, onClick, className = "", variant = "primary" }: ElectricButtonProps) => {
  const baseClasses = "relative px-6 py-3 font-medium rounded-lg overflow-hidden"

  const variantClasses = {
    primary: "bg-electric text-navy hover:bg-electric/90",
    secondary: "bg-teal text-navy hover:bg-teal/90",
    outline: "border border-gold text-gold hover:bg-gold/10",
  }

  const buttonContent = (
    <motion.span
      className="relative z-10 flex items-center justify-center"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.span>
  )

  const buttonElement = (
    <motion.button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="absolute inset-0 overflow-hidden">
        <span className="absolute inset-0 rounded-lg opacity-30 animate-electric-pulse"></span>
      </span>
      {buttonContent}
    </motion.button>
  )

  if (href) {
    return (
      <motion.a
        href={href}
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="absolute inset-0 overflow-hidden">
          <span className="absolute inset-0 rounded-lg opacity-30 animate-electric-pulse"></span>
        </span>
        {buttonContent}
      </motion.a>
    )
  }

  return buttonElement
}

export default ElectricButton
