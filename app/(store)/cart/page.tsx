import { CartView } from "@/components/store/cart-view"
import { getGeneralSettings } from "@/lib/site-data"

export default async function CartPage() {
  const settings = await getGeneralSettings()

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
      <CartView settings={settings} />
    </div>
  )
}
