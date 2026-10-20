import { desc } from "drizzle-orm"
import { NextResponse } from "next/server"
import { getAdminSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { products } from "@/lib/db/schema"

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

export async function GET() {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const rows = await db.select().from(products).orderBy(desc(products.createdAt))
  return NextResponse.json({ products: rows })
}

export async function POST(request: Request) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const name = String(body.name ?? "").trim()
  const slug = String(body.slug ?? "")
    .trim()
    .toLowerCase()
  const description = String(body.description ?? "")
  const imageUrl = String(body.imageUrl ?? "").trim()
  const category = String(body.category ?? "Gifts").trim() || "Gifts"
  const badge =
    body.badge === null || body.badge === undefined || body.badge === ""
      ? null
      : String(body.badge).trim()
  const stock = Number(body.stock ?? 0)
  const isActive = Boolean(body.isActive ?? true)
  const featured = Boolean(body.featured ?? false)

  if (!name || !slug || !imageUrl) {
    return NextResponse.json(
      { error: "Name, slug, and imageUrl are required" },
      { status: 400 }
    )
  }

  const price = parsePrice(body.price, "price")
  if ("error" in price) {
    return NextResponse.json({ error: price.error }, { status: 400 })
  }

  let compareAtPrice: string | null = null
  if (
    body.compareAtPrice !== null &&
    body.compareAtPrice !== undefined &&
    body.compareAtPrice !== ""
  ) {
    const parsed = parsePrice(body.compareAtPrice, "compareAtPrice")
    if ("error" in parsed) {
      return NextResponse.json({ error: parsed.error }, { status: 400 })
    }
    compareAtPrice = parsed.value
  }

  if (!Number.isInteger(stock) || stock < 0) {
    return NextResponse.json({ error: "Invalid stock" }, { status: 400 })
  }

  try {
    const [product] = await db
      .insert(products)
      .values({
        name,
        slug,
        description,
        price: price.value,
        compareAtPrice,
        imageUrl,
        category,
        badge,
        stock,
        isActive,
        featured,
      })
      .returning()

    return NextResponse.json({ product }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: "Could not create product (slug may already exist)" },
      { status: 409 }
    )
  }
}
