import { NextResponse, type NextRequest } from "next/server"
import { jwtVerify } from "jose"

const COOKIE_NAME = "rofaar_admin_session"

async function hasValidSession(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value
  if (!token) return false

  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) return false

  try {
    await jwtVerify(token, new TextEncoder().encode(secret))
    return true
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isLoginPage = pathname === "/admin/login"
  const authed = await hasValidSession(request)

  if (!authed && !isLoginPage) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  if (authed && isLoginPage) {
    return NextResponse.redirect(new URL("/admin", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
}
