"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { STORE_CATEGORIES } from "@/lib/store-catalog"
import { cn } from "@/lib/utils"

type Props = {
  currentCategory?: string
  currentQ?: string
  minPrice?: number
  maxPrice?: number
  priceFloor?: number
  priceCeil?: number
}

export function ProductFilters({
  currentCategory,
  currentQ,
  minPrice,
  maxPrice,
  priceFloor = 0,
  priceCeil = 10000,
}: Props) {
  const router = useRouter()
  const [range, setRange] = useState<[number, number]>([
    minPrice ?? priceFloor,
    maxPrice ?? priceCeil,
  ])

  function buildHref(overrides: Record<string, string | undefined>) {
    const params = new URLSearchParams()
    const next = {
      q: currentQ,
      category: currentCategory,
      min: String(range[0]),
      max: String(range[1]),
      ...overrides,
    }
    for (const [key, value] of Object.entries(next)) {
      if (value) params.set(key, value)
    }
    const qs = params.toString()
    return qs ? `/products?${qs}` : "/products"
  }

  function applyPrice() {
    router.push(buildHref({}))
  }

  return (
    <aside className="flex w-full flex-col gap-8 lg:w-56 lg:shrink-0">
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold tracking-widest uppercase">
          Category
        </p>
        <div className="flex flex-col gap-2">
          <Link
            href={buildHref({ category: undefined, min: undefined, max: undefined })}
            className={cn(
              "text-sm transition-colors",
              !currentCategory
                ? "font-semibold text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            All
          </Link>
          {STORE_CATEGORIES.map((category) => (
            <Link
              key={category}
              href={buildHref({
                category,
                min: undefined,
                max: undefined,
              })}
              className={cn(
                "text-sm transition-colors",
                currentCategory === category
                  ? "font-semibold text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {category}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-xs font-semibold tracking-widest uppercase">Price</p>
        <Slider
          min={priceFloor}
          max={priceCeil}
          step={50}
          value={range}
          onValueChange={(value) => {
            if (Array.isArray(value) && value.length >= 2) {
              setRange([value[0]!, value[1]!])
            }
          }}
        />
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <Label htmlFor="min-price" className="text-xs">
              Min
            </Label>
            <Input
              id="min-price"
              type="number"
              value={range[0]}
              onChange={(e) =>
                setRange([Number(e.target.value) || priceFloor, range[1]])
              }
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="max-price" className="text-xs">
              Max
            </Label>
            <Input
              id="max-price"
              type="number"
              value={range[1]}
              onChange={(e) =>
                setRange([range[0], Number(e.target.value) || priceCeil])
              }
            />
          </div>
        </div>
        <Button type="button" size="sm" variant="secondary" onClick={applyPrice}>
          Apply
        </Button>
      </div>
    </aside>
  )
}
