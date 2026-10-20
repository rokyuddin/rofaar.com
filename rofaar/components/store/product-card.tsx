"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/cart-store"
import { formatBdt } from "@/lib/format"
import { discountPercent, toNumber } from "@/lib/store-catalog"

export type ProductCardData = {
  id: number
  slug: string
  name: string
  price: string
  compareAtPrice: string | null
  imageUrl: string
  badge: string | null
}

export function ProductCard({ product }: { product: ProductCardData }) {
  const router = useRouter()
  const addItem = useCartStore((s) => s.addItem)
  const price = toNumber(product.price)
  const compareAt = product.compareAtPrice
    ? toNumber(product.compareAtPrice)
    : null
  const off = discountPercent(price, compareAt)

  function cartPayload() {
    return {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price,
      imageUrl: product.imageUrl,
    }
  }

  function addToCart() {
    addItem(cartPayload())
    toast.success("Added to cart")
  }

  function buyNow() {
    addItem(cartPayload())
    router.push("/checkout")
  }

  return (
    <article className="group flex flex-col gap-3">
      <Link href={`/products/${product.slug}`} className="block overflow-hidden bg-white">
        <div className="relative aspect-square overflow-hidden bg-[#f3ebe0]">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      </Link>

      <div className="flex flex-col gap-2">
        {product.badge ? (
          <Badge className="text-primary">{product.badge}</Badge>
        ) : null}

        <Link href={`/products/${product.slug}`}>
          <h3 className="text-sm font-semibold text-[#342318] transition-colors group-hover:text-primary">
            {product.name}
          </h3>
        </Link>

        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-base font-semibold text-foreground">
            {formatBdt(price)}
          </span>
          {compareAt != null && compareAt > price ? (
            <span className="text-sm text-muted-foreground line-through">
              {formatBdt(compareAt)}
            </span>
          ) : null}
          {off != null ? (
            <span className="text-xs font-semibold tracking-wide text-emerald-700">
              {off}% OFF
            </span>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          <Button type="button" size="sm" variant="secondary" onClick={addToCart}>
            Add to cart
          </Button>
          <Button type="button" size="sm" onClick={buyNow}>
            Buy now
          </Button>
        </div>
      </div>
    </article>
  )
}
