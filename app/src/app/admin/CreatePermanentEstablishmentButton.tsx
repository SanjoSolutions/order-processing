"use client"

import clsx from "clsx"
import Link from "next/link"
import { useParams } from "next/navigation"

export function CreatePermanentEstablishmentButton({
  className,
}: {
  className?: string
}) {
  const { companyId } = useParams()

  return (
    <Link
      href={`/admin/${companyId}/create-permanent-establishment`}
      className={clsx("btn", "btn-outline-secondary", className)}
    >
      Create permanent establishment
    </Link>
  )
}
