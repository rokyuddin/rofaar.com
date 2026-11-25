"use client"

// Pushes GA4-style ecommerce events to the GTM dataLayer.
// GA4 and the Meta Pixel tags in GTM fire from these events.
export type AnalyticsItem = {
  item_id: string | number
  item_name: string
  price: number
  quantity: number
}

type DataLayerWindow = Window & { dataLayer?: Record<string, unknown>[] }

export function trackEvent(
  event: string,
  ecommerce: {
    currency?: string
    value?: number
    items?: AnalyticsItem[]
    transaction_id?: string
    shipping?: number
  }
) {
  if (typeof window === "undefined") return
  const w = window as DataLayerWindow
  w.dataLayer = w.dataLayer || []
  w.dataLayer.push({ ecommerce: null })
  w.dataLayer.push({ event, ecommerce: { currency: "BDT", ...ecommerce } })
}
