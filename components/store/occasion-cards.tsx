import Link from "next/link"
import { OCCASION_CARDS } from "@/lib/store-catalog"

export function OccasionCards() {
  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 sm:px-6">
      <h2 className="font-heading text-3xl font-semibold tracking-tight text-[#342318] sm:text-4xl">
        Gifts for every occasion
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {OCCASION_CARDS.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className={`relative flex h-40 w-56 shrink-0 flex-col justify-between overflow-hidden rounded-2xl p-5 transition-transform duration-300 hover:-translate-y-1 ${card.tone}`}
          >
            <span className="text-lg font-semibold text-[#342318]">
              {card.title} <span aria-hidden>›</span>
            </span>
            <span
              aria-hidden
              className="pointer-events-none absolute -right-4 -bottom-6 size-28 rounded-full bg-white/25"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute right-6 bottom-4 size-16 rounded-full border border-[#342318]/15 bg-[#342318]/10"
            />
          </Link>
        ))}
      </div>
    </section>
  )
}
