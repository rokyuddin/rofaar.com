import { asc, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { banners, categories, pages, siteSettings } from "@/lib/db/schema"

export interface HeaderSettings {
  announcementEnabled: boolean
  announcementText: string
  announcementLink: string
  announcementBg: string
  announcementTextColor: string
  navLinks: Array<{ label: string; href: string; highlight?: boolean }>
  showSearch: boolean
  showCart: boolean
  logoText: string
  deliveryTagline: string
}

export interface FooterSettings {
  brandName: string
  brandTagline: string
  aboutText: string
  columns: Array<{
    title: string
    links: Array<{ label: string; href: string }>
  }>
  socialLinks: {
    facebook?: string
    instagram?: string
    whatsapp?: string
    youtube?: string
  }
  copyrightText: string
}

export interface GeneralSettings {
  storeName: string
  storeTagline: string
  currencySymbol: string
  contactEmail: string
  contactPhone: string
  address: string
  insideDhakaShipping: number
  outsideDhakaShipping: number
  freeShippingThreshold: number
}

const DEFAULT_HEADER: HeaderSettings = {
  announcementEnabled: true,
  announcementText:
    "✨ Free premium gift packaging & greeting card with every Parents' Combo • Nationwide Delivery",
  announcementLink: "/products?category=Gift%20Combos",
  announcementBg: "#342318",
  announcementTextColor: "#f7f0e4",
  navLinks: [
    { label: "Gift Combos", href: "/products?category=Gift%20Combos", highlight: true },
    { label: "Prayer Essentials", href: "/products?category=Prayer%20Essentials" },
    { label: "Hampers", href: "/products?category=Hampers" },
    { label: "About Us", href: "/pages/about-us" },
    { label: "All Products", href: "/products" },
  ],
  showSearch: true,
  showCart: true,
  logoText: "Rofaar",
  deliveryTagline: "Delivering across Bangladesh",
}

const DEFAULT_FOOTER: FooterSettings = {
  brandName: "Rofaar",
  brandTagline: "Faith, Refined.",
  aboutText:
    "Faith, Refined. Thoughtful Islamic gift combos for parents and loved ones—curated with calm, premium care for Bangladesh.",
  columns: [
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
        { label: "WhatsApp Support", href: "https://wa.me/8801700000000" },
      ],
    },
  ],
  socialLinks: {
    facebook: "https://facebook.com/rofaar",
    instagram: "https://instagram.com/rofaar",
    whatsapp: "https://wa.me/8801700000000",
  },
  copyrightText: "© 2026 Rofaar. All rights reserved. Faith, Refined.",
}

export const DEFAULT_GENERAL: GeneralSettings = {
  storeName: "Rofaar",
  storeTagline: "Faith, Refined.",
  currencySymbol: "৳",
  contactEmail: "hello@rofaar.com",
  contactPhone: "+880 17 0000 0000",
  address: "Banani, Dhaka, Bangladesh",
  insideDhakaShipping: 80,
  outsideDhakaShipping: 150,
  freeShippingThreshold: 5000,
}

export async function getHeaderSettings(): Promise<HeaderSettings> {
  try {
    const res = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, "header"))
      .limit(1)

    if (res.length > 0 && res[0].value) {
      return { ...DEFAULT_HEADER, ...(res[0].value as HeaderSettings) }
    }
  } catch (err) {
    console.error("Error fetching header settings:", err)
  }
  return DEFAULT_HEADER
}

export async function getFooterSettings(): Promise<FooterSettings> {
  try {
    const res = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, "footer"))
      .limit(1)

    if (res.length > 0 && res[0].value) {
      return { ...DEFAULT_FOOTER, ...(res[0].value as FooterSettings) }
    }
  } catch (err) {
    console.error("Error fetching footer settings:", err)
  }
  return DEFAULT_FOOTER
}

export async function getGeneralSettings(): Promise<GeneralSettings> {
  try {
    const res = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, "general"))
      .limit(1)

    if (res.length > 0 && res[0].value) {
      return { ...DEFAULT_GENERAL, ...(res[0].value as GeneralSettings) }
    }
  } catch (err) {
    console.error("Error fetching general settings:", err)
  }
  return DEFAULT_GENERAL
}

export async function getActiveCategories() {
  try {
    return await db
      .select()
      .from(categories)
      .where(eq(categories.isActive, true))
      .orderBy(asc(categories.sortOrder))
  } catch (err) {
    console.error("Error fetching active categories:", err)
    return []
  }
}

export async function getActiveBanners() {
  try {
    return await db
      .select()
      .from(banners)
      .where(eq(banners.isActive, true))
      .orderBy(asc(banners.sortOrder))
  } catch (err) {
    console.error("Error fetching active banners:", err)
    return []
  }
}

export async function getPageBySlug(slug: string) {
  try {
    const found = await db
      .select()
      .from(pages)
      .where(eq(pages.slug, slug))
      .limit(1)

    return found[0] ?? null
  } catch (err) {
    console.error("Error fetching page:", err)
    return null
  }
}

export interface OccasionCardItem {
  title: string
  href: string
  tone?: string
}

export async function getOccasionCards(): Promise<OccasionCardItem[]> {
  try {
    const res = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, "occasions"))
      .limit(1)

    if (res.length > 0 && Array.isArray(res[0].value)) {
      return res[0].value as OccasionCardItem[]
    }
  } catch (err) {
    console.error("Error fetching occasion cards:", err)
  }
  return [
    { title: "Eid Gifts", href: "/products?q=eid", tone: "bg-[#f3d9c4]" },
    { title: "Ramadan Specials", href: "/products?category=Prayer%20Essentials", tone: "bg-[#e8c9a8]" },
    { title: "For Parents", href: "/products?category=Gift%20Combos", tone: "bg-[#dcc4a4]" },
    { title: "Wedding Blessings", href: "/products?category=Hampers", tone: "bg-[#c9b18f]" },
    { title: "Gratitude & Dua", href: "/products?category=Gift%20Combos", tone: "bg-[#b89a72]" },
  ]
}
