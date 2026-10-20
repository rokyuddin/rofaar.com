import { NextResponse } from "next/server"
import { asc } from "drizzle-orm"
import { db } from "@/lib/db"
import { categories } from "@/lib/db/schema"
import { requireAdmin } from "@/lib/auth"

export async function GET() {
  try {
    await requireAdmin()
    const rows = await db.select().from(categories).orderBy(asc(categories.sortOrder))
    return NextResponse.json(rows)
  } catch (err: any) {
    if (err?.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin()
    const body = await req.json()
    const name = String(body.name ?? "").trim()
    const slug = String(body.slug ?? "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
    const description = String(body.description ?? "").trim()
    const icon = String(body.icon ?? "gift").trim()
    const imageUrl = body.imageUrl ? String(body.imageUrl).trim() : null
    const sortOrder = Number(body.sortOrder ?? 0)
    const isActive = Boolean(body.isActive ?? true)

    if (!name || !slug) {
      return NextResponse.json({ error: "Name and slug are required" }, { status: 400 })
    }

    const inserted = await db
      .insert(categories)
      .values({
        name,
        slug,
        description,
        icon,
        imageUrl,
        sortOrder,
        isActive,
      })
      .returning()

    return NextResponse.json(inserted[0], { status: 201 })
  } catch (err: any) {
    if (err?.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("Create category error:", err)
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}
