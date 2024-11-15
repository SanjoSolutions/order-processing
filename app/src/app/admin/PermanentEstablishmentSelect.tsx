"use client"

import type { PermanentEstablishment } from "@/types"
import clsx from "clsx"
import { redirect, useParams } from "next/navigation"
import { use, useCallback, type ChangeEventHandler } from "react"

export function PermanentEstablishmentSelect({
  className,
  permanentEstablishments: permanentEstablishmentsPromise,
}: {
  className?: string
  permanentEstablishments: PromiseLike<{
    data: PermanentEstablishment[] | null
  }>
}) {
  const permanentEstablishments = use(permanentEstablishmentsPromise).data
  const { companyId, permanentEstablishmentId } = useParams<{
    companyId?: string
    permanentEstablishmentId?: string
  }>()

  const onChange: ChangeEventHandler<HTMLSelectElement> = useCallback(
    function onChange(event) {
      redirect(`/admin/${companyId}/${event.target.value}/settings`)
    },
    [],
  )

  return (
    permanentEstablishments &&
    permanentEstablishments.length >= 1 && (
      <select
        className={clsx("form-select", className)}
        onChange={onChange}
        defaultValue={permanentEstablishmentId}
      >
        <option value="" hidden>
          Select permanent establishment
        </option>
        {permanentEstablishments?.map(({ id, name }) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </select>
    )
  )
}
