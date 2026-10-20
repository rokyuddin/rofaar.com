import { SiteFooter } from "@/components/store/site-footer"
import { SiteHeader } from "@/components/store/site-header"
import {
  getActiveCategories,
  getFooterSettings,
  getHeaderSettings,
} from "@/lib/site-data"

export const revalidate = 0 // Dynamic data from Neon

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [headerSettings, footerSettings, categories] = await Promise.all([
    getHeaderSettings(),
    getFooterSettings(),
    getActiveCategories(),
  ])

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <SiteHeader settings={headerSettings} categories={categories} />
      <main className="flex-1">{children}</main>
      <SiteFooter settings={footerSettings} />
    </div>
  )
}
