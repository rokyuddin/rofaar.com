export function formatBdt(amount: string | number): string {
  const value = typeof amount === "string" ? Number.parseFloat(amount) : amount
  if (Number.isNaN(value)) return "৳0"
  return `৳${value.toLocaleString("en-BD", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`
}
