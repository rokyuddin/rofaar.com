import { config } from "dotenv"
config({ path: ".env.local" })

import bcrypt from "bcryptjs"
import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { eq, inArray } from "drizzle-orm"
import {
  admins,
  banners,
  categories,
  pages,
  products,
  siteSettings,
} from "../lib/db/schema"

async function main() {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error("DATABASE_URL is not set")

  const sql = neon(url)
  const db = drizzle(sql)

  // 1. Admin account
  const email = "rofaar.official@gmail.com"
  const passwordHash = await bcrypt.hash("1234", 10)

  const existing = await db
    .select()
    .from(admins)
    .where(eq(admins.email, email))
    .limit(1)
  if (existing.length === 0) {
    await db.insert(admins).values({
      email,
      passwordHash,
      name: "Rofaar Admin",
    })
    console.log("Admin created:", email)
  } else {
    await db
      .update(admins)
      .set({ passwordHash, name: "Rofaar Admin" })
      .where(eq(admins.email, email))
    console.log("Admin updated:", email)
  }

  // 2. Remove legacy demo products if any
  const oldDemoSlugs = [
    "parents-islamic-gift-combo",
    "gift-of-barakah-for-parents",
    "prayer-gratitude-gift-set",
    "premium-prayer-mat-pair",
    "tasbih-gift-box",
    "eid-family-hamper",
  ]
  await db.delete(products).where(inArray(products.slug, oldDemoSlugs))
  console.log("Cleaned up legacy demo products.")

  // 3. Real 5 Premium Islamic Combo Products
  const realCombos = [
    {
      slug: "the-parents-prayer-combo",
      name: "The Parents' Prayer Combo",
      description:
        "A premium everyday prayer gift designed specifically for both parents. Includes 2 premium prayer mats, 2 premium tasbihs, 2 matching prayer mat bags, 1 luxury rigid gift box, and 1 personalized parents' greeting card.",
      price: "4950.00",
      compareAtPrice: "5800.00",
      imageUrl:
        "https://pub-ece99fd7441a42429b3f439d5d1c4da2.r2.dev/products/the-parents-prayer-combo.jpg",
      category: "Gift Combos",
      badge: "Flagship",
      stock: 50,
      featured: true,
    },
    {
      slug: "the-gift-of-barakah-combo",
      name: "The Gift of Barakah Combo",
      description:
        "A thoughtful Islamic gift set for Eid, Ramadan, and family occasions. Includes 2 premium prayer mats, 2 tasbihs, 1 premium Holy Quran, 2 elegant Quran covers, 1 Eid/Ramadan greeting card, and 1 luxury gift box.",
      price: "6500.00",
      compareAtPrice: "7500.00",
      imageUrl:
        "https://pub-ece99fd7441a42429b3f439d5d1c4da2.r2.dev/products/the-gift-of-barakah-combo.jpg",
      category: "Gift Combos",
      badge: "Eid & Ramadan",
      stock: 40,
      featured: true,
    },
    {
      slug: "the-mother-and-father-worship-combo",
      name: "The Mother & Father Worship Combo",
      description:
        "A coordinated prayer set designed thoughtfully around the daily worship needs of both parents. Includes 2 premium prayer mats, 1 prayer garment for Mother, 1 prayer cap for Father, 2 tasbihs, 2 matching storage pouches, and 1 premium presentation box.",
      price: "7200.00",
      compareAtPrice: "8400.00",
      imageUrl:
        "https://pub-ece99fd7441a42429b3f439d5d1c4da2.r2.dev/products/the-mother-and-father-worship-combo.jpg",
      category: "Gift Combos",
      badge: "Popular",
      stock: 35,
      featured: true,
    },
    {
      slug: "the-premium-ibadah-combo",
      name: "The Premium Ibadah Combo",
      description:
        "An elevated collection of prayer essentials for parents who appreciate thoughtful details and craftsmanship. Includes 2 extra-premium prayer mats, 2 premium tasbihs, 2 digital tasbih counters, 1 handcrafted wooden Quran stand, 1 premium gift box with protective inserts, and 1 handwritten-style appreciation card.",
      price: "8500.00",
      compareAtPrice: "9800.00",
      imageUrl:
        "https://pub-ece99fd7441a42429b3f439d5d1c4da2.r2.dev/products/the-premium-ibadah-combo.jpg",
      category: "Gift Combos",
      badge: "Luxury",
      stock: 30,
      featured: true,
    },
    {
      slug: "the-forever-grateful-parents-combo",
      name: "The Forever Grateful Parents Combo",
      description:
        "An emotional, signature luxury gift expressing enduring love and gratitude to parents. Includes 2 premium prayer mats, 1 premium gilded Quran with cover, 2 elegant tasbihs, 1 framed gratitude keepsake for parents, 1 personalized gift card, and 1 luxury velvet keepsake box.",
      price: "9900.00",
      compareAtPrice: "11500.00",
      imageUrl:
        "https://pub-ece99fd7441a42429b3f439d5d1c4da2.r2.dev/products/the-forever-grateful-parents-combo.jpg",
      category: "Gift Combos",
      badge: "Signature",
      stock: 25,
      featured: true,
    },
  ]

  for (const product of realCombos) {
    const found = await db
      .select()
      .from(products)
      .where(eq(products.slug, product.slug))
      .limit(1)

    if (found.length === 0) {
      await db.insert(products).values(product)
      console.log("Product created:", product.slug)
    } else {
      await db
        .update(products)
        .set(product)
        .where(eq(products.slug, product.slug))
      console.log("Product updated:", product.slug)
    }
  }

  // 4. Seed Dynamic Categories
  const initialCategories = [
    {
      name: "Gift Combos",
      slug: "gift-combos",
      description: "Curated luxury gift bundles for parents and loved ones",
      icon: "gift",
      sortOrder: 1,
      isActive: true,
    },
    {
      name: "Prayer Essentials",
      slug: "prayer-essentials",
      description: "Premium prayer mats, garments, and devotion items",
      icon: "moon",
      sortOrder: 2,
      isActive: true,
    },
    {
      name: "Hampers",
      slug: "hampers",
      description: "Complete festive hampers for Eid, Ramadan, and weddings",
      icon: "package",
      sortOrder: 3,
      isActive: true,
    },
    {
      name: "Accessories",
      slug: "accessories",
      description: "Tasbihs, digital counters, and carved Quran stands",
      icon: "sparkles",
      sortOrder: 4,
      isActive: true,
    },
  ]

  for (const cat of initialCategories) {
    const found = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, cat.slug))
      .limit(1)

    if (found.length === 0) {
      await db.insert(categories).values(cat)
      console.log("Category created:", cat.slug)
    } else {
      await db.update(categories).set(cat).where(eq(categories.slug, cat.slug))
      console.log("Category updated:", cat.slug)
    }
  }

  // 5. Seed Hero Banner
  const heroBanners = [
    {
      title: "Thoughtful Islamic gifts for the people who mean the most",
      subtitle:
        "Premium Parents’ Islamic Gift Combos and prayerful essentials, handcrafted and delivered across Bangladesh with quiet care.",
      badge: "FAITH, REFINED",
      ctaText: "Shop Combos",
      ctaLink: "/products?category=Gift%20Combos",
      secondaryCtaText: "Explore Catalog",
      secondaryCtaLink: "/products",
      imageUrl:
        "https://pub-ece99fd7441a42429b3f439d5d1c4da2.r2.dev/products/the-parents-prayer-combo.jpg",
      bgGradient:
        "linear-gradient(160deg,#f7f0e4_0%,#efe0cc_45%,#e2c9a8_100%)",
      sortOrder: 1,
      isActive: true,
    },
  ]

  const existingBanners = await db.select().from(banners).limit(1)
  if (existingBanners.length === 0) {
    await db.insert(banners).values(heroBanners[0])
    console.log("Hero banner created")
  }

  console.log("Seed complete — all dynamic data active.")
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
