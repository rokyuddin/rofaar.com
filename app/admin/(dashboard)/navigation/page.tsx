"use client"

import { useEffect, useState } from "react"
import { ArrowRight, Compass, Plus, RefreshCw, Save, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { HeaderSettings } from "@/lib/site-data"

export default function AdminNavigationPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Settings
  const [announcementEnabled, setAnnouncementEnabled] = useState(true)
  const [announcementText, setAnnouncementText] = useState("")
  const [announcementLink, setAnnouncementLink] = useState("")
  const [announcementBg, setAnnouncementBg] = useState("#342318")
  const [announcementTextColor, setAnnouncementTextColor] = useState("#f7f0e4")
  const [logoText, setLogoText] = useState("Rofaar")
  const [deliveryTagline, setDeliveryTagline] = useState("Delivering across Bangladesh")
  const [showSearch, setShowSearch] = useState(true)
  const [showCart, setShowCart] = useState(true)
  const [navLinks, setNavLinks] = useState<Array<{ label: string; href: string; highlight?: boolean }>>([])

  async function fetchSettings() {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/settings?key=header")
      if (res.ok) {
        const data: HeaderSettings = await res.json()
        if (data) {
          setAnnouncementEnabled(data.announcementEnabled ?? true)
          setAnnouncementText(data.announcementText || "")
          setAnnouncementLink(data.announcementLink || "")
          setAnnouncementBg(data.announcementBg || "#342318")
          setAnnouncementTextColor(data.announcementTextColor || "#f7f0e4")
          setLogoText(data.logoText || "Rofaar")
          setDeliveryTagline(data.deliveryTagline || "Delivering across Bangladesh")
          setShowSearch(data.showSearch !== false)
          setShowCart(data.showCart !== false)
          setNavLinks(data.navLinks || [])
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  function addNavLink() {
    setNavLinks([...navLinks, { label: "New Link", href: "/products", highlight: false }])
  }

  function updateNavLink(index: number, field: string, val: any) {
    const copy = [...navLinks]
    copy[index] = { ...copy[index], [field]: val }
    setNavLinks(copy)
  }

  function removeNavLink(index: number) {
    setNavLinks(navLinks.filter((_, i) => i !== index))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const payload: HeaderSettings = {
        announcementEnabled,
        announcementText,
        announcementLink,
        announcementBg,
        announcementTextColor,
        logoText,
        deliveryTagline,
        showSearch,
        showCart,
        navLinks,
      }

      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "header",
          value: payload,
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to save navigation settings")
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <RefreshCw className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-semibold tracking-wide text-[#342318]">
            Navbar & Navigation
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Control what appears in the top announcement bar, header brand, and navigation menu.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchSettings}>
            <RefreshCw className="size-3.5 mr-1" />
            Reload
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving}>
            <Save className="size-4 mr-1" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {success && (
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4 text-sm font-semibold text-emerald-800">
          Navigation and Header settings updated successfully! Changes are live on the store.
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-destructive/15 p-4 text-sm font-semibold text-destructive">
          {error}
        </div>
      )}

      {/* Live Preview Card */}
      <Card className="overflow-hidden border-border/80">
        <CardHeader className="bg-muted/30 pb-3">
          <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Live Preview (How it appears to visitors)
          </CardTitle>
        </CardHeader>
        <div className="border-t border-border/60">
          {announcementEnabled && announcementText && (
            <div
              style={{ backgroundColor: announcementBg, color: announcementTextColor }}
              className="px-4 py-2 text-center text-xs font-medium"
            >
              <span>{announcementText}</span>
              {announcementLink && <ArrowRight className="inline ml-1 size-3" />}
            </div>
          )}
          <div className="bg-[#fff8ef] px-6 py-4 flex items-center justify-between border-b border-border/60">
            <span className="font-heading text-2xl font-bold text-[#342318]">
              {logoText || "Rofaar"}
            </span>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>{deliveryTagline}</span>
              {showCart && (
                <span className="rounded-full bg-primary text-primary-foreground px-2 py-0.5 font-bold">
                  Cart (0)
                </span>
              )}
            </div>
          </div>
          <div className="bg-[#fff8ef] px-6 py-2 flex gap-4 text-xs font-medium text-muted-foreground border-b border-border/40 overflow-x-auto">
            {navLinks.map((l, i) => (
              <span
                key={i}
                className={l.highlight ? "text-primary font-bold" : "text-[#342318]"}
              >
                {l.label}
              </span>
            ))}
          </div>
        </div>
      </Card>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Top Announcement Bar Card */}
        <Card>
          <CardHeader>
            <CardTitle>Top Announcement Bar</CardTitle>
            <CardDescription>
              A high-visibility banner at the very top of every store page.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="announceEnable"
                checked={announcementEnabled}
                onChange={(e) => setAnnouncementEnabled(e.target.checked)}
                className="size-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="announceEnable" className="text-sm font-semibold">
                Enable Announcement Bar
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase">
                  Announcement Message
                </label>
                <Input
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  placeholder="e.g. Free gift packaging with every combo..."
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase">
                  Destination Link
                </label>
                <Input
                  value={announcementLink}
                  onChange={(e) => setAnnouncementLink(e.target.value)}
                  placeholder="e.g. /products?category=Gift%20Combos"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase">
                  Background Color (Hex)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={announcementBg}
                    onChange={(e) => setAnnouncementBg(e.target.value)}
                    className="size-9 rounded border cursor-pointer"
                  />
                  <Input
                    value={announcementBg}
                    onChange={(e) => setAnnouncementBg(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase">
                  Text Color (Hex)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={announcementTextColor}
                    onChange={(e) => setAnnouncementTextColor(e.target.value)}
                    className="size-9 rounded border cursor-pointer"
                  />
                  <Input
                    value={announcementTextColor}
                    onChange={(e) => setAnnouncementTextColor(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Brand & Header Layout */}
        <Card>
          <CardHeader>
            <CardTitle>Header Brand & Features</CardTitle>
            <CardDescription>
              Configure store branding text and header utilities.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase">
                  Logo / Brand Title
                </label>
                <Input
                  value={logoText}
                  onChange={(e) => setLogoText(e.target.value)}
                  placeholder="Rofaar"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase">
                  Delivery Tagline
                </label>
                <Input
                  value={deliveryTagline}
                  onChange={(e) => setDeliveryTagline(e.target.value)}
                  placeholder="Delivering across Bangladesh"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-6 pt-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showSearchBox"
                  checked={showSearch}
                  onChange={(e) => setShowSearch(e.target.checked)}
                  className="size-4 rounded border-gray-300 text-primary"
                />
                <label htmlFor="showSearchBox" className="text-sm font-medium">
                  Show Instant Search Box
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showCartBox"
                  checked={showCart}
                  onChange={(e) => setShowCart(e.target.checked)}
                  className="size-4 rounded border-gray-300 text-primary"
                />
                <label htmlFor="showCartBox" className="text-sm font-medium">
                  Show Cart Icon with Badge
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Menu Links */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Navbar Menu Links</CardTitle>
              <CardDescription>
                Customize links displayed across the main header bar.
              </CardDescription>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addNavLink}>
              <Plus className="size-3.5 mr-1" />
              Add Link
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {navLinks.map((link, idx) => (
              <div
                key={idx}
                className="flex flex-col gap-3 rounded-lg border border-border/70 p-3 sm:flex-row sm:items-center bg-muted/20"
              >
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">
                    Link Label
                  </label>
                  <Input
                    value={link.label}
                    onChange={(e) => updateNavLink(idx, "label", e.target.value)}
                    placeholder="e.g. Gift Combos"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">
                    Target URL
                  </label>
                  <Input
                    value={link.href}
                    onChange={(e) => updateNavLink(idx, "href", e.target.value)}
                    placeholder="/products"
                  />
                </div>
                <div className="flex items-center gap-2 pt-4">
                  <input
                    type="checkbox"
                    id={`highlight-${idx}`}
                    checked={Boolean(link.highlight)}
                    onChange={(e) => updateNavLink(idx, "highlight", e.target.checked)}
                    className="size-4 rounded text-primary"
                  />
                  <label htmlFor={`highlight-${idx}`} className="text-xs font-semibold">
                    Highlight
                  </label>
                </div>
                <div className="pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeNavLink(idx)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button size="lg" type="submit" disabled={saving}>
            <Save className="size-4 mr-2" />
            {saving ? "Saving Changes..." : "Save Navigation Settings"}
          </Button>
        </div>
      </form>
    </div>
  )
}
