import Link from "next/link"
import type { FooterSettings } from "@/lib/site-data"

interface SiteFooterProps {
  settings?: FooterSettings
}

export function SiteFooter({ settings }: SiteFooterProps) {
  const brandName = settings?.brandName || "Rofaar"
  const brandTagline = settings?.brandTagline || "Faith, Refined."
  const aboutText =
    settings?.aboutText ||
    "Faith, Refined. Thoughtful Islamic gifts for the people who mean the most—crafted for Bangladesh with calm, premium care."

  const columns = settings?.columns && settings.columns.length > 0
    ? settings.columns
    : [
        {
          title: "Shop",
          links: [
            { label: "Gift Combos", href: "/products?category=Gift%20Combos" },
            { label: "Prayer Essentials", href: "/products?category=Prayer%20Essentials" },
            { label: "Hampers", href: "/products?category=Hampers" },
            { label: "All Products", href: "/products" },
          ],
        },
        {
          title: "Information",
          links: [
            { label: "About Our Story", href: "/pages/about-us" },
            { label: "Shipping & Delivery", href: "/pages/shipping-policy" },
            { label: "Refund & Exchange", href: "/pages/refund-policy" },
            { label: "Terms & Conditions", href: "/pages/terms-and-conditions" },
            { label: "Privacy Policy", href: "/pages/privacy-policy" },
          ],
        },
        {
          title: "Concierge",
          links: [
            { label: "Dhaka, Bangladesh", href: "#" },
            { label: "hello@rofaar.com", href: "mailto:hello@rofaar.com" },
            { label: "+880 17 0000 0000", href: "tel:+8801700000000" },
          ],
        },
      ]

  const copyrightText =
    settings?.copyrightText ||
    `© ${new Date().getFullYear()} ${brandName}. All rights reserved. ${brandTagline}`

  return (
    <footer className="mt-auto border-t border-border bg-[#fff8ef]">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        {/* Brand Column */}
        <div className="flex flex-col gap-3 md:col-span-1">
          <Link href="/" className="flex flex-col gap-0.5">
            <span className="font-heading text-2xl font-bold tracking-tight text-[#342318]">
              {brandName}
            </span>
            <span className="text-xs font-semibold tracking-[0.2em] text-[#a85d12] uppercase">
              {brandTagline}
            </span>
          </Link>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            {aboutText}
          </p>

          {/* Social Links */}
          {settings?.socialLinks && (
            <div className="mt-2 flex items-center gap-3 text-xs font-medium text-primary">
              {settings.socialLinks.facebook && (
                <a
                  href={settings.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Facebook
                </a>
              )}
              {settings.socialLinks.instagram && (
                <a
                  href={settings.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Instagram
                </a>
              )}
              {settings.socialLinks.whatsapp && (
                <a
                  href={settings.socialLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  WhatsApp
                </a>
              )}
            </div>
          )}
        </div>

        {/* Dynamic Columns */}
        {columns.map((col, idx) => (
          <div key={idx} className="flex flex-col gap-3">
            <p className="text-xs font-bold tracking-widest text-foreground uppercase">
              {col.title}
            </p>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              {col.links.map((link, lIdx) => (
                <Link
                  key={lIdx}
                  href={link.href}
                  className="transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-border/70">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:px-6">
          <p>{copyrightText}</p>
          <div className="flex items-center gap-4">
            <Link href="/pages/privacy-policy" className="hover:underline">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/pages/terms-and-conditions" className="hover:underline">
              Terms & Conditions
            </Link>
            <span>•</span>
            <Link href="/pages/refund-policy" className="hover:underline">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
