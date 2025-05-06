"use client"

import { useSmoothScroll } from "@/hooks/use-smooth-scroll"

interface SmoothScrollProviderProps {
  children: React.ReactNode
}

export const SmoothScrollProvider = ({ children }: SmoothScrollProviderProps) => {
  useSmoothScroll()

  return <>{children}</>
} 