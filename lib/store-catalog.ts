export function discountPercent(
  price: string | number,
  compareAt: string | number | null | undefined
): number | null {
  if (compareAt == null) return null
  const p = typeof price === "string" ? Number.parseFloat(price) : price
  const c =
    typeof compareAt === "string" ? Number.parseFloat(compareAt) : compareAt
  if (Number.isNaN(p) || Number.isNaN(c) || c <= p) return null
  return Math.round(((c - p) / c) * 100)
}

export function toNumber(value: string | number): number {
  return typeof value === "string" ? Number.parseFloat(value) : value
}
