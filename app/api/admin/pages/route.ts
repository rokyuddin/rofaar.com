import { NextResponse } from "next/server"
import { desc } from "drizzle-orm"
import { db } from "@/lib/db"
import { pages } from "@/lib/db/schema"
import { requireAdmin } from "@/lib/auth"

export async function GET() {
  try {
    await requireAdmin()
    const rows = await db.select().from(pages).orderBy(desc(pages.updatedAt))
    return NextResponse.json(rows)
  } catch (err: any) {
    if (err?.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json({ error: "Failed to fetch pages" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin()
    const body = await req.json()
    const title = String(body.title ?? "").trim()
    const slug = String(body.slug ?? "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
    const content = String(body.content ?? "").trim()
    const excerpt = String(body.excerpt ?? "").trim()
    const metaTitle = body.metaTitle ? String(body.metaTitle).trim() : null
    const metaDescription = body.metaDescription ? String(body.metaDescription).trim() : null
    const isPublished = Boolean(body.isPublished ?? true)

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "Title, slug, and content are required" },
        { status: 400 }
      )
    }

    const inserted = await db
      .insert(pages)
      .values({
        title,
        slug,
        content,
        excerpt,
        metaTitle,
        metaDescription,
        isPublished,
      })
      .returning()

    return NextResponse.json(inserted[0], { status: 201 })
  } catch (err: any) {
    if (err?.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("Create page error:", err)
    return NextResponse.json({ error: "Failed to create page" }, { status: 500 })
  }
}
