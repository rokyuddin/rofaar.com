import { desc } from "drizzle-orm"
import type { Metadata } from "next"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { db } from "@/lib/db"
import { products } from "@/lib/db/schema"
import { formatBdt } from "@/lib/format"

export const metadata: Metadata = {
  title: "Products",
}



export default async function AdminProductsPage() {
  const rows = await db.select().from(products).orderBy(desc(products.createdAt))

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-semibold tracking-wide">
            Products
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Catalog items for the storefront.
          </p>
        </div>
        <Button render={<Link href="/admin/products/new" />}>New product</Button>
      </div>

      <div className="overflow-hidden rounded-none border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-muted-foreground">
                  No products yet.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="whitespace-normal">
                    <div className="font-medium">{product.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {product.slug}
                    </div>
                  </TableCell>
                  <TableCell>{formatBdt(product.price)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge variant={product.isActive ? "default" : "secondary"}>
                        {product.isActive ? "Active" : "Inactive"}
                      </Badge>
                      {product.featured ? (
                        <Badge variant="outline">Featured</Badge>
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      render={
                        <Link href={`/admin/products/${product.id}/edit`} />
                      }
                    >
                      Edit
                    </Button>
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
