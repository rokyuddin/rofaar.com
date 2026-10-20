import { NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { pages } from "@/lib/db/schema"
import { requireAdmin } from "@/lib/auth"

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params
    const pageId = Number(id)
    if (!pageId) {
      return NextResponse.json({ error: "Invalid page ID" }, { status: 400 })
    }

    const body = await req.json()
    const updates: Partial<typeof pages.$inferInsert> = {
      updatedAt: new Date(),
    }

    if (body.title !== undefined) updates.title = String(body.title).trim()
    if (body.slug !== undefined) {
      updates.slug = String(body.slug)
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
    }
    if (body.content !== undefined) updates.content = String(body.content).trim()
    if (body.excerpt !== undefined) updates.excerpt = String(body.excerpt).trim()
    if (body.metaTitle !== undefined) {
      updates.metaTitle = body.metaTitle ? String(body.metaTitle).trim() : null
    }
    if (body.metaDescription !== undefined) {
      updates.metaDescription = body.metaDescription ? String(body.metaDescription).trim() : null
    }
    if (body.isPublished !== undefined) updates.isPublished = Boolean(body.isPublished)

    const updated = await db
      .update(pages)
      .set(updates)
      .where(eq(pages.id, pageId))
      .returning()

    if (updated.length === 0) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 })
    }

    return NextResponse.json(updated[0])
  } catch (err: any) {
    if (err?.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("Update page error:", err)
    return NextResponse.json({ error: "Failed to update page" }, { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id } = await params
    const pageId = Number(id)
    if (!pageId) {
      return NextResponse.json({ error: "Invalid page ID" }, { status: 400 })
    }

    const deleted = await db
      .delete(pages)
      .where(eq(pages.id, pageId))
      .returning()

    if (deleted.length === 0) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    if (err?.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("Delete page error:", err)
    return NextResponse.json({ error: "Failed to delete page" }, { status: 500 })
  }
}
