import type { Metadata } from "next"
import { Cormorant_Garamond, Manrope } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import "./globals.css"

const fontHeading = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-heading",
})

const fontSans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: {
    default: "Rofaar — Faith, Refined.",
    template: "%s · Rofaar",
  },
  description:
    "Thoughtful Islamic gifts for the people who mean the most. Premium Parents’ Islamic Gift Combos for Bangladesh.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(fontSans.variable, fontHeading.variable, "antialiased")}
    >
      <body>
        <ThemeProvider>
          <TooltipProvider>
            {children}
            <Toaster richColors position="top-center" />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
