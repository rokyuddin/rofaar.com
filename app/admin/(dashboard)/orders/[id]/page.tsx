import { eq } from "drizzle-orm"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { OrderStatusBadge } from "@/components/admin/order-status-badge"
import { OrderStatusForm } from "@/components/admin/order-status-form"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { db } from "@/lib/db"
import { customers, orderItems, orders } from "@/lib/db/schema"
import { formatBdt } from "@/lib/format"

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  return { title: `Order #${id}` }
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id: rawId } = await params
  const id = Number(rawId)
  if (!Number.isInteger(id) || id < 1) notFound()

  const orderRows = await db
    .select({
      order: orders,
      customer: customers,
    })
    .from(orders)
    .innerJoin(customers, eq(orders.customerId, customers.id))
    .where(eq(orders.id, id))
    .limit(1)

  const row = orderRows[0]
  if (!row) notFound()

  const { order, customer } = row
  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, id))

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            <Link href="/admin/orders" className="hover:text-foreground">
              Orders
            </Link>
          </p>
          <h1 className="mt-1 font-heading text-3xl font-semibold tracking-wide">
            {order.orderNumber}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <OrderStatusBadge status={order.status} />
            <span>
              {order.createdAt.toLocaleString("en-BD", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
        <p className="font-heading text-2xl font-semibold">
          {formatBdt(order.total)}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Items</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Line</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="whitespace-normal">
                      {item.productName}
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{formatBdt(item.unitPrice)}</TableCell>
                    <TableCell>{formatBdt(item.lineTotal)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatBdt(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{formatBdt(order.shippingFee)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatBdt(order.total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Update</CardTitle>
          </CardHeader>
          <CardContent>
            <OrderStatusForm
              orderId={order.id}
              initialStatus={order.status}
              initialTrackingNote={order.trackingNote}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card size="sm">
          <CardHeader>
            <CardTitle>Billing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p className="font-medium">{order.billingName}</p>
            <p>{order.billingEmail}</p>
            <p>{order.billingPhone}</p>
            <p className="pt-2 whitespace-pre-wrap">{order.billingAddress}</p>
            <p>
              {[order.billingArea, order.billingCity].filter(Boolean).join(", ")}
            </p>
            <p className="pt-2 text-muted-foreground">
              Customer: {customer.fullName}
            </p>
          </CardContent>
        </Card>

        <Card size="sm">
          <CardHeader>
            <CardTitle>Shipping</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p className="font-medium">{order.shippingName}</p>
            <p>{order.shippingPhone}</p>
            <p className="pt-2 whitespace-pre-wrap">{order.shippingAddress}</p>
            <p>
              {[order.shippingArea, order.shippingCity]
                .filter(Boolean)
                .join(", ")}
            </p>
            {order.notes ? (
              <p className="pt-2 text-muted-foreground">Notes: {order.notes}</p>
            ) : null}
            {order.giftMessage ? (
              <p className="text-muted-foreground">
                Gift message: {order.giftMessage}
              </p>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
