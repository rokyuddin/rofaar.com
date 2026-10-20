"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/cart-store"

type Props = {
  product: {
    productId: number
    slug: string
    name: string
    price: number
    imageUrl: string
  }
  quantity?: number
  className?: string
}

export function AddToCartButtons({ product, quantity = 1, className }: Props) {
  const router = useRouter()
  const addItem = useCartStore((s) => s.addItem)

  function addToCart() {
    addItem(product, quantity)
    toast.success("Added to cart")
  }

  function buyNow() {
    addItem(product, quantity)
    router.push("/checkout")
  }

  return (
    <div className={className ?? "flex flex-wrap gap-3"}>
      <Button type="button" variant="secondary" onClick={addToCart}>
        Add to cart
      </Button>
      <Button type="button" onClick={buyNow}>
        Buy now
      </Button>
    </div>
  )
}
