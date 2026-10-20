import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { admins, type Admin } from "@/lib/db/schema"

const COOKIE_NAME = "rofaar_admin_session"

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not set")
  return new TextEncoder().encode(secret)
}

export async function verifyAdminCredentials(email: string, password: string) {
  const rows = await db.select().from(admins).where(eq(admins.email, email)).limit(1)
  const admin = rows[0]
  if (!admin) return null
  const ok = await bcrypt.compare(password, admin.passwordHash)
  if (!ok) return null
  return admin
}

export async function createAdminSession(admin: Admin) {
  const token = await new SignJWT({
    sub: String(admin.id),
    email: admin.email,
    name: admin.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret())

  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })
}

export async function destroyAdminSession() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export async function getAdminSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, getSecret())
    if (!payload.sub || typeof payload.email !== "string") return null
    return {
      id: Number(payload.sub),
      email: payload.email,
      name: typeof payload.name === "string" ? payload.name : "Admin",
    }
  } catch {
    return null
  }
}

export async function requireAdmin() {
  const session = await getAdminSession()
  if (!session) {
    throw new Error("UNAUTHORIZED")
  }
  return session
}
