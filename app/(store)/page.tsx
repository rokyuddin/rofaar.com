import Image from "next/image"
import Link from "next/link"
import { and, desc, eq } from "drizzle-orm"
import { CategoryIcons } from "@/components/store/category-icons"
import { OccasionCards } from "@/components/store/occasion-cards"
import { ProductCard } from "@/components/store/product-card"
import { Button } from "@/components/ui/button"
import { db } from "@/lib/db"
import { products } from "@/lib/db/schema"
import {
  getActiveBanners,
  getActiveCategories,
  getOccasionCards,
  getPageBySlug,
} from "@/lib/site-data"


export default async function HomePage() {
  const [bannersList, categoriesList, activeProducts, aboutPage, occasionsList] =
    await Promise.all([
      getActiveBanners(),
      getActiveCategories(),
      db
        .select()
        .from(products)
        .where(eq(products.isActive, true))
        .orderBy(desc(products.featured), desc(products.createdAt)),
      getPageBySlug("about-us"),
      getOccasionCards(),
    ])

  const heroBanner = bannersList[0]

  return (
    <div className="flex flex-col gap-16 pb-20">
      {/* Dynamic Hero Banner */}
      <section className="relative isolate min-h-[75vh] overflow-hidden flex items-center">
        <div
          aria-hidden
          className="absolute inset-0 transition-all"
          style={{
            background:
              heroBanner?.bgGradient ||
              "radial-gradient(ellipse at 20% 20%, #fff8ef 0%, transparent 55%), radial-gradient(ellipse at 80% 10%, #e8c9a8 0%, transparent 45%), linear-gradient(160deg, #f7f0e4 0%, #efe0cc 45%, #e2c9a8 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.10]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23A85D12' fill-opacity='0.45'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />

        <div className="relative mx-auto grid min-h-[75vh] w-full max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-7">
            <div className="flex items-center gap-4">
              <Image
                src="/logo.jpg"
                alt="Rofaar"
                width={72}
                height={84}
                className="h-16 w-auto object-contain sm:h-20"
                priority
              />
              <div className="flex flex-col gap-1">
                <p className="font-heading text-4xl font-semibold tracking-tight text-[#342318] sm:text-5xl">
                  Rofaar
                </p>
                <p className="text-xs sm:text-sm font-bold tracking-[0.25em] text-[#a85d12] uppercase">
                  {heroBanner?.badge || "Faith, Refined."}
                </p>
              </div>
            </div>

            <h1 className="font-heading text-4xl leading-[1.15] font-bold text-[#342318] sm:text-5xl lg:text-6xl">
              {heroBanner?.title ||
                "Thoughtful Islamic gifts for the people who mean the most"}
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-[#5a4332] sm:text-lg">
              {heroBanner?.subtitle ||
                "Premium Parents’ Islamic Gift Combos and prayerful essentials, delivered across Bangladesh with quiet care."}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Button
                render={
                  <Link href={heroBanner?.ctaLink || "/products?category=Gift%20Combos"} />
                }
                size="lg"
                className="shadow-sm font-semibold px-8"
              >
                {heroBanner?.ctaText || "Shop Gift Combos"}
              </Button>
              {heroBanner?.secondaryCtaText && (
                <Button
                  render={
                    <Link href={heroBanner.secondaryCtaLink || "/products"} />
                  }
                  size="lg"
                  variant="outline"
                  className="bg-white/40 border-[#342318]/20 text-[#342318] hover:bg-white"
                >
                  {heroBanner.secondaryCtaText}
                </Button>
              )}
            </div>
          </div>

          {/* Hero Image Showcase */}
          {heroBanner?.imageUrl && (
            <div className="relative lg:col-span-5 flex justify-center">
              <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-3xl border border-white/60 bg-white/20 p-2 shadow-2xl backdrop-blur-xs">
                <Image
                  src={heroBanner.imageUrl}
                  alt={heroBanner.title}
                  fill
                  className="object-cover rounded-2xl"
                  priority
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Dynamic Categories */}
      <CategoryIcons categories={categoriesList} />

      <OccasionCards cards={occasionsList} />

      {/* Products Catalog Showcase */}
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 sm:px-6">
        <div className="flex items-end justify-between gap-4 border-b border-border/60 pb-4">
          <div>
            <span className="text-xs font-bold tracking-widest text-primary uppercase">
              Curated Gift Sets
            </span>
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-[#342318] sm:text-4xl">
              Exclusive Combos for Parents
            </h2>
          </div>
          <Link
            href="/products"
            className="text-sm font-semibold text-primary hover:underline"
          >
            View all catalog ›
          </Link>
        </div>

        {activeProducts.length === 0 ? (
          <p className="text-muted-foreground py-10 text-center">
            No products available at this moment.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {activeProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Dynamic About Us Section */}
      {aboutPage && (
        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl border border-[#d6b36a]/30 bg-gradient-to-br from-[#fff8ef] via-[#f9f1e4] to-[#f0dfcb] p-8 sm:p-12 lg:p-16">
            <div className="max-w-2xl flex flex-col gap-5">
              <span className="text-xs font-bold tracking-widest text-[#a85d12] uppercase">
                Our Story & Commitment
              </span>
              <h2 className="font-heading text-3xl font-bold tracking-tight text-[#342318] sm:text-4xl">
                {aboutPage.title}
              </h2>
              <p className="text-base sm:text-lg leading-relaxed text-[#5a4332]">
                {aboutPage.excerpt ||
                  "At ROFAAR, we curate complete, ready-to-gift prayer hampers and lifestyle essentials specifically designed for Mother and Father."}
              </p>
              <div>
                <Button
                  render={<Link href="/pages/about-us" />}
                  variant="outline"
                  className="border-[#342318]/30 font-semibold"
                >
                  Read our full story
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
