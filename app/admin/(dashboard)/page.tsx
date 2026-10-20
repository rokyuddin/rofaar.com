import Link from "next/link"
import { count, desc, eq, sql } from "drizzle-orm"
import type { Metadata } from "next"
import {
  ArrowUpRight,
  Compass,
  FileText,
  ImageIcon,
  Layers,
  Package,
  ShoppingBag,
  TrendingUp,
  Users,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { db } from "@/lib/db"
import { banners, categories, customers, orders, pages, products } from "@/lib/db/schema"
import { formatBdt } from "@/lib/format"
import { OrderStatusBadge } from "@/components/admin/order-status-badge"

export const metadata: Metadata = {
  title: "Admin Dashboard | Rofaar",
}



export default async function AdminDashboardPage() {
  const [
    [{ value: totalOrders }],
    [{ value: pendingOrders }],
    [{ value: revenue }],
    [{ value: customerCount }],
    [{ value: productCount }],
    [{ value: categoryCount }],
    [{ value: bannerCount }],
    [{ value: pageCount }],
    recentOrders,
  ] = await Promise.all([
    db.select({ value: count() }).from(orders),
    db.select({ value: count() }).from(orders).where(eq(orders.status, "pending")),
    db
      .select({
        value: sql<string>`coalesce(sum(${orders.total}), 0)`,
      })
      .from(orders)
      .where(sql`${orders.status} != 'cancelled'`),
    db.select({ value: count() }).from(customers),
    db.select({ value: count() }).from(products),
    db.select({ value: count() }).from(categories),
    db.select({ value: count() }).from(banners),
    db.select({ value: count() }).from(pages),
    db.select().from(orders).orderBy(desc(orders.createdAt)).limit(5),
  ])

  const stats = [
    {
      label: "Total Revenue",
      value: formatBdt(revenue),
      subtext: "All completed & processing orders",
      icon: TrendingUp,
      tone: "text-emerald-700 bg-emerald-50 border-emerald-200",
    },
    {
      label: "Pending Orders",
      value: String(pendingOrders),
      subtext: "Needs fulfillment review",
      icon: ShoppingBag,
      tone: "text-amber-700 bg-amber-50 border-amber-200",
    },
    {
      label: "Total Orders",
      value: String(totalOrders),
      subtext: "Lifetime order volume",
      icon: ShoppingBag,
      tone: "text-blue-700 bg-blue-50 border-blue-200",
    },
    {
      label: "Active Products",
      value: String(productCount),
      subtext: "In stock and ready to gift",
      icon: Package,
      tone: "text-purple-700 bg-purple-50 border-purple-200",
    },
    {
      label: "Customers",
      value: String(customerCount),
      subtext: "Registered shoppers",
      icon: Users,
      tone: "text-stone-700 bg-stone-50 border-stone-200",
    },
  ]

  const quickLinks = [
    {
      title: "Hero Banners",
      desc: `${bannerCount} dynamic banners active`,
      href: "/admin/banners",
      icon: ImageIcon,
    },
    {
      title: "Categories",
      desc: `${categoryCount} catalog filters`,
      href: "/admin/categories",
      icon: Layers,
    },
    {
      title: "Navbar & Announcement",
      desc: "Customize header text & menu",
      href: "/admin/navigation",
      icon: Compass,
    },
    {
      title: "Pages & Policies",
      desc: `${pageCount} dynamic CMS pages`,
      href: "/admin/pages",
      icon: FileText,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Executive Welcome Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-3xl font-bold tracking-tight text-[#342318]">
              Dashboard
            </h1>
            <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-300">
              Neon PostgreSQL Connected
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Complete store performance and dynamic content management suite.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button render={<Link href="/admin/products/new" />} size="sm">
            <Package className="size-4 mr-1.5" />
            Add Product
          </Button>
          <Button
            render={
              <a href="/" target="_blank" rel="noopener noreferrer" />
            }
            size="sm"
            variant="outline"
          >
            <ArrowUpRight className="size-4 mr-1.5" />
            Live Storefront
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((s) => (
          <Card key={s.label} className="border-border/80 shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                {s.label}
              </span>
              <span className={`inline-flex p-1.5 rounded-lg border ${s.tone}`}>
                <s.icon className="size-4" />
              </span>
            </CardHeader>
            <CardContent>
              <div className="font-heading text-2xl font-bold text-[#342318]">
                {s.value}
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground font-medium">
                {s.subtext}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Access Control Modules */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
          Storefront Dynamic Modules
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group flex flex-col justify-between rounded-xl border border-border/70 bg-white p-5 shadow-xs transition-all hover:border-primary hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <item.icon className="size-5" />
                </span>
                <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div className="mt-4">
                <h3 className="font-heading text-base font-semibold text-[#342318] group-hover:text-primary">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Orders Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              Latest incoming gift combo orders from customers across Bangladesh.
            </CardDescription>
          </div>
          <Button render={<Link href="/admin/orders" />} variant="outline" size="sm">
            View All Orders
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/40 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Order Number</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">City / Area</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      No customer orders placed yet.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 font-mono font-semibold text-primary">
                        <Link href={`/admin/orders/${ord.id}`} className="hover:underline">
                          #{ord.orderNumber}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-foreground">{ord.shippingName}</div>
                        <div className="text-xs text-muted-foreground">{ord.shippingPhone}</div>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {ord.shippingCity}
                      </td>
                      <td className="px-4 py-3 font-semibold text-foreground">
                        {formatBdt(ord.total)}
                      </td>
                      <td className="px-4 py-3">
                        <OrderStatusBadge status={ord.status} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          render={<Link href={`/admin/orders/${ord.id}`} />}
                          variant="ghost"
                          size="sm"
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
