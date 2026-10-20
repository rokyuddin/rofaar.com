"use client"

import { useEffect, useState } from "react"
import { Edit2, ExternalLink, FileText, Plus, RefreshCw, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

interface PageItem {
  id: number
  slug: string
  title: string
  content: string
  excerpt: string | null
  metaTitle: string | null
  metaDescription: string | null
  isPublished: boolean
  updatedAt: string
}

export default function AdminPagesManager() {
  const [pagesList, setPagesList] = useState<PageItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)

  // Form states
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [metaTitle, setMetaTitle] = useState("")
  const [metaDescription, setMetaDescription] = useState("")
  const [isPublished, setIsPublished] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetchPages() {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/pages")
      if (res.ok) {
        const data = await res.json()
        setPagesList(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPages()
  }, [])

  function resetForm() {
    setTitle("")
    setSlug("")
    setExcerpt("")
    setContent("")
    setMetaTitle("")
    setMetaDescription("")
    setIsPublished(true)
    setEditingId(null)
    setShowForm(false)
    setError(null)
  }

  function startEdit(item: PageItem) {
    setTitle(item.title)
    setSlug(item.slug)
    setExcerpt(item.excerpt || "")
    setContent(item.content)
    setMetaTitle(item.metaTitle || "")
    setMetaDescription(item.metaDescription || "")
    setIsPublished(item.isPublished)
    setEditingId(item.id)
    setShowForm(true)
    setError(null)
  }

  function handleTitleChange(val: string) {
    setTitle(val)
    if (!editingId) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
      )
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const payload = {
        title,
        slug,
        excerpt,
        content,
        metaTitle,
        metaDescription,
        isPublished,
      }

      const res = editingId
        ? await fetch(`/api/admin/pages/${editingId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/admin/pages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })

      const json = await res.json()
      if (!res.ok) {
        throw new Error(json.error || "Failed to save page")
      }

      resetForm()
      await fetchPages()
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this page?")) return

    try {
      const res = await fetch(`/api/admin/pages/${id}`, { method: "DELETE" })
      if (res.ok) {
        fetchPages()
      }
    } catch (err) {
      console.error(err)
    }
  }

  async function toggleStatus(item: PageItem) {
    try {
      await fetch(`/api/admin/pages/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !item.isPublished }),
      })
      fetchPages()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-semibold tracking-wide text-[#342318]">
            Pages & Policies CMS
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage About Us, Privacy Policy, Terms & Conditions, Refund Policy, and custom pages.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchPages} disabled={loading}>
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
              Create Page
            </Button>
          )}
        </div>
      </div>

      {showForm && (
        <Card className="border-primary/40 bg-white/95 shadow-sm animate-in fade-in-50">
          <CardHeader>
            <CardTitle>{editingId ? "Edit Page Content" : "Create New Page"}</CardTitle>
            <CardDescription>
              Write content in standard text or Markdown formatting. Changes update live immediately.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              {error && (
                <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive font-medium">
                  {error}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground uppercase">
                    Page Title *
                  </label>
                  <Input
                    required
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Refund Policy"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground uppercase">
                    URL Slug *
                  </label>
                  <Input
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. refund-policy"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase">
                  Short Excerpt / Summary
                </label>
                <Input
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="A one-sentence summary for search and previews..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase">
                  Page Content (Markdown / Formatted Text) *
                </label>
                <Textarea
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write headings (# Title, ## Section), bullet points (- Item), and paragraphs..."
                  rows={12}
                  className="font-mono text-sm leading-relaxed"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground uppercase">
                    Meta Title (SEO)
                  </label>
                  <Input
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder="e.g. Refund & Return Policy | Rofaar"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground uppercase">
                    Meta Description (SEO)
                  </label>
                  <Input
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="Search engine snippet..."
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="pagePublished"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="size-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="pagePublished" className="text-sm font-medium">
                  Published & Accessible to Customers
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : editingId ? "Update Page" : "Publish Page"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Pages Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/40 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Page Title</th>
                  <th className="px-4 py-3">URL Route</th>
                  <th className="px-4 py-3">Summary</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {pagesList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                      {loading ? "Loading pages..." : "No pages found."}
                    </td>
                  </tr>
                ) : (
                  pagesList.map((p) => (
                    <tr key={p.id} className="transition-colors hover:bg-muted/20">
                      <td className="px-4 py-3 font-semibold text-foreground">
                        <div className="flex items-center gap-2">
                          <FileText className="size-4 text-primary shrink-0" />
                          <span>{p.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-primary">
                        /pages/{p.slug}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground max-w-xs truncate">
                        {p.excerpt || p.content.slice(0, 80) + "..."}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => toggleStatus(p)}
                          className="cursor-pointer"
                        >
                          {p.isPublished ? (
                            <Badge className="bg-emerald-600 hover:bg-emerald-700">
                              Published
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-muted-foreground">
                              Draft
                            </Badge>
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <a
                            href={`/pages/${p.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
                            title="View on site"
                          >
                            <ExternalLink className="size-3.5" />
                          </a>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => startEdit(p)}
                            title="Edit"
                          >
                            <Edit2 className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleDelete(p.id)}
                            className="text-destructive hover:text-destructive"
                            title="Delete"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
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
