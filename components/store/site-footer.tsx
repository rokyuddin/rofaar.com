import Link from "next/link"
import { STORE_CATEGORIES } from "@/lib/store-catalog"

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-[#fff8ef]">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div className="flex flex-col gap-3">
          <p className="font-heading text-2xl font-semibold tracking-tight text-[#342318]">
            Rofaar
          </p>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            Faith, Refined. Thoughtful Islamic gifts for the people who mean the
            most—crafted for Bangladesh with calm, premium care.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold tracking-widest text-foreground uppercase">
            Shop
          </p>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            {STORE_CATEGORIES.map((category) => (
              <Link
                key={category}
                href={`/products?category=${encodeURIComponent(category)}`}
                className="hover:text-foreground"
              >
                {category}
              </Link>
            ))}
            <Link href="/products" className="hover:text-foreground">
              All products
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold tracking-widest text-foreground uppercase">
            Contact
          </p>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <p>Dhaka, Bangladesh</p>
            <a href="mailto:hello@rofaar.com" className="hover:text-foreground">
              hello@rofaar.com
            </a>
            <a href="tel:+8801000000000" className="hover:text-foreground">
              +880 10 0000 0000
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-border/70">
        <p className="mx-auto max-w-7xl px-4 py-4 text-xs text-muted-foreground sm:px-6">
          © {new Date().getFullYear()} Rofaar. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
