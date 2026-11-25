import type { MetadataRoute } from "next"
import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { pages, products } from "@/lib/db/schema"
import { SITE_URL } from "@/lib/seo"

export const revalidate = 3600

// Category filter URLs (/products?category=…) are left out because /products
// sets its canonical to itself. /about is a redirect to /pages/about-us, which
// is listed with the CMS pages.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [productRows, pageRows] = await Promise.all([
    db
      .select({ slug: products.slug, updatedAt: products.updatedAt })
      .from(products)
      .where(eq(products.isActive, true)),
    db
      .select({ slug: pages.slug, updatedAt: pages.updatedAt })
      .from(pages)
      .where(eq(pages.isPublished, true)),
  ])

  return [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/products`, changeFrequency: "daily", priority: 0.9 },
    ...productRows.map((p) => ({
      url: `${SITE_URL}/products/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...pageRows.map((p) => ({
      url: `${SITE_URL}/pages/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    })),
  ]
}
