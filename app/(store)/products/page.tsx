import { and, asc, eq, gte, ilike, lte, or, sql } from "drizzle-orm"
import { ProductCard } from "@/components/store/product-card"
import { ProductFilters } from "@/components/store/product-filters"
import { db } from "@/lib/db"
import { products } from "@/lib/db/schema"
import { toNumber } from "@/lib/store-catalog"
import { getActiveCategories } from "@/lib/site-data"

type SearchParams = Promise<{
  q?: string
  category?: string
  min?: string
  max?: string
}>

export const revalidate = 0

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const params = await searchParams
  const q = params.q?.trim() || undefined
  const category = params.category?.trim() || undefined
  const min = params.min ? Number(params.min) : undefined
  const max = params.max ? Number(params.max) : undefined

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
  if (min != null && !Number.isNaN(min)) {
    conditions.push(gte(sql`CAST(${products.price} AS NUMERIC)`, min))
  }
  if (max != null && !Number.isNaN(max)) {
    conditions.push(lte(sql`CAST(${products.price} AS NUMERIC)`, max))
  }

  const [rows, priceBounds, activeCategories] = await Promise.all([
    db
      .select()
      .from(products)
      .where(and(...conditions))
      .orderBy(asc(products.name)),
    db
      .select({
        minPrice: sql<string>`COALESCE(MIN(${products.price}), 0)`,
        maxPrice: sql<string>`COALESCE(MAX(${products.price}), 10000)`,
      })
      .from(products)
      .where(eq(products.isActive, true)),
    getActiveCategories(),
  ])

  const floor = Math.floor(toNumber(priceBounds[0]?.minPrice ?? 0))
  const ceil = Math.ceil(toNumber(priceBounds[0]?.maxPrice ?? 10000))

  const title = category
    ? category
    : q
      ? `Results for “${q}”`
      : "All gifts"

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-4xl font-semibold text-[#342318]">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground">
          {rows.length} {rows.length === 1 ? "gift" : "gifts"}
        </p>
      </div>

      <div className="flex flex-col gap-10 lg:flex-row">
        <ProductFilters
          currentCategory={category}
          currentQ={q}
          minPrice={min}
          maxPrice={max}
          priceFloor={floor}
          priceCeil={Math.max(ceil, floor + 100)}
          categories={activeCategories}
        />

        {rows.length === 0 ? (
          <p className="flex-1 py-12 text-muted-foreground">
            No products match these filters. Try another category or search.
          </p>
        ) : (
          <div className="grid flex-1 grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3">
            {rows.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
