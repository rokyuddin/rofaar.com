import { count, desc, eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { getAdminSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { customers, orders } from "@/lib/db/schema"

export async function GET() {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const rows = await db
    .select({
      id: customers.id,
      email: customers.email,
      fullName: customers.fullName,
      phone: customers.phone,
      createdAt: customers.createdAt,
      orderCount: count(orders.id),
    })
    .from(customers)
    .leftJoin(orders, eq(orders.customerId, customers.id))
    .groupBy(customers.id)
    .orderBy(desc(customers.createdAt))

  return NextResponse.json({ customers: rows })
}
