import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { requireAdmin } from "@/lib/auth"
import { isCloudflareR2Configured, uploadToCloudflareR2 } from "@/lib/cloudflare-r2"

export async function POST(req: Request) {
  try {
    await requireAdmin()

    const formData = await req.formData()
    const file = formData.get("file") as File | null
    const folder = (formData.get("folder") as string) || "products"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files (JPEG, PNG, WebP, SVG) are allowed" },
        { status: 400 }
      )
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const cleanFilename = file.name
      .toLowerCase()
      .replace(/[^a-z0-9.-]+/g, "-")
      .replace(/^-|-$/g, "")

    // 1. If Cloudflare R2 is configured, upload directly to Cloudflare
    if (isCloudflareR2Configured()) {
      try {
        const publicUrl = await uploadToCloudflareR2({
          buffer,
          filename: cleanFilename,
          contentType: file.type,
          folder,
        })

        return NextResponse.json({
          url: publicUrl,
          provider: "cloudflare",
          filename: cleanFilename,
          size: file.size,
        })
      } catch (cfError: any) {
        console.error("Cloudflare upload error:", cfError)
        return NextResponse.json(
          { error: `Cloudflare R2 upload failed: ${cfError.message}` },
          { status: 500 }
        )
      }
    }

    // 2. Fallback to local public/uploads directory if Cloudflare env vars are pending
    const uploadsDir = path.join(process.cwd(), "public", "uploads")
    await fs.mkdir(uploadsDir, { recursive: true })

    const uniqueFilename = `${Date.now()}-${cleanFilename}`
    const filePath = path.join(uploadsDir, uniqueFilename)
    await fs.writeFile(filePath, buffer)

    return NextResponse.json({
      url: `/uploads/${uniqueFilename}`,
      provider: "local",
      filename: uniqueFilename,
      size: file.size,
      notice:
        "Saved to local uploads. Add CLOUDFLARE_R2_* to .env.local to stream directly to Cloudflare CDN.",
    })
  } catch (err: any) {
    if (err?.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("Upload error:", err)
    return NextResponse.json({ error: "File upload failed" }, { status: 500 })
  }
}
