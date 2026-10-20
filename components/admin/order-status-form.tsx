"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { OrderStatus } from "@/lib/db/schema"

const statuses: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
]

export function OrderStatusForm({
  orderId,
  initialStatus,
  initialTrackingNote,
}: {
  orderId: number
  initialStatus: OrderStatus
  initialTrackingNote: string | null
}) {
  const router = useRouter()
  const [status, setStatus] = useState<OrderStatus>(initialStatus)
  const [trackingNote, setTrackingNote] = useState(initialTrackingNote ?? "")
  const [pending, setPending] = useState(false)

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setPending(true)

    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          trackingNote: trackingNote.trim() || null,
        }),
      })

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          error?: string
        } | null
        toast.error(data?.error ?? "Failed to update order")
        return
      }

      toast.success("Order updated")
      router.refresh()
    } catch {
      toast.error("Something went wrong")
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FieldGroup>
        <Field>
          <FieldLabel>Status</FieldLabel>
          <Select
            value={status}
            onValueChange={(value) => {
              if (value) setStatus(value as OrderStatus)
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel htmlFor="trackingNote">Tracking note</FieldLabel>
          <Textarea
            id="trackingNote"
            value={trackingNote}
            onChange={(e) => setTrackingNote(e.target.value)}
            placeholder="Courier, tracking ID, delivery note…"
          />
        </Field>
      </FieldGroup>
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Update order"}
      </Button>
    </form>
  )
}
