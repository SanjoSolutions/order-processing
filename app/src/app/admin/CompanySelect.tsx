"use client"

import type { Company } from "@/types"
import { redirect, useParams } from "next/navigation"
import { use, useCallback, type ChangeEventHandler } from "react"

export function CompanySelect({
  companies: companiesPromise,
}: {
  companies: PromiseLike<{ data: Company[] | null }>
}) {
  const companies = use(companiesPromise).data ?? []
  const { companyId } = useParams<{ companyId?: string }>()

  const onChange: ChangeEventHandler<HTMLSelectElement> = useCallback(
    function onChange(event) {
      const companyId = event.target.value
      if (companyId) {
        redirect(`/admin/${companyId}/settings`)
      }
    },
    [],
  )

  return (
    companies &&
    companies.length >= 1 && (
      <select
        className="form-select mb-2"
        defaultValue={companyId ?? ""}
        onChange={onChange}
      >
        <option value="" hidden>
          Select company
        </option>
        {companies.map(({ id, name }) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </select>
    )
  )
}
