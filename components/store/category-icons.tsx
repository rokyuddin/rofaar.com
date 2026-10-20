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
import type { Category } from "@/lib/db/schema"

const ICONS: Record<string, LucideIcon> = {
  gift: Gift,
  moon: Moon,
  package: Package,
  sparkles: Sparkles,
  "hand-heart": HandHeart,
  heart: Heart,
  zap: Zap,
  "shopping-bag": ShoppingBag,
}

interface CategoryIconsProps {
  categories?: Category[]
}

export function CategoryIcons({ categories = [] }: CategoryIconsProps) {
  if (categories.length === 0) return null

  return (
    <section className="mx-auto w-full max-w-7xl px-4 sm:px-6">
      <div className="flex gap-5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((item) => {
          const Icon = (item.icon && ICONS[item.icon]) ? ICONS[item.icon] : Gift
          return (
            <Link
              key={item.id}
              href={`/products?category=${encodeURIComponent(item.name)}`}
              className="group flex w-24 shrink-0 flex-col items-center gap-2 text-center"
            >
              <span className="flex size-16 items-center justify-center rounded-2xl border border-[#d6b36a]/40 bg-white text-[#a85d12] shadow-xs transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary group-hover:shadow-md">
                <Icon className="size-6 stroke-[1.5]" />
              </span>
              <span className="text-xs font-semibold text-[#342318] group-hover:text-primary">
                {item.name}
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
