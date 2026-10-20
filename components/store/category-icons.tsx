import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import {
  Gift,
  HandHeart,
  Heart,
  Moon,
  Package,
  ShoppingBag,
  Sparkles,
  Zap,
} from "lucide-react"
import { CATEGORY_ICON_LINKS } from "@/lib/store-catalog"

const ICONS: Record<(typeof CATEGORY_ICON_LINKS)[number]["icon"], LucideIcon> = {
  gift: Gift,
  moon: Moon,
  package: Package,
  sparkles: Sparkles,
  "hand-heart": HandHeart,
  heart: Heart,
  zap: Zap,
  "shopping-bag": ShoppingBag,
}

export function CategoryIcons() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 sm:px-6">
      <div className="flex gap-5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {CATEGORY_ICON_LINKS.map((item) => {
          const Icon = ICONS[item.icon]
          return (
            <Link
              key={item.label}
              href={item.href}
              className="group flex w-20 shrink-0 flex-col items-center gap-2 text-center"
            >
              <span className="flex size-16 items-center justify-center rounded-full border border-[#d6b36a]/50 bg-white text-[#a85d12] shadow-[0_1px_0_rgba(52,35,24,0.04)] transition-transform duration-300 group-hover:-translate-y-0.5">
                <Icon className="size-6 stroke-[1.5]" />
              </span>
              <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
