import { NotFoundContent } from "@/components/store/not-found-content"

// Shown when a store page calls notFound() (e.g. an unknown product slug),
// inside the store layout with its header and footer.
export default function StoreNotFound() {
  return <NotFoundContent />
}
