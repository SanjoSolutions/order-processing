"use client"
import { useSearchParams } from "next/navigation"

export function ReturnURLInput() {
  const searchParams = useSearchParams()
  const returnUrl = searchParams.get("returnUrl")

  return (
    returnUrl && (
      <input type="hidden" name="returnUrl" defaultValue={returnUrl} />
    )
  )
}
