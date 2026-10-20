import { count, eq, sql } from "drizzle-orm"
import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/lib/db"
import { customers, orders, products } from "@/lib/db/schema"
import { formatBdt } from "@/lib/format"

export const metadata: Metadata = {
  title: "Dashboard",
}

export default async function AdminDashboardPage() {
  const [
    [{ value: totalOrders }],
    [{ value: pendingOrders }],
    [{ value: revenue }],
    [{ value: customerCount }],
    [{ value: productCount }],
  ] = await Promise.all([
    db.select({ value: count() }).from(orders),
    db
      .select({ value: count() })
      .from(orders)
      .where(eq(orders.status, "pending")),
    db
      .select({
        value: sql<string>`coalesce(sum(${orders.total}), 0)`,
      })
      .from(orders)
      .where(sql`${orders.status} != 'cancelled'`),
    db.select({ value: count() }).from(customers),
    db.select({ value: count() }).from(products),
  ])

  const stats = [
    { label: "Total orders", value: String(totalOrders) },
    { label: "Pending", value: String(pendingOrders) },
    { label: "Revenue", value: formatBdt(revenue) },
    { label: "Customers", value: String(customerCount) },
    { label: "Products", value: String(productCount) },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-semibold tracking-wide">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of store activity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => (
          <Card key={stat.label} size="sm">
            <CardHeader>
              <CardTitle className="text-xs font-semibold tracking-widest text-muted-foreground">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-heading text-3xl font-semibold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
