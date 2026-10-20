import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { eq } from "drizzle-orm"
import { AddToCartButtons } from "@/components/store/add-to-cart-buttons"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { db } from "@/lib/db"
import { products } from "@/lib/db/schema"
import { formatBdt } from "@/lib/format"
import { discountPercent, toNumber } from "@/lib/store-catalog"

type Params = Promise<{ slug: string }>

export default async function ProductDetailPage({
  params,
}: {
  params: Params
}) {
  const { slug } = await params
  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1)

  if (!product || !product.isActive) {
    notFound()
  }

  const price = toNumber(product.price)
  const compareAt = product.compareAtPrice
    ? toNumber(product.compareAtPrice)
    : null
  const off = discountPercent(price, compareAt)

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/products" />}>
              Products
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden bg-[#f3ebe0]">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        <div className="flex flex-col gap-5">
          {product.badge ? (
            <Badge className="text-primary">{product.badge}</Badge>
          ) : null}
          <h1 className="font-heading text-4xl font-semibold text-[#342318] sm:text-5xl">
            {product.name}
          </h1>
          <p className="text-sm text-muted-foreground">{product.category}</p>

          <div className="flex flex-wrap items-baseline gap-3">
            <span className="text-2xl font-semibold">{formatBdt(price)}</span>
            {compareAt != null && compareAt > price ? (
              <span className="text-lg text-muted-foreground line-through">
                {formatBdt(compareAt)}
              </span>
            ) : null}
            {off != null ? (
              <span className="text-sm font-semibold text-emerald-700">
                {off}% OFF
              </span>
            ) : null}
          </div>

          <p className="max-w-prose leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          <p className="text-sm text-muted-foreground">
            {product.stock > 0
              ? `${product.stock} in stock`
              : "Currently out of stock"}
          </p>

          {product.stock > 0 ? (
            <AddToCartButtons
              product={{
                productId: product.id,
                slug: product.slug,
                name: product.name,
                price,
                imageUrl: product.imageUrl,
              }}
            />
          ) : null}
        </div>
      </div>
    </div>
  )
}
