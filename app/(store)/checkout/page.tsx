import { CheckoutForm } from "@/components/store/checkout-form"
import { getGeneralSettings } from "@/lib/site-data"


export default async function CheckoutPage() {
  const settings = await getGeneralSettings()

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
      <CheckoutForm settings={settings} />
    </div>
  )
}
