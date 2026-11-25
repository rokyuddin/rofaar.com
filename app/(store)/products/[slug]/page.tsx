import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { eq } from "drizzle-orm"
import { JsonLd } from "@/components/analytics/json-ld"
import { TrackEvent } from "@/components/analytics/track-event"
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
import { SITE_DESCRIPTION, SITE_URL, absoluteUrl } from "@/lib/seo"
import { discountPercent, toNumber } from "@/lib/store-catalog"

type Params = Promise<{ slug: string }>

async function getProduct(slug: string) {
  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1)
  return product
}

export async function generateMetadata({
  params,
}: {
  params: Params
}): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product || !product.isActive) return { title: "Product not found" }
  const description = (product.description || SITE_DESCRIPTION)
    .replace(/\s+/g, " ")
    .slice(0, 160)
  const url = `/products/${product.slug}`
  const image = absoluteUrl(product.imageUrl)
  return {
    title: product.name,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: product.name,
      description,
      images: [{ url: image, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: [image],
    },
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Params
}) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product || !product.isActive) {
    notFound()
  }

  const price = toNumber(product.price)
  const compareAt = product.compareAtPrice
    ? toNumber(product.compareAtPrice)
    : null
  const off = discountPercent(price, compareAt)

  const productUrl = `${SITE_URL}/products/${product.slug}`
  const productLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${productUrl}#product`,
        name: product.name,
        description: product.description || SITE_DESCRIPTION,
        image: [absoluteUrl(product.imageUrl)],
        sku: String(product.id),
        url: productUrl,
        category: product.category,
        brand: { "@type": "Brand", name: "Rofaar" },
        offers: {
          "@type": "Offer",
          url: productUrl,
          priceCurrency: "BDT",
          price: price.toFixed(2),
          availability:
            product.stock > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
          itemCondition: "https://schema.org/NewCondition",
          seller: { "@id": `${SITE_URL}/#organization` },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: "Products",
            item: `${SITE_URL}/products`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: product.name,
            item: productUrl,
          },
        ],
      },
    ],
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6">
      <JsonLd data={productLd} />
      <TrackEvent
        event="view_item"
        value={price}
        items={[
          { item_id: product.id, item_name: product.name, price, quantity: 1 },
        ]}
      />
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
        <div className="relative aspect-square overflow-hidden bg-[#f5ede6]">
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
          <h1 className="font-heading text-4xl font-semibold text-[#33180a] sm:text-5xl">
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
              <span className="text-sm font-semibold text-primary">
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
