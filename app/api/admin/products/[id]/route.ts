import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { getAdminSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { products } from "@/lib/db/schema"

type Params = { params: Promise<{ id: string }> }

function parseId(raw: string) {
  const id = Number(raw)
  if (!Number.isInteger(id) || id < 1) return null
  return id
}

function parsePrice(value: unknown, field: string) {
  if (value === null || value === undefined || value === "") {
    return { error: `${field} is required` as const }
  }
  const num = typeof value === "number" ? value : Number.parseFloat(String(value))
  if (Number.isNaN(num) || num < 0) {
    return { error: `Invalid ${field}` as const }
  }
  return { value: num.toFixed(2) }
}

export async function GET(_request: Request, { params }: Params) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const id = parseId((await params).id)
  if (!id) {
    return NextResponse.json({ error: "Invalid product id" }, { status: 400 })
  }

  const rows = await db.select().from(products).where(eq(products.id, id)).limit(1)
  const product = rows[0]
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 })
  }

  return NextResponse.json({ product })
}

export async function PATCH(request: Request, { params }: Params) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const id = parseId((await params).id)
  if (!id) {
    return NextResponse.json({ error: "Invalid product id" }, { status: 400 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const updates: Partial<typeof products.$inferInsert> & { updatedAt: Date } = {
    updatedAt: new Date(),
  }

  if (body.name !== undefined) {
    const name = String(body.name).trim()
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }
    updates.name = name
  }

  if (body.slug !== undefined) {
    const slug = String(body.slug).trim().toLowerCase()
    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 })
    }
    updates.slug = slug
  }

  if (body.description !== undefined) {
    updates.description = String(body.description)
  }

  if (body.price !== undefined) {
    const price = parsePrice(body.price, "price")
    if ("error" in price) {
      return NextResponse.json({ error: price.error }, { status: 400 })
    }
    updates.price = price.value
  }

  if (body.compareAtPrice !== undefined) {
    if (body.compareAtPrice === null || body.compareAtPrice === "") {
      updates.compareAtPrice = null
    } else {
      const parsed = parsePrice(body.compareAtPrice, "compareAtPrice")
      if ("error" in parsed) {
        return NextResponse.json({ error: parsed.error }, { status: 400 })
      }
      updates.compareAtPrice = parsed.value
    }
  }

  if (body.imageUrl !== undefined) {
    const imageUrl = String(body.imageUrl).trim()
    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      )
    }
    updates.imageUrl = imageUrl
  }

  if (body.category !== undefined) {
    updates.category = String(body.category).trim() || "Gifts"
  }

  if (body.badge !== undefined) {
    updates.badge =
      body.badge === null || body.badge === ""
        ? null
        : String(body.badge).trim()
  }

  if (body.stock !== undefined) {
    const stock = Number(body.stock)
    if (!Number.isInteger(stock) || stock < 0) {
      return NextResponse.json({ error: "Invalid stock" }, { status: 400 })
    }
    updates.stock = stock
  }

  if (body.isActive !== undefined) {
    updates.isActive = Boolean(body.isActive)
  }

  if (body.featured !== undefined) {
    updates.featured = Boolean(body.featured)
  }

  try {
    const updated = await db
      .update(products)
      .set(updates)
      .where(eq(products.id, id))
      .returning()

    if (!updated[0]) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ product: updated[0] })
  } catch {
    return NextResponse.json(
      { error: "Could not update product (slug may already exist)" },
      { status: 409 }
    )
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const id = parseId((await params).id)
  if (!id) {
    return NextResponse.json({ error: "Invalid product id" }, { status: 400 })
  }

  const deleted = await db
    .delete(products)
    .where(eq(products.id, id))
    .returning({ id: products.id })

  if (!deleted[0]) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
}
