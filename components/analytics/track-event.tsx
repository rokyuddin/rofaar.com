"use client"

import { useEffect, useRef } from "react"
import { trackEvent, type AnalyticsItem } from "@/lib/analytics"

type Props = {
  event: string
  value: number
  items: AnalyticsItem[]
  transactionId?: string
  shipping?: number
  // fire once per browser for this key (prevents duplicate purchases on reload)
  onceKey?: string
}

export function TrackEvent({ event, value, items, transactionId, shipping, onceKey }: Props) {
  const fired = useRef(false)
  useEffect(() => {
    if (fired.current) return
    fired.current = true
    if (onceKey) {
      try {
        if (localStorage.getItem(onceKey)) return
        localStorage.setItem(onceKey, "1")
      } catch {}
    }
    trackEvent(event, { value, items, transaction_id: transactionId, shipping })
  }, [event, value, items, transactionId, shipping, onceKey])
  return null
}
