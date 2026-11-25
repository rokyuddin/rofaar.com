import type { Metadata, Viewport } from "next"
import { Cormorant_Garamond, Manrope } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider } from "@/components/theme-provider"
import { GtmNoScript, GtmScript } from "@/components/analytics/gtm"
import { JsonLd } from "@/components/analytics/json-ld"
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo"
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

// No canonical here: it would make every page point to the home page.
// Search Console / Meta domain verification is done via Cloudflare DNS TXT.
export const metadata: Metadata = {
  title: { default: "Rofaar — Faith, Refined.", template: "%s · Rofaar" },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  keywords: [
    "Islamic gifts Bangladesh",
    "Islamic gift combo",
    "gift for parents",
    "prayer mat",
    "tasbih",
    "hampers",
    "Rofaar",
  ],
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    url: "/",
    title: "Rofaar — Faith, Refined.",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Rofaar — Thoughtful Islamic gifts for the people who mean the most",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rofaar — Faith, Refined.",
    description: SITE_DESCRIPTION,
    images: ["/og.jpg"],
  },
  robots: { index: true, follow: true },
}

// Rofaar Brown, from the brand guideline.
export const viewport: Viewport = {
  themeColor: "#95490d",
}

const organizationLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "OnlineStore",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/brand/icon-512.png`,
      description: SITE_DESCRIPTION,
      areaServed: "BD",
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      publisher: { "@id": `${SITE_URL}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/products?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ],
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
      <head>
        <GtmScript />
      </head>
      <body>
        <GtmNoScript />
        <JsonLd data={organizationLd} />
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
