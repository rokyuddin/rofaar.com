"use client"

import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useCartStore } from "@/lib/cart-store"
import { formatBdt } from "@/lib/format"

export function CheckoutForm() {
  const router = useRouter()
  const items = useCartStore((s) => s.items)
  const subtotal = useCartStore((s) => s.subtotal())
  const clear = useCartStore((s) => s.clear)
  const shippingFee = subtotal > 0 && subtotal < 3000 ? 120 : 0
  const total = subtotal + shippingFee

  const [sameAsBilling, setSameAsBilling] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (items.length === 0) {
      toast.error("Your cart is empty")
      return
    }

    const form = new FormData(e.currentTarget)
    const billing = {
      fullName: String(form.get("fullName") ?? "").trim(),
      email: String(form.get("email") ?? "").trim(),
      phone: String(form.get("phone") ?? "").trim(),
      address: String(form.get("address") ?? "").trim(),
      city: String(form.get("city") ?? "").trim(),
      area: String(form.get("area") ?? "").trim(),
    }

    const shipping = sameAsBilling
      ? {
          name: billing.fullName,
          phone: billing.phone,
          address: billing.address,
          city: billing.city,
          area: billing.area,
        }
      : {
          name: String(form.get("shippingName") ?? "").trim(),
          phone: String(form.get("shippingPhone") ?? "").trim(),
          address: String(form.get("shippingAddress") ?? "").trim(),
          city: String(form.get("shippingCity") ?? "").trim(),
          area: String(form.get("shippingArea") ?? "").trim(),
        }

    const payload = {
      ...billing,
      notes: String(form.get("notes") ?? "").trim() || undefined,
      giftMessage: String(form.get("giftMessage") ?? "").trim() || undefined,
      shipping,
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = (await res.json()) as {
        orderNumber?: string
        error?: string
      }
      if (!res.ok || !data.orderNumber) {
        throw new Error(data.error || "Could not place order")
      }
      clear()
      router.push(`/order/${data.orderNumber}`)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not place order"
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col gap-4 py-16">
        <h1 className="font-heading text-4xl font-semibold text-[#342318]">
          Checkout
        </h1>
        <p className="text-muted-foreground">
          Your cart is empty. Add a gift before checking out.
        </p>
        <Button render={<a href="/products" />}>Browse gifts</Button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-10 lg:grid-cols-[1fr_320px]">
      <div className="flex flex-col gap-8">
        <h1 className="font-heading text-4xl font-semibold text-[#342318]">
          Checkout
        </h1>

        <FieldSet>
          <FieldLegend>Billing details</FieldLegend>
          <FieldGroup className="gap-5">
            <Field>
              <FieldLabel htmlFor="fullName">Full name</FieldLabel>
              <Input id="fullName" name="fullName" required autoComplete="name" />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="phone">Phone</FieldLabel>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="address">Address</FieldLabel>
              <Textarea id="address" name="address" required rows={3} />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="city">City</FieldLabel>
                <Input id="city" name="city" required autoComplete="address-level2" />
              </Field>
              <Field>
                <FieldLabel htmlFor="area">Area</FieldLabel>
                <Input id="area" name="area" autoComplete="address-level3" />
              </Field>
            </div>
          </FieldGroup>
        </FieldSet>

        <FieldSet>
          <FieldLegend>Shipping</FieldLegend>
          <FieldGroup className="gap-5">
            <Field orientation="horizontal">
              <Checkbox
                id="sameAsBilling"
                checked={sameAsBilling}
                onCheckedChange={(checked) =>
                  setSameAsBilling(checked === true)
                }
              />
              <FieldLabel htmlFor="sameAsBilling">
                Shipping same as billing
              </FieldLabel>
            </Field>

            {!sameAsBilling ? (
              <>
                <Field>
                  <FieldLabel htmlFor="shippingName">Recipient name</FieldLabel>
                  <Input id="shippingName" name="shippingName" required />
                </Field>
                <Field>
                  <FieldLabel htmlFor="shippingPhone">Phone</FieldLabel>
                  <Input id="shippingPhone" name="shippingPhone" required />
                </Field>
                <Field>
                  <FieldLabel htmlFor="shippingAddress">Address</FieldLabel>
                  <Textarea
                    id="shippingAddress"
                    name="shippingAddress"
                    required
                    rows={3}
                  />
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="shippingCity">City</FieldLabel>
                    <Input id="shippingCity" name="shippingCity" required />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="shippingArea">Area</FieldLabel>
                    <Input id="shippingArea" name="shippingArea" />
                  </Field>
                </div>
              </>
            ) : null}
          </FieldGroup>
        </FieldSet>

        <FieldSet>
          <FieldLegend>Notes</FieldLegend>
          <FieldGroup className="gap-5">
            <Field>
              <FieldLabel htmlFor="giftMessage">Gift message</FieldLabel>
              <Textarea id="giftMessage" name="giftMessage" rows={3} />
              <FieldDescription>
                Optional note included with the gift.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="notes">Order notes</FieldLabel>
              <Textarea id="notes" name="notes" rows={3} />
            </Field>
          </FieldGroup>
        </FieldSet>
      </div>

      <aside className="flex h-fit flex-col gap-4 border border-border bg-white p-6">
        <h2 className="text-xs font-semibold tracking-widest uppercase">
          Order summary
        </h2>
        <ul className="flex flex-col gap-3 text-sm">
          {items.map((item) => (
            <li key={item.productId} className="flex justify-between gap-3">
              <span className="text-muted-foreground">
                {item.name} × {item.quantity}
              </span>
              <span>{formatBdt(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-2 border-t border-border pt-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatBdt(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span>{shippingFee === 0 ? "Free" : formatBdt(shippingFee)}</span>
          </div>
          <div className="flex justify-between text-base font-semibold">
            <span>Total</span>
            <span>{formatBdt(total)}</span>
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Placing order…" : "Place order"}
        </Button>
      </aside>
    </form>
  )
}
