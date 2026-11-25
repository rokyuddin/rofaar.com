import type { Metadata } from "next"
import { SiteFooter } from "@/components/store/site-footer"
import { SiteHeader } from "@/components/store/site-header"
import { NotFoundContent } from "@/components/store/not-found-content"
import {
  getActiveCategories,
  getFooterSettings,
  getHeaderSettings,
} from "@/lib/site-data"

export const metadata: Metadata = {
  title: "Page not found",
}

// Shown for URLs that match no route. It renders outside the (store) layout,
// so it adds the store header and footer itself.
export default async function NotFound() {
  const [headerSettings, footerSettings, categories] = await Promise.all([
    getHeaderSettings(),
    getFooterSettings(),
    getActiveCategories(),
  ])

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <SiteHeader settings={headerSettings} categories={categories} />
      <main className="flex-1">
        <NotFoundContent />
      </main>
      <SiteFooter settings={footerSettings} />
    </div>
  )
}
