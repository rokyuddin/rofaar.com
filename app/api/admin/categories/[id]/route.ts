import { NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { categories } from "@/lib/db/schema"
import { requireAdmin } from "@/lib/auth"

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params
    const catId = Number(id)
    if (!catId) {
      return NextResponse.json({ error: "Invalid category ID" }, { status: 400 })
    }

    const body = await req.json()
    const updates: Partial<typeof categories.$inferInsert> = {
      updatedAt: new Date(),
    }

    if (body.name !== undefined) updates.name = String(body.name).trim()
    if (body.slug !== undefined) {
      updates.slug = String(body.slug)
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
    }
    if (body.description !== undefined) updates.description = String(body.description).trim()
    if (body.icon !== undefined) updates.icon = String(body.icon).trim()
    if (body.imageUrl !== undefined) {
      updates.imageUrl = body.imageUrl ? String(body.imageUrl).trim() : null
    }
    if (body.sortOrder !== undefined) updates.sortOrder = Number(body.sortOrder)
    if (body.isActive !== undefined) updates.isActive = Boolean(body.isActive)

    const updated = await db
      .update(categories)
      .set(updates)
      .where(eq(categories.id, catId))
      .returning()

    if (updated.length === 0) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json(updated[0])
  } catch (err: any) {
    if (err?.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("Update category error:", err)
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params
    const catId = Number(id)
    if (!catId) {
      return NextResponse.json({ error: "Invalid category ID" }, { status: 400 })
    }

    const deleted = await db
      .delete(categories)
      .where(eq(categories.id, catId))
      .returning()

    if (deleted.length === 0) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    if (err?.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("Delete category error:", err)
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 })
  }
}
