"use client"

import { useLenis } from "@/hooks/use-lenis"

interface SmoothScrollProviderProps {
  children: React.ReactNode
}

export const SmoothScrollProvider = ({ children }: SmoothScrollProviderProps) => {
  useLenis()

  return <>{children}</>
} 