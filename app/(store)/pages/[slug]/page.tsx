import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getPageBySlug } from "@/lib/site-data"

interface PageProps {
  params: Promise<{ slug: string }>
}

export const revalidate = 0

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const page = await getPageBySlug(slug)

  if (!page) {
    return { title: "Page Not Found | Rofaar" }
  }

  return {
    title: page.metaTitle || `${page.title} | Rofaar`,
    description: page.metaDescription || page.excerpt,
  }
}

export default async function DynamicCmsPage({ params }: PageProps) {
  const { slug } = await params
  const page = await getPageBySlug(slug)

  if (!page || !page.isPublished) {
    notFound()
  }

  // Basic markdown format parsing for headings, lists, bolding, paragraphs
  const renderFormattedContent = (content: string) => {
    return content.split("\n\n").map((block, idx) => {
      const trimmed = block.trim()
      if (!trimmed) return null

      if (trimmed.startsWith("# ")) {
        return (
          <h1
            key={idx}
            className="font-heading text-4xl font-bold tracking-tight text-[#342318] sm:text-5xl mb-6"
          >
            {trimmed.replace("# ", "")}
          </h1>
        )
      }
      if (trimmed.startsWith("## ")) {
        return (
          <h2
            key={idx}
            className="font-heading text-2xl font-bold text-[#342318] sm:text-3xl mt-8 mb-4 border-b border-border/40 pb-2"
          >
            {trimmed.replace("## ", "")}
          </h2>
        )
      }
      if (trimmed.startsWith("### ")) {
        return (
          <h3
            key={idx}
            className="font-heading text-xl font-semibold text-[#342318] mt-6 mb-3"
          >
            {trimmed.replace("### ", "")}
          </h3>
        )
      }
      if (trimmed.startsWith("- ")) {
        const items = trimmed.split("\n").filter((l) => l.trim().startsWith("- "))
        return (
          <ul key={idx} className="my-4 list-disc space-y-2 pl-6 text-[#5a4332]">
            {items.map((it, i) => (
              <li key={i}>{it.replace(/^- /, "")}</li>
            ))}
          </ul>
        )
      }

      return (
        <p
          key={idx}
          className="my-3 text-base sm:text-lg leading-relaxed text-[#5a4332]"
        >
          {trimmed}
        </p>
      )
    })
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground mb-8"
      >
        <ArrowLeft className="size-4" />
        Back to Home
      </Link>

      <div className="rounded-3xl border border-border/60 bg-white/70 p-8 shadow-xs backdrop-blur-xs sm:p-12 lg:p-16">
        <div className="prose prose-stone max-w-none">
          {renderFormattedContent(page.content)}
        </div>
      </div>
    </div>
  )
}
