import { and, asc, eq, ilike, or } from "drizzle-orm"
import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { products } from "@/lib/db/schema"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get("q")?.trim() || undefined
    const category = searchParams.get("category")?.trim() || undefined

    const conditions = [eq(products.isActive, true)]

    if (category) {
      conditions.push(eq(products.category, category))
    }
    if (q) {
      const pattern = `%${q}%`
      conditions.push(
        or(ilike(products.name, pattern), ilike(products.description, pattern))!
      )
    }

    const rows = await db
      .select()
      .from(products)
      .where(and(...conditions))
      .orderBy(asc(products.name))

    return NextResponse.json({ products: rows })
  } catch (error) {
    console.error("GET /api/products", error)
    return NextResponse.json(
      { error: "Could not load products" },
      { status: 500 }
    )
  }
}
