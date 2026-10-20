export function generateOrderNumber(): string {
  const now = new Date()
  const yyyy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, "0")
  const dd = String(now.getDate()).padStart(2, "0")
  const suffix = Math.floor(1000 + Math.random() * 9000)
  return `ROF-${yyyy}${mm}${dd}-${suffix}`
}
