import { NextResponse } from "next/server"
import {
  createAdminSession,
  verifyAdminCredentials,
} from "@/lib/auth"

export async function POST(request: Request) {
  let body: { email?: string; password?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const email = body.email?.trim().toLowerCase()
  const password = body.password ?? ""

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    )
  }

  const admin = await verifyAdminCredentials(email, password)
  if (!admin) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    )
  }

  await createAdminSession(admin)
  return NextResponse.json({ ok: true })
}
