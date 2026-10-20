import { eq, inArray } from "drizzle-orm"
import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { customers, orderItems, orders, products } from "@/lib/db/schema"
import { generateOrderNumber } from "@/lib/orders"
import { getGeneralSettings } from "@/lib/site-data"
import { toNumber } from "@/lib/store-catalog"

const orderSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required"),
  email: z.email("Valid email is required"),
  phone: z.string().trim().min(1, "Phone is required"),
  address: z.string().trim().min(1, "Address is required"),
  city: z.string().trim().min(1, "City is required"),
  area: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  giftMessage: z.string().trim().optional(),
  shipping: z.object({
    name: z.string().trim().min(1),
    phone: z.string().trim().min(1),
    address: z.string().trim().min(1),
    city: z.string().trim().min(1),
    area: z.string().trim().optional(),
  }),
  items: z
    .array(
      z.object({
        productId: z.number().int().positive(),
        quantity: z.number().int().positive(),
      })
    )
    .min(1, "Cart is empty"),
})

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const parsed = orderSchema.safeParse(json)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid order" },
        { status: 400 }
      )
    }

    const data = parsed.data
    const productIds = data.items.map((item) => item.productId)
    const catalog = await db
      .select()
      .from(products)
      .where(inArray(products.id, productIds))

    if (catalog.length !== productIds.length) {
      return NextResponse.json(
        { error: "One or more products are unavailable" },
        { status: 400 }
      )
    }

    const byId = new Map(catalog.map((p) => [p.id, p]))
    const lineItems: {
      productId: number
      productName: string
      productImage: string
      unitPrice: number
      quantity: number
      lineTotal: number
    }[] = []

    for (const item of data.items) {
      const product = byId.get(item.productId)
      if (!product || !product.isActive) {
        return NextResponse.json(
          { error: "One or more products are unavailable" },
          { status: 400 }
        )
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Not enough stock for ${product.name}` },
          { status: 400 }
        )
      }
      const unitPrice = toNumber(product.price)
      lineItems.push({
        productId: product.id,
        productName: product.name,
        productImage: product.imageUrl,
        unitPrice,
        quantity: item.quantity,
        lineTotal: unitPrice * item.quantity,
      })
    }

    const subtotal = lineItems.reduce((sum, line) => sum + line.lineTotal, 0)
    const generalSettings = await getGeneralSettings()
    const isDhaka =
      (data.shipping.city || "").toLowerCase().includes("dhaka") ||
      (data.city || "").toLowerCase().includes("dhaka")
    const baseShipping = isDhaka
      ? generalSettings.insideDhakaShipping
      : generalSettings.outsideDhakaShipping
    const shippingFee =
      subtotal >= generalSettings.freeShippingThreshold ? 0 : baseShipping
    const total = subtotal + shippingFee
    const orderNumber = generateOrderNumber()

    const existing = await db
      .select()
      .from(customers)
      .where(eq(customers.email, data.email))
      .limit(1)

    let customerId: number
    if (existing[0]) {
      customerId = existing[0].id
      await db
        .update(customers)
        .set({
          fullName: data.fullName,
          phone: data.phone,
          updatedAt: new Date(),
        })
        .where(eq(customers.id, customerId))
    } else {
      const [created] = await db
        .insert(customers)
        .values({
          email: data.email,
          fullName: data.fullName,
          phone: data.phone,
        })
        .returning({ id: customers.id })
      if (!created) {
        return NextResponse.json(
          { error: "Could not create customer" },
          { status: 500 }
        )
      }
      customerId = created.id
    }

    const [order] = await db
      .insert(orders)
      .values({
        orderNumber,
        customerId,
        status: "pending",
        subtotal: subtotal.toFixed(2),
        shippingFee: shippingFee.toFixed(2),
        total: total.toFixed(2),
        billingName: data.fullName,
        billingEmail: data.email,
        billingPhone: data.phone,
        billingAddress: data.address,
        billingCity: data.city,
        billingArea: data.area || null,
        shippingName: data.shipping.name,
        shippingPhone: data.shipping.phone,
        shippingAddress: data.shipping.address,
        shippingCity: data.shipping.city,
        shippingArea: data.shipping.area || null,
        notes: data.notes || null,
        giftMessage: data.giftMessage || null,
      })
      .returning({ id: orders.id, orderNumber: orders.orderNumber })

    if (!order) {
      return NextResponse.json(
        { error: "Could not create order" },
        { status: 500 }
      )
    }

    await db.insert(orderItems).values(
      lineItems.map((line) => ({
        orderId: order.id,
        productId: line.productId,
        productName: line.productName,
        productImage: line.productImage,
        unitPrice: line.unitPrice.toFixed(2),
        quantity: line.quantity,
        lineTotal: line.lineTotal.toFixed(2),
      }))
    )

    for (const line of lineItems) {
      const product = byId.get(line.productId)!
      await db
        .update(products)
        .set({
          stock: product.stock - line.quantity,
          updatedAt: new Date(),
        })
        .where(eq(products.id, line.productId))
    }

    return NextResponse.json({ orderNumber: order.orderNumber })
  } catch (error) {
    console.error("POST /api/orders", error)
    return NextResponse.json(
      { error: "Could not place order" },
      { status: 500 }
    )
  }
}
