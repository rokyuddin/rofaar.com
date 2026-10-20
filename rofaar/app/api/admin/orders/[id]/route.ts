import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { getAdminSession } from "@/lib/auth"
import { db } from "@/lib/db"
import {
  customers,
  orderItems,
  orders,
  orderStatusEnum,
  type OrderStatus,
} from "@/lib/db/schema"

type Params = { params: Promise<{ id: string }> }

const statuses = new Set<string>(orderStatusEnum.enumValues)

export async function GET(_request: Request, { params }: Params) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id: rawId } = await params
  const id = Number(rawId)
  if (!Number.isInteger(id) || id < 1) {
    return NextResponse.json({ error: "Invalid order id" }, { status: 400 })
  }

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
  if (!row) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 })
  }

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, id))

  return NextResponse.json({
    order: row.order,
    customer: row.customer,
    items,
  })
}

export async function PATCH(request: Request, { params }: Params) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id: rawId } = await params
  const id = Number(rawId)
  if (!Number.isInteger(id) || id < 1) {
    return NextResponse.json({ error: "Invalid order id" }, { status: 400 })
  }

  let body: { status?: string; trackingNote?: string | null }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const updates: {
    status?: OrderStatus
    trackingNote?: string | null
    updatedAt: Date
  } = { updatedAt: new Date() }

  if (body.status !== undefined) {
    if (!statuses.has(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }
    updates.status = body.status as OrderStatus
  }

  if (body.trackingNote !== undefined) {
    updates.trackingNote =
      body.trackingNote === null || body.trackingNote === ""
        ? null
        : String(body.trackingNote)
  }

  if (updates.status === undefined && updates.trackingNote === undefined) {
    return NextResponse.json(
      { error: "No fields to update" },
      { status: 400 }
    )
  }

  const updated = await db
    .update(orders)
    .set(updates)
    .where(eq(orders.id, id))
    .returning()

  if (!updated[0]) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 })
  }

  return NextResponse.json({ order: updated[0] })
}
