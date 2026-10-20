export const STORE_CATEGORIES = [
  "Gift Combos",
  "Prayer Essentials",
  "Hampers",
  "Accessories",
] as const

export type StoreCategory = (typeof STORE_CATEGORIES)[number]

export const CATEGORY_ICON_LINKS = [
  {
    label: "Gift Combos",
    href: "/products?category=Gift%20Combos",
    icon: "gift",
  },
  {
    label: "Prayer",
    href: "/products?category=Prayer%20Essentials",
    icon: "moon",
  },
  {
    label: "Hampers",
    href: "/products?category=Hampers",
    icon: "package",
  },
  {
    label: "Accessories",
    href: "/products?category=Accessories",
    icon: "sparkles",
  },
  {
    label: "Eid",
    href: "/products?q=eid",
    icon: "hand-heart",
  },
  {
    label: "Parents",
    href: "/products?q=parents",
    icon: "heart",
  },
  {
    label: "Same Day",
    href: "/products",
    icon: "zap",
  },
  {
    label: "All Gifts",
    href: "/products",
    icon: "shopping-bag",
  },
] as const

export const OCCASION_CARDS = [
  {
    title: "Eid",
    href: "/products?q=eid",
    tone: "bg-[#f3d9c4]",
  },
  {
    title: "Ramadan",
    href: "/products?category=Prayer%20Essentials",
    tone: "bg-[#e8c9a8]",
  },
  {
    title: "Parents",
    href: "/products?q=parents",
    tone: "bg-[#dcc4a4]",
  },
  {
    title: "Wedding",
    href: "/products?category=Hampers",
    tone: "bg-[#c9b18f]",
  },
  {
    title: "Thank You",
    href: "/products?category=Gift%20Combos",
    tone: "bg-[#b89a72]",
  },
] as const

export function discountPercent(
  price: string | number,
  compareAt: string | number | null | undefined
): number | null {
  if (compareAt == null) return null
  const p = typeof price === "string" ? Number.parseFloat(price) : price
  const c =
    typeof compareAt === "string" ? Number.parseFloat(compareAt) : compareAt
  if (Number.isNaN(p) || Number.isNaN(c) || c <= p) return null
  return Math.round(((c - p) / c) * 100)
}

export function toNumber(value: string | number): number {
  return typeof value === "string" ? Number.parseFloat(value) : value
}
