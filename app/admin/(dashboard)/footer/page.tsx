"use client"

import { useEffect, useState } from "react"
import { PanelBottom, Plus, RefreshCw, Save, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { FooterSettings } from "@/lib/site-data"

export default function AdminFooterPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Settings
  const [brandName, setBrandName] = useState("Rofaar")
  const [brandTagline, setBrandTagline] = useState("Faith, Refined.")
  const [aboutText, setAboutText] = useState("")
  const [columns, setColumns] = useState<
    Array<{
      title: string
      links: Array<{ label: string; href: string }>
    }>
  >([])
  const [facebook, setFacebook] = useState("")
  const [instagram, setInstagram] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [youtube, setYoutube] = useState("")
  const [copyrightText, setCopyrightText] = useState("")

  async function fetchSettings() {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/settings?key=footer")
      if (res.ok) {
        const data: FooterSettings = await res.json()
        if (data) {
          setBrandName(data.brandName || "Rofaar")
          setBrandTagline(data.brandTagline || "Faith, Refined.")
          setAboutText(data.aboutText || "")
          setColumns(data.columns || [])
          setFacebook(data.socialLinks?.facebook || "")
          setInstagram(data.socialLinks?.instagram || "")
          setWhatsapp(data.socialLinks?.whatsapp || "")
          setYoutube(data.socialLinks?.youtube || "")
          setCopyrightText(data.copyrightText || "")
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

  function addColumn() {
    setColumns([...columns, { title: "New Column", links: [{ label: "Link", href: "/" }] }])
  }

  function removeColumn(colIndex: number) {
    setColumns(columns.filter((_, i) => i !== colIndex))
  }

  function updateColumnTitle(colIndex: number, val: string) {
    const copy = [...columns]
    copy[colIndex].title = val
    setColumns(copy)
  }

  function addLinkToColumn(colIndex: number) {
    const copy = [...columns]
    copy[colIndex].links.push({ label: "New Link", href: "/" })
    setColumns(copy)
  }

  function updateLink(colIndex: number, linkIndex: number, field: string, val: string) {
    const copy = [...columns]
    copy[colIndex].links[linkIndex] = {
      ...copy[colIndex].links[linkIndex],
      [field]: val,
    }
    setColumns(copy)
  }

  function removeLink(colIndex: number, linkIndex: number) {
    const copy = [...columns]
    copy[colIndex].links = copy[colIndex].links.filter((_, i) => i !== linkIndex)
    setColumns(copy)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const payload: FooterSettings = {
        brandName,
        brandTagline,
        aboutText,
        columns,
        socialLinks: {
          facebook: facebook.trim() || undefined,
          instagram: instagram.trim() || undefined,
          whatsapp: whatsapp.trim() || undefined,
          youtube: youtube.trim() || undefined,
        },
        copyrightText,
      }

      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "footer",
          value: payload,
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to save footer settings")
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
            Footer & Social Media
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Configure footer branding, menu columns, policy links, contact details, and social channels.
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
          Footer settings updated successfully! Live storefront is updated.
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-destructive/15 p-4 text-sm font-semibold text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand & About */}
        <Card>
          <CardHeader>
            <CardTitle>Footer Brand Summary</CardTitle>
            <CardDescription>
              About copy and brand mission displayed on the left column.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase">
                  Brand Name
                </label>
                <Input
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="Rofaar"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase">
                  Tagline
                </label>
                <Input
                  value={brandTagline}
                  onChange={(e) => setBrandTagline(e.target.value)}
                  placeholder="Faith, Refined."
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground uppercase">
                Footer About Statement
              </label>
              <Textarea
                value={aboutText}
                onChange={(e) => setAboutText(e.target.value)}
                rows={3}
                placeholder="Faith, Refined. Thoughtful Islamic gifts for the people who mean the most..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Footer Navigation Columns */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Footer Columns & Links</CardTitle>
              <CardDescription>
                Customize columns for catalog navigation, customer care, and concierge.
              </CardDescription>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addColumn}>
              <Plus className="size-3.5 mr-1" />
              Add Column
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {columns.map((col, colIdx) => (
              <div
                key={colIdx}
                className="rounded-xl border border-border/80 bg-muted/20 p-4 space-y-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">
                      Column Heading Title
                    </label>
                    <Input
                      value={col.title}
                      onChange={(e) => updateColumnTitle(colIdx, e.target.value)}
                      placeholder="e.g. Shop, Policies, Concierge"
                      className="font-semibold"
                    />
                  </div>
                  <div className="pt-4 flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addLinkToColumn(colIdx)}
                    >
                      <Plus className="size-3 mr-1" />
                      Add Link
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeColumn(colIdx)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 pl-2 border-l-2 border-primary/20">
                  {col.links.map((link, linkIdx) => (
                    <div key={linkIdx} className="flex items-center gap-2">
                      <Input
                        value={link.label}
                        onChange={(e) =>
                          updateLink(colIdx, linkIdx, "label", e.target.value)
                        }
                        placeholder="Link Label"
                        className="flex-1"
                      />
                      <Input
                        value={link.href}
                        onChange={(e) =>
                          updateLink(colIdx, linkIdx, "href", e.target.value)
                        }
                        placeholder="URL (e.g. /pages/refund-policy)"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => removeLink(colIdx, linkIdx)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Social Media Links & Copyright */}
        <Card>
          <CardHeader>
            <CardTitle>Social Media & Copyright</CardTitle>
            <CardDescription>
              Connect official social channels and customize the bottom copyright note.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase">
                  Facebook Page Link
                </label>
                <Input
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  placeholder="https://facebook.com/rofaar"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase">
                  Instagram Link
                </label>
                <Input
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="https://instagram.com/rofaar"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase">
                  WhatsApp Support Link
                </label>
                <Input
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="https://wa.me/8801700000000"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase">
                  YouTube Channel Link
                </label>
                <Input
                  value={youtube}
                  onChange={(e) => setYoutube(e.target.value)}
                  placeholder="https://youtube.com/@rofaar"
                />
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-semibold text-foreground uppercase">
                Copyright Notice
              </label>
              <Input
                value={copyrightText}
                onChange={(e) => setCopyrightText(e.target.value)}
                placeholder="© 2026 Rofaar. All rights reserved."
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button size="lg" type="submit" disabled={saving}>
            <Save className="size-4 mr-2" />
            {saving ? "Saving Changes..." : "Save Footer Settings"}
          </Button>
        </div>
      </form>
    </div>
  )
}
