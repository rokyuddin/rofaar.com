"use client"

import { useRouter } from "next/navigation"
import { LogOutIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export function LogoutButton() {
  const router = useRouter()

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" })
    router.replace("/admin/login")
    router.refresh()
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="w-full justify-start"
      onClick={logout}
    >
      <LogOutIcon data-icon="inline-start" />
      Log out
    </Button>
  )
}
