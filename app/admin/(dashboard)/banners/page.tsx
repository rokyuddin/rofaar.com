"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Edit2, ImageIcon, Plus, RefreshCw, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ImageUpload } from "@/components/admin/image-upload"

interface BannerItem {
  id: number
  title: string
  subtitle: string | null
  badge: string | null
  ctaText: string | null
  ctaLink: string | null
  secondaryCtaText: string | null
  secondaryCtaLink: string | null
  imageUrl: string | null
  bgGradient: string | null
  sortOrder: number
  isActive: boolean
  createdAt: string
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<BannerItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)

  // Form states
  const [title, setTitle] = useState("")
  const [subtitle, setSubtitle] = useState("")
  const [badge, setBadge] = useState("FAITH, REFINED")
  const [ctaText, setCtaText] = useState("Shop Combos")
  const [ctaLink, setCtaLink] = useState("/products?category=Gift%20Combos")
  const [secondaryCtaText, setSecondaryCtaText] = useState("Explore Catalog")
  const [secondaryCtaLink, setSecondaryCtaLink] = useState("/products")
  const [imageUrl, setImageUrl] = useState("/products/the-parents-prayer-combo.jpg")
  const [bgGradient, setBgGradient] = useState(
    "linear-gradient(160deg,#f7f0e4_0%,#efe0cc_45%,#e2c9a8_100%)"
  )
  const [sortOrder, setSortOrder] = useState(0)
  const [isActive, setIsActive] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetchBanners() {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/banners")
      if (res.ok) {
        const data = await res.json()
        setBanners(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBanners()
  }, [])

  function resetForm() {
    setTitle("")
    setSubtitle("")
    setBadge("FAITH, REFINED")
    setCtaText("Shop Combos")
    setCtaLink("/products?category=Gift%20Combos")
    setSecondaryCtaText("Explore Catalog")
    setSecondaryCtaLink("/products")
    setImageUrl("/products/the-parents-prayer-combo.jpg")
    setBgGradient("linear-gradient(160deg,#f7f0e4_0%,#efe0cc_45%,#e2c9a8_100%)")
    setSortOrder(0)
    setIsActive(true)
    setEditingId(null)
    setShowForm(false)
    setError(null)
  }

  function startEdit(item: BannerItem) {
    setTitle(item.title)
    setSubtitle(item.subtitle || "")
    setBadge(item.badge || "")
    setCtaText(item.ctaText || "")
    setCtaLink(item.ctaLink || "")
    setSecondaryCtaText(item.secondaryCtaText || "")
    setSecondaryCtaLink(item.secondaryCtaLink || "")
    setImageUrl(item.imageUrl || "")
    setBgGradient(
      item.bgGradient ||
        "linear-gradient(160deg,#f7f0e4_0%,#efe0cc_45%,#e2c9a8_100%)"
    )
    setSortOrder(item.sortOrder)
    setIsActive(item.isActive)
    setEditingId(item.id)
    setShowForm(true)
    setError(null)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const payload = {
        title,
        subtitle,
        badge,
        ctaText,
        ctaLink,
        secondaryCtaText,
        secondaryCtaLink,
        imageUrl,
        bgGradient,
        sortOrder: Number(sortOrder),
        isActive,
      }

      const res = editingId
        ? await fetch(`/api/admin/banners/${editingId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/admin/banners", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })

      const json = await res.json()
      if (!res.ok) {
        throw new Error(json.error || "Failed to save banner")
      }

      resetForm()
      await fetchBanners()
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this banner?")) return

    try {
      const res = await fetch(`/api/admin/banners/${id}`, { method: "DELETE" })
      if (res.ok) {
        fetchBanners()
      }
    } catch (err) {
      console.error(err)
    }
  }

  async function toggleStatus(item: BannerItem) {
    try {
      await fetch(`/api/admin/banners/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !item.isActive }),
      })
      fetchBanners()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-semibold tracking-wide text-[#342318]">
            Hero Banners
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage storefront banners, hero headlines, promotional badges, and CTA links.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchBanners} disabled={loading}>
            <RefreshCw className={`size-3.5 mr-1 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          {!showForm && (
            <Button
              size="sm"
              onClick={() => {
                resetForm()
                setShowForm(true)
              }}
            >
              <Plus className="size-4 mr-1" />
              Add Banner
            </Button>
          )}
        </div>
      </div>

      {showForm && (
        <Card className="border-primary/40 bg-white/95 shadow-sm animate-in fade-in-50">
          <CardHeader>
            <CardTitle>{editingId ? "Edit Hero Banner" : "New Hero Banner"}</CardTitle>
            <CardDescription>
              Craft eye-catching hero messaging for the store entrance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              {error && (
                <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive font-medium">
                  {error}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-foreground uppercase">
                    Headline Title *
                  </label>
                  <Input
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Thoughtful Islamic gifts for the people who mean the most"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground uppercase">
                    Badge Tagline
                  </label>
                  <Input
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="e.g. FAITH, REFINED"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase">
                  Subtitle Description
                </label>
                <Textarea
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Supporting copy for the banner..."
                  rows={2}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground uppercase">
                    Primary CTA Button Text
                  </label>
                  <Input
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    placeholder="e.g. Shop Combos"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground uppercase">
                    Primary CTA Link
                  </label>
                  <Input
                    value={ctaLink}
                    onChange={(e) => setCtaLink(e.target.value)}
                    placeholder="e.g. /products?category=Gift%20Combos"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground uppercase">
                    Secondary CTA Text (Optional)
                  </label>
                  <Input
                    value={secondaryCtaText}
                    onChange={(e) => setSecondaryCtaText(e.target.value)}
                    placeholder="e.g. Explore Catalog"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground uppercase">
                    Secondary CTA Link
                  </label>
                  <Input
                    value={secondaryCtaLink}
                    onChange={(e) => setSecondaryCtaLink(e.target.value)}
                    placeholder="e.g. /products"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <ImageUpload
                  value={imageUrl}
                  onChange={setImageUrl}
                  folder="banners"
                  label="Hero Banner Image"
                />

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground uppercase">
                    Background Gradient CSS
                  </label>
                  <Input
                    value={bgGradient}
                    onChange={(e) => setBgGradient(e.target.value)}
                    placeholder="linear-gradient(...)"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground uppercase">
                    Sort Order
                  </label>
                  <Input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="bannerActive"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="size-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="bannerActive" className="text-sm font-medium">
                    Active & Displayed on Homepage
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : editingId ? "Update Banner" : "Publish Banner"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Banners List */}
      <div className="grid gap-6">
        {banners.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              {loading ? "Loading banners..." : "No banners configured yet."}
            </CardContent>
          </Card>
        ) : (
          banners.map((item) => (
            <Card key={item.id} className="overflow-hidden border-border/80">
              <div className="grid gap-6 p-6 md:grid-cols-12 md:items-center">
                <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted md:col-span-3">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-muted-foreground">
                      <ImageIcon className="size-8" />
                    </div>
                  )}
                </div>

                <div className="space-y-2 md:col-span-7">
                  <div className="flex items-center gap-2">
                    {item.badge && <Badge variant="secondary">{item.badge}</Badge>}
                    <button
                      type="button"
                      onClick={() => toggleStatus(item)}
                      className="cursor-pointer"
                    >
                      {item.isActive ? (
                        <Badge className="bg-emerald-600 hover:bg-emerald-700">
                          Live on Store
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">
                          Draft / Inactive
                        </Badge>
                      )}
                    </button>
                    <span className="font-mono text-xs text-muted-foreground">
                      Order: {item.sortOrder}
                    </span>
                  </div>
                  <h3 className="font-heading text-xl font-bold text-[#342318]">
                    {item.title}
                  </h3>
                  {item.subtitle && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.subtitle}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 pt-1 text-xs">
                    <span className="rounded-md bg-primary/10 px-2 py-1 font-semibold text-primary">
                      CTA: {item.ctaText} → {item.ctaLink}
                    </span>
                    {item.secondaryCtaText && (
                      <span className="rounded-md bg-muted px-2 py-1 font-medium text-muted-foreground">
                        Secondary: {item.secondaryCtaText} → {item.secondaryCtaLink}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 md:col-span-2">
                  <Button variant="outline" size="sm" onClick={() => startEdit(item)}>
                    <Edit2 className="size-3.5 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleDelete(item.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
