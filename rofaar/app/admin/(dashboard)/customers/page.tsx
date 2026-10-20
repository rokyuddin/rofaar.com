import { count, desc, eq } from "drizzle-orm"
import type { Metadata } from "next"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { db } from "@/lib/db"
import { customers, orders } from "@/lib/db/schema"

export const metadata: Metadata = {
  title: "Customers",
}

export default async function AdminCustomersPage() {
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-semibold tracking-wide">
          Customers
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          People who have placed orders.
        </p>
      </div>

      <div className="overflow-hidden rounded-none border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-muted-foreground">
                  No customers yet.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">
                    {customer.fullName}
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.orderCount}</TableCell>
                  <TableCell>
                    {customer.createdAt.toLocaleDateString("en-BD", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
