"use client"

import { useEffect, useState } from "react"
import { RefreshCw, Save, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { GeneralSettings } from "@/lib/site-data"

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Settings
  const [storeName, setStoreName] = useState("Rofaar")
  const [storeTagline, setStoreTagline] = useState("Faith, Refined.")
  const [currencySymbol, setCurrencySymbol] = useState("৳")
  const [contactEmail, setContactEmail] = useState("hello@rofaar.com")
  const [contactPhone, setContactPhone] = useState("+880 17 0000 0000")
  const [address, setAddress] = useState("Banani, Dhaka, Bangladesh")
  const [insideDhakaShipping, setInsideDhakaShipping] = useState(80)
  const [outsideDhakaShipping, setOutsideDhakaShipping] = useState(150)
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(5000)

  async function fetchSettings() {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/settings?key=general")
      if (res.ok) {
        const data: GeneralSettings = await res.json()
        if (data) {
          setStoreName(data.storeName || "Rofaar")
          setStoreTagline(data.storeTagline || "Faith, Refined.")
          setCurrencySymbol(data.currencySymbol || "৳")
          setContactEmail(data.contactEmail || "hello@rofaar.com")
          setContactPhone(data.contactPhone || "+880 17 0000 0000")
          setAddress(data.address || "Banani, Dhaka, Bangladesh")
          setInsideDhakaShipping(data.insideDhakaShipping ?? 80)
          setOutsideDhakaShipping(data.outsideDhakaShipping ?? 150)
          setFreeShippingThreshold(data.freeShippingThreshold ?? 5000)
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

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const payload: GeneralSettings = {
        storeName,
        storeTagline,
        currencySymbol,
        contactEmail,
        contactPhone,
        address,
        insideDhakaShipping: Number(insideDhakaShipping),
        outsideDhakaShipping: Number(outsideDhakaShipping),
        freeShippingThreshold: Number(freeShippingThreshold),
      }

      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "general",
          value: payload,
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to save store settings")
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
            General Store Settings
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage store brand metadata, contact info, and delivery tariffs.
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
          Store settings saved successfully!
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-destructive/15 p-4 text-sm font-semibold text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Branding & Identity</CardTitle>
            <CardDescription>Store name and slogan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase">
                  Store Name
                </label>
                <Input
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="Rofaar"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase">
                  Store Tagline
                </label>
                <Input
                  value={storeTagline}
                  onChange={(e) => setStoreTagline(e.target.value)}
                  placeholder="Faith, Refined."
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase">
                  Currency Symbol
                </label>
                <Input
                  value={currencySymbol}
                  onChange={(e) => setCurrencySymbol(e.target.value)}
                  placeholder="৳"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Concierge & Contact Details</CardTitle>
            <CardDescription>
              Official communication channels for customer care.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase">
                  Support Email
                </label>
                <Input
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="hello@rofaar.com"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase">
                  Support Phone / Hotline
                </label>
                <Input
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+880 17 0000 0000"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase">
                  Operating Address
                </label>
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Banani, Dhaka, Bangladesh"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Delivery Rates (Nationwide Bangladesh)</CardTitle>
            <CardDescription>
              Delivery fee rates applied automatically at checkout.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase">
                  Inside Dhaka (BDT)
                </label>
                <Input
                  type="number"
                  value={insideDhakaShipping}
                  onChange={(e) => setInsideDhakaShipping(Number(e.target.value))}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase">
                  Outside Dhaka (BDT)
                </label>
                <Input
                  type="number"
                  value={outsideDhakaShipping}
                  onChange={(e) => setOutsideDhakaShipping(Number(e.target.value))}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase">
                  Free Delivery Over (BDT)
                </label>
                <Input
                  type="number"
                  value={freeShippingThreshold}
                  onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button size="lg" type="submit" disabled={saving}>
            <Save className="size-4 mr-2" />
            {saving ? "Saving Changes..." : "Save Store Settings"}
          </Button>
        </div>
      </form>
    </div>
  )
}
