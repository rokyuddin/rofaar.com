"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FormEvent, useEffect, useState } from "react"
import { Search, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCartStore } from "@/lib/cart-store"
import { STORE_CATEGORIES } from "@/lib/store-catalog"
import { cn } from "@/lib/utils"

export function SiteHeader() {
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

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-[#fff8ef]/95 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3 sm:gap-5">
          <Link href="/" className="shrink-0">
            <Image
              src="/logo.jpg"
              alt="Rofaar"
              width={48}
              height={56}
              className="h-11 w-auto object-contain"
              priority
            />
          </Link>

          <form
            onSubmit={onSearch}
            className="hidden min-w-0 flex-1 items-center gap-2 md:flex"
          >
            <div className="relative w-full max-w-xl">
              <Search className="pointer-events-none absolute top-1/2 left-0 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search thoughtful gifts…"
                className="pl-6"
                aria-label="Search products"
              />
            </div>
            <Button type="submit" size="sm" variant="secondary">
              Search
            </Button>
          </form>

          <div className="ml-auto flex items-center gap-2">
            <p className="hidden text-xs text-muted-foreground lg:block">
              Delivering across Bangladesh
            </p>
            <Link
              href="/cart"
              className={cn(
                "relative inline-flex size-10 items-center justify-center text-foreground transition-colors hover:text-primary"
              )}
              aria-label="Cart"
            >
              <ShoppingBag className="size-5" />
              {mounted && totalItems > 0 ? (
                <span className="absolute top-1 right-1 flex size-4 items-center justify-center bg-primary text-[10px] font-semibold text-primary-foreground">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              ) : null}
            </Link>
          </div>
        </div>

        <form onSubmit={onSearch} className="flex items-center gap-2 md:hidden">
          <div className="relative w-full">
            <Search className="pointer-events-none absolute top-1/2 left-0 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search thoughtful gifts…"
              className="pl-6"
              aria-label="Search products"
            />
          </div>
          <Button type="submit" size="icon-sm" variant="secondary" aria-label="Search">
            <Search className="size-4" />
          </Button>
        </form>

        <nav className="flex gap-4 overflow-x-auto pb-1 text-sm whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {STORE_CATEGORIES.map((category) => (
            <Link
              key={category}
              href={`/products?category=${encodeURIComponent(category)}`}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {category}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
