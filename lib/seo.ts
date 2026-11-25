export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://rofaar.com"
).replace(/\/$/, "")
export const SITE_NAME = "Rofaar"
export const SITE_DESCRIPTION =
  "Thoughtful Islamic gifts for the people who mean the most. Premium Parents’ Islamic Gift Combos for Bangladesh."

export function absoluteUrl(path: string) {
  if (/^https?:\/\//.test(path)) return path
  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`
}
