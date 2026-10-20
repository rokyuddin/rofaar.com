import type { Metadata } from "next"
import Link from "next/link"
import { ProductForm } from "@/components/admin/product-form"

export const metadata: Metadata = {
  title: "New product",
}

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          <Link href="/admin/products" className="hover:text-foreground">
            Products
          </Link>
        </p>
        <h1 className="mt-1 font-heading text-3xl font-semibold tracking-wide">
          New product
        </h1>
      </div>
      <ProductForm />
    </div>
  )
}
