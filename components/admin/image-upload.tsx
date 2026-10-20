"use client"

import { useState, useRef, DragEvent, ChangeEvent } from "react"
import Image from "next/image"
import { Cloud, ImageIcon, Loader2, UploadCloud, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  folder?: string
  label?: string
}

export function ImageUpload({
  value = "",
  onChange,
  folder = "products",
  label = "Upload Image",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [provider, setProvider] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function uploadFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (PNG, JPG, WebP)")
      return
    }

    setUploading(true)
    setError(null)
    setNotice(null)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", folder)

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Upload failed")
      }

      onChange(data.url)
      setProvider(data.provider)
      if (data.notice) {
        setNotice(data.notice)
      }
    } catch (err: any) {
      setError(err.message || "Failed to upload file")
    } finally {
      setUploading(false)
    }
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFile(e.dataTransfer.files[0])
    }
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }

  function handleDragLeave(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }

  function handleFileInput(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      uploadFile(e.target.files[0])
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
          {label}
        </label>
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
          <Cloud className="size-3 text-sky-500" />
          Cloudflare R2 Supported
        </span>
      </div>

      {value ? (
        <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-xl border border-border/70 bg-muted/20">
          <Image
            src={value}
            alt="Preview"
            fill
            className="object-contain p-2"
          />
          <div className="absolute top-2 right-2 flex items-center gap-1.5">
            {provider === "cloudflare" && (
              <Badge className="bg-orange-500/90 text-[10px] text-white">
                Cloudflare CDN
              </Badge>
            )}
            <Button
              type="button"
              variant="destructive"
              size="icon-xs"
              onClick={() => onChange("")}
              className="size-7 rounded-full shadow-md"
              title="Remove Image"
            >
              <X className="size-3.5" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 text-center transition-all cursor-pointer ${
            dragActive
              ? "border-primary bg-primary/5"
              : "border-border/80 hover:border-primary/50 hover:bg-muted/20"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2 py-3">
              <Loader2 className="size-8 animate-spin text-primary" />
              <p className="text-xs font-medium text-muted-foreground">
                Uploading to Cloudflare...
              </p>
            </div>
          ) : (
            <>
              <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <UploadCloud className="size-6" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-foreground">
                  Click to upload or drag & drop
                </p>
                <p className="text-[11px] text-muted-foreground">
                  PNG, JPG, WebP up to 10MB
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Manual URL input fallback */}
      <div className="flex items-center gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or paste external image URL / path..."
          className="text-xs"
        />
        {value && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            Replace
          </Button>
        )}
      </div>

      {notice && (
        <p className="text-[11px] text-amber-600 font-medium">
          ℹ️ {notice}
        </p>
      )}

      {error && (
        <p className="text-xs text-destructive font-medium">
          {error}
        </p>
      )}
    </div>
  )
}
