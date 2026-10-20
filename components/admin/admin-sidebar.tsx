"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  CompassIcon,
  ExternalLinkIcon,
  FileTextIcon,
  ImageIcon,
  LayoutDashboardIcon,
  LayersIcon,
  PackageIcon,
  PanelBottomIcon,
  SettingsIcon,
  ShoppingBagIcon,
  UsersIcon,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { LogoutButton } from "@/components/admin/logout-button"

const primaryNav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboardIcon },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBagIcon },
  { href: "/admin/products", label: "Products", icon: PackageIcon },
  { href: "/admin/categories", label: "Categories", icon: LayersIcon },
  { href: "/admin/banners", label: "Hero Banners", icon: ImageIcon },
  { href: "/admin/customers", label: "Customers", icon: UsersIcon },
]

const storefrontNav = [
  { href: "/admin/pages", label: "Pages & Policies", icon: FileTextIcon },
  { href: "/admin/navigation", label: "Navbar & Announce", icon: CompassIcon },
  { href: "/admin/footer", label: "Footer & Social", icon: PanelBottomIcon },
  { href: "/admin/settings", label: "Store Settings", icon: SettingsIcon },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="border-r border-border/80">
      <SidebarHeader className="border-b border-border/70 px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/admin" className="flex flex-col">
            <span className="font-heading text-xl font-bold tracking-tight text-[#342318]">
              Rofaar Admin
            </span>
            <span className="text-[10px] font-semibold tracking-widest text-[#a85d12] uppercase">
              Management Suite
            </span>
          </Link>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            title="Open Live Store in new tab"
            className="flex size-7 items-center justify-center rounded-md border border-border/60 bg-muted/50 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ExternalLinkIcon className="size-3.5" />
          </a>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3 space-y-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Commerce
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {primaryNav.map((item) => {
                const active =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href)
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={active}
                      render={<Link href={item.href} />}
                      className="font-medium"
                    >
                      <item.icon className="size-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Storefront & CMS
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {storefrontNav.map((item) => {
                const active = pathname.startsWith(item.href)
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={active}
                      render={<Link href={item.href} />}
                      className="font-medium"
                    >
                      <item.icon className="size-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/70 p-3">
        <LogoutButton />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
