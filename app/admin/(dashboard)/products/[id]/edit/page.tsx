import { eq } from "drizzle-orm"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ProductForm } from "@/components/admin/product-form"
import { db } from "@/lib/db"
import { products } from "@/lib/db/schema"

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  return { title: `Edit product #${id}` }
}

export default async function EditProductPage({ params }: Props) {
  const { id: rawId } = await params
  const id = Number(rawId)
  if (!Number.isInteger(id) || id < 1) notFound()

  const rows = await db.select().from(products).where(eq(products.id, id)).limit(1)
  const product = rows[0]
  if (!product) notFound()

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          <Link href="/admin/products" className="hover:text-foreground">
            Products
          </Link>
        </p>
        <h1 className="mt-1 font-heading text-3xl font-semibold tracking-wide">
          Edit product
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{product.name}</p>
      </div>
      <ProductForm product={product} />
    </div>
  )
}
