"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/admin/image-upload"
import type { Product } from "@/lib/db/schema"

type ProductFormValues = {
  name: string
  slug: string
  description: string
  price: string
  compareAtPrice: string
  imageUrl: string
  category: string
  badge: string
  stock: string
  isActive: boolean
  featured: boolean
}

function toValues(product?: Product): ProductFormValues {
  return {
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    description: product?.description ?? "",
    price: product?.price ?? "",
    compareAtPrice: product?.compareAtPrice ?? "",
    imageUrl: product?.imageUrl ?? "",
    category: product?.category ?? "Gifts",
    badge: product?.badge ?? "",
    stock: product ? String(product.stock) : "0",
    isActive: product?.isActive ?? true,
    featured: product?.featured ?? false,
  }
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter()
  const [values, setValues] = useState(() => toValues(product))
  const [slugTouched, setSlugTouched] = useState(Boolean(product))
  const [pending, setPending] = useState(false)
  const [deleting, setDeleting] = useState(false)

  function update<K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K]
  ) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setPending(true)

    const payload = {
      name: values.name.trim(),
      slug: values.slug.trim().toLowerCase(),
      description: values.description,
      price: values.price,
      compareAtPrice: values.compareAtPrice.trim() || null,
      imageUrl: values.imageUrl.trim(),
      category: values.category.trim() || "Gifts",
      badge: values.badge.trim() || null,
      stock: Number(values.stock),
      isActive: values.isActive,
      featured: values.featured,
    }

    try {
      const res = await fetch(
        product ? `/api/admin/products/${product.id}` : "/api/admin/products",
        {
          method: product ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      )

      const data = (await res.json().catch(() => null)) as {
        error?: string
        product?: Product
      } | null

      if (!res.ok) {
        toast.error(data?.error ?? "Failed to save product")
        return
      }

      toast.success(product ? "Product updated" : "Product created")
      if (data?.product) {
        router.replace(`/admin/products/${data.product.id}/edit`)
        router.refresh()
      } else {
        router.push("/admin/products")
        router.refresh()
      }
    } catch {
      toast.error("Something went wrong")
    } finally {
      setPending(false)
    }
  }

  async function onDelete() {
    if (!product) return
    if (!window.confirm("Delete this product?")) return

    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "DELETE",
      })
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          error?: string
        } | null
        toast.error(data?.error ?? "Failed to delete product")
        return
      }
      toast.success("Product deleted")
      router.push("/admin/products")
      router.refresh()
    } catch {
      toast.error("Something went wrong")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-6">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input
            id="name"
            required
            value={values.name}
            onChange={(e) => {
              update("name", e.target.value)
              if (!slugTouched) update("slug", slugify(e.target.value))
            }}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="slug">Slug</FieldLabel>
          <Input
            id="slug"
            required
            value={values.slug}
            onChange={(e) => {
              setSlugTouched(true)
              update("slug", e.target.value)
            }}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <Textarea
            id="description"
            value={values.description}
            onChange={(e) => update("description", e.target.value)}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="price">Price (BDT)</FieldLabel>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              required
              value={values.price}
              onChange={(e) => update("price", e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="compareAtPrice">Compare-at price</FieldLabel>
            <Input
              id="compareAtPrice"
              type="number"
              min="0"
              step="0.01"
              value={values.compareAtPrice}
              onChange={(e) => update("compareAtPrice", e.target.value)}
            />
          </Field>
        </div>
        <ImageUpload
          value={values.imageUrl}
          onChange={(url) => update("imageUrl", url)}
          folder="products"
          label="Product Photography"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="category">Category</FieldLabel>
            <Input
              id="category"
              value={values.category}
              onChange={(e) => update("category", e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="badge">Badge</FieldLabel>
            <Input
              id="badge"
              value={values.badge}
              onChange={(e) => update("badge", e.target.value)}
              placeholder="Best seller, New…"
            />
          </Field>
        </div>
        <Field>
          <FieldLabel htmlFor="stock">Stock</FieldLabel>
          <Input
            id="stock"
            type="number"
            min="0"
            step="1"
            required
            value={values.stock}
            onChange={(e) => update("stock", e.target.value)}
          />
        </Field>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={values.isActive}
              onCheckedChange={(checked) =>
                update("isActive", checked === true)
              }
            />
            Active
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={values.featured}
              onCheckedChange={(checked) =>
                update("featured", checked === true)
              }
            />
            Featured
          </label>
        </div>
      </FieldGroup>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : product ? "Save changes" : "Create product"}
        </Button>
        {product ? (
          <Button
            type="button"
            variant="destructive"
            disabled={deleting}
            onClick={onDelete}
          >
            {deleting ? "Deleting…" : "Delete"}
          </Button>
        ) : null}
      </div>
    </form>
  )
}
