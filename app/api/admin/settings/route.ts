import { NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { siteSettings } from "@/lib/db/schema"
import { requireAdmin } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    await requireAdmin()
    const { searchParams } = new URL(req.url)
    const key = searchParams.get("key")

    if (key) {
      const found = await db
        .select()
        .from(siteSettings)
        .where(eq(siteSettings.key, key))
        .limit(1)

      return NextResponse.json(found[0]?.value ?? null)
    }

    const all = await db.select().from(siteSettings)
    const mapped: Record<string, any> = {}
    for (const item of all) {
      mapped[item.key] = item.value
    }
    return NextResponse.json(mapped)
  } catch (err: any) {
    if (err?.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin()
    const body = await req.json()
    const key = String(body.key ?? "").trim()
    const value = body.value

    if (!key || value === undefined) {
      return NextResponse.json({ error: "Key and value are required" }, { status: 400 })
    }

    const updated = await db
      .insert(siteSettings)
      .values({
        key,
        value,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: {
          value,
          updatedAt: new Date(),
        },
      })
      .returning()

    return NextResponse.json(updated[0])
  } catch (err: any) {
    if (err?.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("Save settings error:", err)
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 })
  }
}
