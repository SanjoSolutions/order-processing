"use client"

import type { PermanentEstablishment } from "@/types"
import Form from "next/form"
import { use, useActionState } from "react"
import { saveAddress } from "./actions"

export function AddressSettings({
  className,
  permanentEstablishment: permanentEstablishmentPromise,
}: {
  className?: string
  permanentEstablishment: PromiseLike<{ data: PermanentEstablishment | null }>
}) {
  const permanentEstablishment = use(permanentEstablishmentPromise).data
  const [state, formAction] = useActionState(
    saveAddress,
    permanentEstablishment,
  )

  return (
    <div className={className}>
      <h2>Address</h2>

      <Form action={formAction}>
        <input type="hidden" name="id" value={state?.id ?? ""} />

        <div className="mb-3">
          <label htmlFor="street-and-house-number" className="form-label">
            Street and house number
          </label>
          <input
            type="text"
            id="street-and-house-number"
            name="street-and-house-number"
            className="form-control"
            defaultValue={state?.street_and_house_number ?? ""}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="zip" className="form-label">
            Zip
          </label>
          <input
            type="text"
            id="zip"
            name="zip"
            className="form-control"
            defaultValue={state?.zip ?? ""}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="city" className="form-label">
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            className="form-control"
            defaultValue={state?.city ?? ""}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="country" className="form-label">
            Country
          </label>
          <input
            type="text"
            id="country"
            name="country"
            className="form-control"
            defaultValue={state?.country ?? ""}
          />
        </div>

        <div className="text-end">
          <button type="submit" className="btn btn-secondary">
            Save address
          </button>
        </div>
      </Form>
    </div>
  )
}
