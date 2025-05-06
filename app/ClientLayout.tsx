"use client"

import type React from "react"
import { Inter, Montserrat } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

// Load fonts
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
})

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Ensure font variables are available */}
        <style jsx global>{`
          :root {
            --font-inter: ${inter.style.fontFamily};
            --font-montserrat: ${montserrat.style.fontFamily};
          }
        `}</style>
      </head>
      <body className={`${inter.variable} ${montserrat.variable} bg-deep-navy text-silver antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
