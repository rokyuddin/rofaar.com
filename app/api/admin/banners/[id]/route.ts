import { NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { banners } from "@/lib/db/schema"
import { requireAdmin } from "@/lib/auth"

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params
    const bannerId = Number(id)
    if (!bannerId) {
      return NextResponse.json({ error: "Invalid banner ID" }, { status: 400 })
    }

    const body = await req.json()
    const updates: Partial<typeof banners.$inferInsert> = {
      updatedAt: new Date(),
    }

    if (body.title !== undefined) updates.title = String(body.title).trim()
    if (body.subtitle !== undefined) updates.subtitle = String(body.subtitle).trim()
    if (body.badge !== undefined) updates.badge = body.badge ? String(body.badge).trim() : null
    if (body.ctaText !== undefined) updates.ctaText = String(body.ctaText).trim()
    if (body.ctaLink !== undefined) updates.ctaLink = String(body.ctaLink).trim()
    if (body.secondaryCtaText !== undefined) {
      updates.secondaryCtaText = body.secondaryCtaText ? String(body.secondaryCtaText).trim() : null
    }
    if (body.secondaryCtaLink !== undefined) {
      updates.secondaryCtaLink = body.secondaryCtaLink ? String(body.secondaryCtaLink).trim() : null
    }
    if (body.imageUrl !== undefined) {
      updates.imageUrl = body.imageUrl ? String(body.imageUrl).trim() : null
    }
    if (body.bgGradient !== undefined) updates.bgGradient = String(body.bgGradient).trim()
    if (body.sortOrder !== undefined) updates.sortOrder = Number(body.sortOrder)
    if (body.isActive !== undefined) updates.isActive = Boolean(body.isActive)

    const updated = await db
      .update(banners)
      .set(updates)
      .where(eq(banners.id, bannerId))
      .returning()

    if (updated.length === 0) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 })
    }

    return NextResponse.json(updated[0])
  } catch (err: any) {
    if (err?.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("Update banner error:", err)
    return NextResponse.json({ error: "Failed to update banner" }, { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params
    const bannerId = Number(id)
    if (!bannerId) {
      return NextResponse.json({ error: "Invalid banner ID" }, { status: 400 })
    }

    const deleted = await db
      .delete(banners)
      .where(eq(banners.id, bannerId))
      .returning()

    if (deleted.length === 0) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    if (err?.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("Delete banner error:", err)
    return NextResponse.json({ error: "Failed to delete banner" }, { status: 500 })
  }
}
