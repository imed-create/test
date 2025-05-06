import type React from "react"
import type { Metadata } from "next"
import { Inter, Montserrat } from "next/font/google"
import "./globals.css"
import "@/styles/works.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ElectricEffects } from "@/components/electric-effects"
import { Preloader } from "@/components/preloader"

// Font definitions
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

export const metadata: Metadata = {
  title: "Imed Khedimellah | Full-Stack Developer & Crypto Researcher",
  description: "Portfolio of Imed Khedimellah - Aeronautical Engineer turned Full-Stack Web Developer and Crypto Researcher",
  keywords: ["web development", "full-stack", "crypto", "blockchain", "aeronautical engineering"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${montserrat.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <Preloader />
          <ElectricEffects />
          <main className="relative">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
