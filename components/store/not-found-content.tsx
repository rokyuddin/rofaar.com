import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function NotFoundContent() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6 px-4 py-24 text-center sm:px-6">
      <Image
        src="/brand/rofaar-mark.png"
        alt=""
        width={69}
        height={100}
        className="h-24 w-auto"
      />
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold tracking-widest text-[#95490d] uppercase">
          Page not found
        </p>
        <h1 className="font-heading text-4xl font-semibold text-[#33180a] sm:text-5xl">
          This gift has wandered off
        </h1>
        <p className="text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
          Let&apos;s get you back to something meaningful.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Button render={<Link href="/products" />}>Browse gifts</Button>
        <Button render={<Link href="/" />} variant="outline">
          Back to home
        </Button>
      </div>
    </div>
  )
}
