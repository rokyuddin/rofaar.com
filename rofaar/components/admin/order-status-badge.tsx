import { Badge } from "@/components/ui/badge"
import type { OrderStatus } from "@/lib/db/schema"

const labels: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const variant =
    status === "cancelled"
      ? "destructive"
      : status === "delivered"
        ? "secondary"
        : "default"

  return <Badge variant={variant}>{labels[status]}</Badge>
}
