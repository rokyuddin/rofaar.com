"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FormEvent, useEffect, useState } from "react"
import { ArrowRight, Search, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCartStore } from "@/lib/cart-store"
import type { HeaderSettings } from "@/lib/site-settings"
import type { Category } from "@/lib/db/schema"
import { cn } from "@/lib/utils"

interface SiteHeaderProps {
  settings?: HeaderSettings
  categories?: Category[]
}

export function SiteHeader({ settings, categories = [] }: SiteHeaderProps) {
  const router = useRouter()
  const totalItems = useCartStore((s) => s.totalItems())
  const [mounted, setMounted] = useState(false)
  const [query, setQuery] = useState("")

  useEffect(() => {
    setMounted(true)
  }, [])

  function onSearch(e: FormEvent) {
    e.preventDefault()
    const q = query.trim()
    router.push(q ? `/products?q=${encodeURIComponent(q)}` : "/products")
  }

  const announcementEnabled = settings?.announcementEnabled ?? true
  const announcementText =
    settings?.announcementText ||
    "✨ Free premium gift packaging & greeting card with every Parents' Combo • Nationwide Delivery"
  const announcementLink = settings?.announcementLink || "/products?category=Gift%20Combos"
  const announcementBg = settings?.announcementBg || "#342318"
  const announcementTextColor = settings?.announcementTextColor || "#f7f0e4"

  const navLinks = settings?.navLinks && settings.navLinks.length > 0
    ? settings.navLinks
    : [
        { label: "Gift Combos", href: "/products?category=Gift%20Combos", highlight: true },
        { label: "Prayer Essentials", href: "/products?category=Prayer%20Essentials" },
        { label: "Hampers", href: "/products?category=Hampers" },
        { label: "About Us", href: "/pages/about-us" },
        { label: "All Products", href: "/products" },
      ]

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-[#fff8ef]/95 backdrop-blur-md">
      {/* Dynamic Announcement Bar */}
      {announcementEnabled && announcementText && (
        <div
          style={{ backgroundColor: announcementBg, color: announcementTextColor }}
          className="relative px-4 py-2 text-center text-xs font-medium tracking-wide transition-colors"
        >
          {announcementLink ? (
            <Link
              href={announcementLink}
              className="inline-flex items-center justify-center gap-1.5 transition-opacity hover:opacity-90"
            >
              <span>{announcementText}</span>
              <ArrowRight className="size-3" />
            </Link>
          ) : (
            <span>{announcementText}</span>
          )}
        </div>
      )}

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3 sm:gap-5">
          <Link href="/" className="shrink-0 flex items-center gap-2.5">
            <Image
              src="/logo.jpg"
              alt={settings?.logoText || "Rofaar"}
              width={48}
              height={56}
              className="h-11 w-auto object-contain"
              priority
            />
            <span className="font-heading text-2xl font-bold tracking-tight text-[#342318] hidden sm:inline-block">
              {settings?.logoText || "Rofaar"}
            </span>
          </Link>

          {/* Desktop Search */}
          {settings?.showSearch !== false && (
            <form
              onSubmit={onSearch}
              className="hidden min-w-0 flex-1 items-center gap-2 md:flex"
            >
              <div className="relative w-full max-w-xl">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search thoughtful gifts…"
                  className="pl-9 bg-white/70 focus:bg-white"
                  aria-label="Search products"
                />
              </div>
              <Button type="submit" size="sm" variant="secondary">
                Search
              </Button>
            </form>
          )}

          <div className="ml-auto flex items-center gap-3">
            <p className="hidden text-xs font-medium text-muted-foreground lg:block">
              {settings?.deliveryTagline || "Delivering across Bangladesh"}
            </p>
            {settings?.showCart !== false && (
              <Link
                href="/cart"
                className={cn(
                  "relative inline-flex size-10 items-center justify-center rounded-full bg-white/80 border border-border/60 text-foreground transition-all hover:bg-white hover:text-primary hover:shadow-xs"
                )}
                aria-label="Cart"
              >
                <ShoppingBag className="size-5" />
                {mounted && totalItems > 0 ? (
                  <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground shadow-xs animate-in zoom-in-50">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                ) : null}
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Search */}
        {settings?.showSearch !== false && (
          <form onSubmit={onSearch} className="flex items-center gap-2 md:hidden">
            <div className="relative w-full">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search thoughtful gifts…"
                className="pl-9 bg-white/70"
                aria-label="Search products"
              />
            </div>
            <Button type="submit" size="icon-sm" variant="secondary" aria-label="Search">
              <Search className="size-4" />
            </Button>
          </form>
        )}

        {/* Dynamic Navigation Menu */}
        <nav className="flex items-center gap-4 overflow-x-auto pb-1 text-sm whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={cn(
                "font-medium transition-colors hover:text-foreground",
                link.highlight
                  ? "text-primary font-semibold hover:text-primary/90"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
          {/* Also render active categories if not present in nav links */}
          {categories
            .filter(
              (cat) =>
                !navLinks.some(
                  (nl) =>
                    nl.label.toLowerCase() === cat.name.toLowerCase() ||
                    nl.href.includes(encodeURIComponent(cat.name))
                )
            )
            .map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${encodeURIComponent(cat.name)}`}
                className="text-muted-foreground font-medium transition-colors hover:text-foreground"
              >
                {cat.name}
              </Link>
            ))}
        </nav>
      </div>
    </header>
  )
}
