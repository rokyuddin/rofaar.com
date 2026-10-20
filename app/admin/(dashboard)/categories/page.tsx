"use client"

import { useEffect, useState } from "react"
import {
  Edit2,
  Gift,
  Layers,
  Moon,
  Package,
  Plus,
  RefreshCw,
  Sparkles,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

interface CategoryItem {
  id: number
  name: string
  slug: string
  description: string | null
  icon: string | null
  imageUrl: string | null
  sortOrder: number
  isActive: boolean
  createdAt: string
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showNewForm, setShowNewForm] = useState(false)

  // Form states
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [icon, setIcon] = useState("gift")
  const [sortOrder, setSortOrder] = useState(0)
  const [isActive, setIsActive] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetchCategories() {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/categories")
      if (res.ok) {
        const data = await res.json()
        setCategories(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  function resetForm() {
    setName("")
    setSlug("")
    setDescription("")
    setIcon("gift")
    setSortOrder(0)
    setIsActive(true)
    setEditingId(null)
    setShowNewForm(false)
    setError(null)
  }

  function startEdit(cat: CategoryItem) {
    setName(cat.name)
    setSlug(cat.slug)
    setDescription(cat.description || "")
    setIcon(cat.icon || "gift")
    setSortOrder(cat.sortOrder)
    setIsActive(cat.isActive)
    setEditingId(cat.id)
    setShowNewForm(true)
    setError(null)
  }

  function handleNameChange(val: string) {
    setName(val)
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
        name,
        slug,
        description,
        icon,
        sortOrder: Number(sortOrder),
        isActive,
      }

      const res = editingId
        ? await fetch(`/api/admin/categories/${editingId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/admin/categories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })

      const json = await res.json()
      if (!res.ok) {
        throw new Error(json.error || "Failed to save category")
      }

      resetForm()
      await fetchCategories()
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this category?")) return

    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" })
      if (res.ok) {
        fetchCategories()
      }
    } catch (err) {
      console.error(err)
    }
  }

  async function toggleStatus(cat: CategoryItem) {
    try {
      await fetch(`/api/admin/categories/${cat.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !cat.isActive }),
      })
      fetchCategories()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-semibold tracking-wide text-[#342318]">
            Categories
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage store categories, catalog filters, and navigation groupings.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchCategories} disabled={loading}>
            <RefreshCw className={`size-3.5 mr-1 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          {!showNewForm && (
            <Button
              size="sm"
              onClick={() => {
                resetForm()
                setShowNewForm(true)
              }}
            >
              <Plus className="size-4 mr-1" />
              Add Category
            </Button>
          )}
        </div>
      </div>

      {showNewForm && (
        <Card className="border-primary/40 bg-white/90 shadow-sm animate-in fade-in-50">
          <CardHeader>
            <CardTitle>{editingId ? "Edit Category" : "Add New Category"}</CardTitle>
            <CardDescription>
              Configure category details, icon, and display ordering.
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
                    Category Name *
                  </label>
                  <Input
                    required
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Gift Combos"
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
                    placeholder="e.g. gift-combos"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase">
                  Description
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description for catalog..."
                  rows={2}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground uppercase">
                    Icon Identifier
                  </label>
                  <select
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="gift">Gift Box (gift)</option>
                    <option value="moon">Crescent Moon (moon)</option>
                    <option value="package">Package / Hamper (package)</option>
                    <option value="sparkles">Sparkles / Luxury (sparkles)</option>
                    <option value="heart">Heart / Gratitude (heart)</option>
                    <option value="shopping-bag">Bag (shopping-bag)</option>
                  </select>
                </div>
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
                    id="catIsActive"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="size-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="catIsActive" className="text-sm font-medium">
                    Active & Visible in Store
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : editingId ? "Update Category" : "Create Category"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Categories Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/40 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Icon</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Slug</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      {loading ? "Loading categories..." : "No categories found."}
                    </td>
                  </tr>
                ) : (
                  categories.map((cat) => (
                    <tr key={cat.id} className="transition-colors hover:bg-muted/20">
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                        {cat.sortOrder}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          {cat.icon === "moon" ? (
                            <Moon className="size-4" />
                          ) : cat.icon === "package" ? (
                            <Package className="size-4" />
                          ) : cat.icon === "sparkles" ? (
                            <Sparkles className="size-4" />
                          ) : (
                            <Gift className="size-4" />
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground">
                        {cat.name}
                        {cat.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {cat.description}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                        {cat.slug}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => toggleStatus(cat)}
                          title="Click to toggle"
                          className="cursor-pointer"
                        >
                          {cat.isActive ? (
                            <Badge className="bg-emerald-600 hover:bg-emerald-700">
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-muted-foreground">
                              Hidden
                            </Badge>
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => startEdit(cat)}
                            title="Edit"
                          >
                            <Edit2 className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleDelete(cat.id)}
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
