import Image from "next/image"
import Link from "next/link"
import { and, desc, eq } from "drizzle-orm"
import { CategoryIcons } from "@/components/store/category-icons"
import { OccasionCards } from "@/components/store/occasion-cards"
import { ProductCard } from "@/components/store/product-card"
import { Button } from "@/components/ui/button"
import { db } from "@/lib/db"
import { products } from "@/lib/db/schema"

export default async function HomePage() {
  const display = await db
    .select()
    .from(products)
    .where(and(eq(products.isActive, true), eq(products.featured, true)))
    .orderBy(desc(products.createdAt))
    .limit(4)

  return (
    <div className="flex flex-col gap-16 pb-20">
      <section className="relative isolate min-h-[78vh] overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,#fff8ef_0%,transparent_55%),radial-gradient(ellipse_at_80%_10%,#e8c9a8_0%,transparent_45%),linear-gradient(160deg,#f7f0e4_0%,#efe0cc_45%,#e2c9a8_100%)]"
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23A85D12' fill-opacity='0.45'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />

        <div className="relative mx-auto flex min-h-[78vh] w-full max-w-7xl flex-col justify-center gap-8 px-4 py-16 sm:px-6">
          <div className="flex max-w-2xl flex-col gap-6">
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
                <p className="text-sm tracking-[0.2em] text-[#a85d12] uppercase">
                  Faith, Refined.
                </p>
              </div>
            </div>

            <h1 className="font-heading text-4xl leading-tight font-semibold text-[#342318] sm:text-5xl">
              Thoughtful Islamic gifts for the people who mean the most
            </h1>
            <p className="max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
              Premium Parents’ Islamic Gift Combos and prayerful essentials,
              delivered across Bangladesh with quiet care.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button render={<Link href="/products" />} size="lg">
                Shop gifts
              </Button>
              <Button
                render={<Link href="/products?category=Gift%20Combos" />}
                size="lg"
                variant="outline"
              >
                Gift combos
              </Button>
            </div>
          </div>
        </div>
      </section>

      <CategoryIcons />
      <OccasionCards />

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-[#342318] sm:text-4xl">
            Featured gifts
          </h2>
          <Link
            href="/products"
            className="text-sm font-medium text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        {display.length === 0 ? (
          <p className="text-muted-foreground">
            Products will appear here once the catalog is seeded.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
            {display.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
