import { NextResponse } from "next/server"
import { asc } from "drizzle-orm"
import { db } from "@/lib/db"
import { banners } from "@/lib/db/schema"
import { requireAdmin } from "@/lib/auth"

export async function GET() {
  try {
    await requireAdmin()
    const rows = await db.select().from(banners).orderBy(asc(banners.sortOrder))
    return NextResponse.json(rows)
  } catch (err: any) {
    if (err?.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin()
    const body = await req.json()
    const title = String(body.title ?? "").trim()
    const subtitle = String(body.subtitle ?? "").trim()
    const badge = body.badge ? String(body.badge).trim() : null
    const ctaText = String(body.ctaText ?? "Shop Now").trim()
    const ctaLink = String(body.ctaLink ?? "/products").trim()
    const secondaryCtaText = body.secondaryCtaText ? String(body.secondaryCtaText).trim() : null
    const secondaryCtaLink = body.secondaryCtaLink ? String(body.secondaryCtaLink).trim() : null
    const imageUrl = body.imageUrl ? String(body.imageUrl).trim() : null
    const bgGradient = String(
      body.bgGradient ??
        "linear-gradient(160deg,#f7f0e4_0%,#efe0cc_45%,#e2c9a8_100%)"
    ).trim()
    const sortOrder = Number(body.sortOrder ?? 0)
    const isActive = Boolean(body.isActive ?? true)

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    const inserted = await db
      .insert(banners)
      .values({
        title,
        subtitle,
        badge,
        ctaText,
        ctaLink,
        secondaryCtaText,
        secondaryCtaLink,
        imageUrl,
        bgGradient,
        sortOrder,
        isActive,
      })
      .returning()

    return NextResponse.json(inserted[0], { status: 201 })
  } catch (err: any) {
    if (err?.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("Create banner error:", err)
    return NextResponse.json({ error: "Failed to create banner" }, { status: 500 })
  }
}
