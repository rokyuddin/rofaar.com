import { config } from "dotenv"
config({ path: ".env.local" })

import bcrypt from "bcryptjs"
import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { eq } from "drizzle-orm"
import { admins, products } from "../lib/db/schema"

async function main() {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error("DATABASE_URL is not set")

  const sql = neon(url)
  const db = drizzle(sql)

  const email = "rofaar.official@gmail.com"
  const passwordHash = await bcrypt.hash("1234", 10)

  const existing = await db.select().from(admins).where(eq(admins.email, email)).limit(1)
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

  const sampleProducts = [
    {
      slug: "parents-islamic-gift-combo",
      name: "Rofaar Parents’ Islamic Gift Combo",
      description:
        "A thoughtful gift for the two people who mean the most. Prayer essentials presented with care—ready to give for Eid, Ramadan, or any moment of gratitude.",
      price: "4500.00",
      compareAtPrice: "5200.00",
      imageUrl: "/products/parents-combo.svg",
      category: "Gift Combos",
      badge: "Bestseller",
      stock: 40,
      featured: true,
    },
    {
      slug: "gift-of-barakah-for-parents",
      name: "Gift of Barakah — For Parents",
      description:
        "A refined Islamic gifting set designed for parents. Meaningful, useful, and presented with Rofaar’s calm premium aesthetic.",
      price: "3900.00",
      compareAtPrice: "4500.00",
      imageUrl: "/products/barakah-set.svg",
      category: "Gift Combos",
      badge: "Featured",
      stock: 35,
      featured: true,
    },
    {
      slug: "prayer-gratitude-gift-set",
      name: "Prayer & Gratitude Gift Set",
      description:
        "An elegant set for prayerful everyday living. Ideal when you want something beautiful, practical, and respectful.",
      price: "3200.00",
      compareAtPrice: "3600.00",
      imageUrl: "/products/prayer-set.svg",
      category: "Prayer Essentials",
      badge: "New",
      stock: 50,
      featured: true,
    },
    {
      slug: "premium-prayer-mat-pair",
      name: "Premium Prayer Mat Pair",
      description:
        "A soft, carefully finished pair of prayer mats—one for each parent. Warm tones that suit Rofaar’s ivory and copper palette.",
      price: "2800.00",
      compareAtPrice: null,
      imageUrl: "/products/prayer-mats.svg",
      category: "Prayer Essentials",
      badge: null,
      stock: 60,
      featured: false,
    },
    {
      slug: "tasbih-gift-box",
      name: "Tasbih Gift Box",
      description:
        "Prayer beads presented in a neat gift-ready box. A simple, sincere add-on or standalone gift.",
      price: "850.00",
      compareAtPrice: "990.00",
      imageUrl: "/products/tasbih.svg",
      category: "Accessories",
      badge: "Gift Ready",
      stock: 80,
      featured: false,
    },
    {
      slug: "eid-family-hamper",
      name: "Eid Family Hamper",
      description:
        "A warm Eid gifting selection with Rofaar packaging and a short thank-you card. Perfect for family visits.",
      price: "5500.00",
      compareAtPrice: "6200.00",
      imageUrl: "/products/eid-hamper.svg",
      category: "Hampers",
      badge: "Seasonal",
      stock: 25,
      featured: true,
    },
  ]

  for (const product of sampleProducts) {
    const found = await db
      .select()
      .from(products)
      .where(eq(products.slug, product.slug))
      .limit(1)

    if (found.length === 0) {
      await db.insert(products).values(product)
      console.log("Product created:", product.slug)
    } else {
      await db.update(products).set(product).where(eq(products.slug, product.slug))
      console.log("Product updated:", product.slug)
    }
  }

  console.log("Seed complete")
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
