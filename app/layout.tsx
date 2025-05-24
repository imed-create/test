import type React from "react"
import type { Metadata } from "next"
import { Inter, Montserrat } from "next/font/google"
import "./globals.css"
import "@/styles/works.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Preloader } from "@/components/preloader"
import { ThunderstormBackground } from "@/components/thunderstorm-background"
import ElectricBackground from "@/components/electric-background"
import InteractiveLightning from "@/components/interactive-lightning" // Added import
import { MouseCircle } from "@/components/mouse-circle"
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider"

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
    <html lang="en" suppressHydrationWarning style={{ backgroundColor: '#000000' }}>
      <body className={`${inter.variable} ${montserrat.variable} font-sans`} style={{ backgroundColor: '#000000' }}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <SmoothScrollProvider>
            <Preloader />
            <div className="fixed inset-0 z-[-20]"> {/* Parent for deep background effects */}
              <ElectricBackground /> {/* z-index is -z-10 in its own definition, effectively z-[-20 + (-10)] if parent was 0 */}
            </div>
            <div className="fixed inset-0 z-[-15]"> {/* Parent for random lightning */}
              <ThunderstormBackground /> {/* z-index is effectively -15 if its internal structure doesn't add more */}
            </div>
            <InteractiveLightning /> {/* z-index is -z-[5] in its own definition, captures pointer events */}
            
            <MouseCircle /> {/* This is likely a custom cursor, should be high z-index */}
            
            <main className="relative z-20"> {/* Main content on top */}
              {children}
            </main>
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
