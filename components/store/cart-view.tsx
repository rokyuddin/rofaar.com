"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/cart-store"
import { formatBdt } from "@/lib/format"

import { DEFAULT_GENERAL, type GeneralSettings } from "@/lib/site-settings"

interface CartViewProps {
  settings?: GeneralSettings
}

export function CartView({ settings = DEFAULT_GENERAL }: CartViewProps) {
  const items = useCartStore((s) => s.items)
  const setQuantity = useCartStore((s) => s.setQuantity)
  const removeItem = useCartStore((s) => s.removeItem)
  const subtotal = useCartStore((s) => s.subtotal())
  const freeThreshold = settings.freeShippingThreshold ?? 5000
  const insideShipping = settings.insideDhakaShipping ?? 80
  const isFree = subtotal >= freeThreshold
  const shippingFee = subtotal > 0 ? (isFree ? 0 : insideShipping) : 0
  const total = subtotal + shippingFee

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-start gap-4 py-16">
        <h1 className="font-heading text-4xl font-semibold text-[#342318]">
          Your cart is empty
        </h1>
        <p className="text-muted-foreground">
          Browse gifts and add something meaningful.
        </p>
        <Button render={<Link href="/products" />}>Shop gifts</Button>
      </div>
    )
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
      <div className="flex flex-col gap-6">
        <h1 className="font-heading text-4xl font-semibold text-[#342318]">
          Cart
        </h1>
        <ul className="flex flex-col gap-6">
          {items.map((item) => (
            <li
              key={item.productId}
              className="flex gap-4 border-b border-border pb-6"
            >
              <Link
                href={`/products/${item.slug}`}
                className="relative size-24 shrink-0 overflow-hidden bg-[#f3ebe0]"
              >
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <Link
                      href={`/products/${item.slug}`}
                      className="font-semibold text-[#342318] hover:text-primary"
                    >
                      {item.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {formatBdt(item.price)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    className="text-muted-foreground hover:text-destructive"
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center border border-border">
                    <button
                      type="button"
                      className="flex size-9 items-center justify-center hover:bg-muted"
                      onClick={() =>
                        setQuantity(item.productId, item.quantity - 1)
                      }
                      aria-label="Decrease quantity"
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      className="flex size-9 items-center justify-center hover:bg-muted"
                      onClick={() =>
                        setQuantity(item.productId, item.quantity + 1)
                      }
                      aria-label="Increase quantity"
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                  <p className="text-sm font-semibold">
                    {formatBdt(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <aside className="flex h-fit flex-col gap-4 border border-border bg-white p-6">
        <h2 className="text-xs font-semibold tracking-widest uppercase">
          Summary
        </h2>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatBdt(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span>
              {shippingFee === 0 ? "Free" : formatBdt(shippingFee)}
            </span>
          </div>
          <div className="mt-2 flex justify-between border-t border-border pt-3 text-base font-semibold">
            <span>Total</span>
            <span>{formatBdt(total)}</span>
          </div>
        </div>
        {subtotal > 0 && !isFree ? (
          <p className="text-xs text-muted-foreground">
            Free delivery on orders {settings.currencySymbol ?? "৳"}
            {freeThreshold.toLocaleString()} and above.
          </p>
        ) : null}
        <Button render={<Link href="/checkout" />} className="w-full">
          Checkout
        </Button>
        <Button
          render={<Link href="/products" />}
          variant="ghost"
          className="w-full"
        >
          Continue shopping
        </Button>
      </aside>
    </div>
  )
}
