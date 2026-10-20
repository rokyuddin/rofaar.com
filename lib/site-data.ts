import { asc, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { banners, categories, pages, siteSettings } from "@/lib/db/schema"

import {
  DEFAULT_FOOTER,
  DEFAULT_GENERAL,
  DEFAULT_HEADER,
  DEFAULT_OCCASION_CARDS,
  type FooterSettings,
  type GeneralSettings,
  type HeaderSettings,
  type OccasionCardItem,
} from "./site-settings"

export * from "./site-settings"

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
  return DEFAULT_OCCASION_CARDS
}
