import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { eq } from "drizzle-orm"
import { Button } from "@/components/ui/button"
import { db } from "@/lib/db"
import { orderItems, orders } from "@/lib/db/schema"
import { formatBdt } from "@/lib/format"

type Params = Promise<{ orderNumber: string }>

export default async function OrderConfirmationPage({
  params,
}: {
  params: Params
}) {
  const { orderNumber } = await params
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.orderNumber, orderNumber))
    .limit(1)

  if (!order) {
    notFound()
  }

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id))

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-12 sm:px-6">
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold tracking-widest text-primary uppercase">
          Order confirmed
        </p>
        <h1 className="font-heading text-4xl font-semibold text-[#342318]">
          Thank you, {order.billingName}
        </h1>
        <p className="text-muted-foreground">
          Your order{" "}
          <span className="font-semibold text-foreground">
            {order.orderNumber}
          </span>{" "}
          is confirmed. We&apos;ll be in touch about delivery.
        </p>
      </div>

      <div className="flex flex-col gap-4 border border-border bg-white p-6">
        <h2 className="text-xs font-semibold tracking-widest uppercase">
          Order summary
        </h2>
        <ul className="flex flex-col gap-4">
          {items.map((item) => (
            <li key={item.id} className="flex gap-4">
              {item.productImage ? (
                <div className="relative size-16 shrink-0 overflow-hidden bg-[#f3ebe0]">
                  <Image
                    src={item.productImage}
                    alt={item.productName}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
              ) : null}
              <div className="flex flex-1 items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{item.productName}</p>
                  <p className="text-sm text-muted-foreground">
                    Qty {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-semibold">
                  {formatBdt(item.lineTotal)}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-2 border-t border-border pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatBdt(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span>
              {Number(order.shippingFee) === 0
                ? "Free"
                : formatBdt(order.shippingFee)}
            </span>
          </div>
          <div className="flex justify-between text-base font-semibold">
            <span>Total</span>
            <span>{formatBdt(order.total)}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 text-sm sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold tracking-widest uppercase">
            Billing
          </p>
          <p>{order.billingName}</p>
          <p className="text-muted-foreground">{order.billingEmail}</p>
          <p className="text-muted-foreground">{order.billingPhone}</p>
          <p className="text-muted-foreground">
            {order.billingAddress}, {order.billingCity}
            {order.billingArea ? `, ${order.billingArea}` : ""}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold tracking-widest uppercase">
            Shipping
          </p>
          <p>{order.shippingName}</p>
          <p className="text-muted-foreground">{order.shippingPhone}</p>
          <p className="text-muted-foreground">
            {order.shippingAddress}, {order.shippingCity}
            {order.shippingArea ? `, ${order.shippingArea}` : ""}
          </p>
        </div>
      </div>

      {order.giftMessage ? (
        <div className="flex flex-col gap-1 text-sm">
          <p className="text-xs font-semibold tracking-widest uppercase">
            Gift message
          </p>
          <p className="text-muted-foreground">{order.giftMessage}</p>
        </div>
      ) : null}

      <Button render={<Link href="/products" />} className="w-fit">
        Continue shopping
      </Button>
    </div>
  )
}
