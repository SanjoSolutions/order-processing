"use client"

import type { Service } from "@/types"
import { useParams } from "next/navigation"
import { ServiceSettings } from "../ServiceSettings"

export function Client({
  services,
}: {
  services: PromiseLike<{ data: Service[] | null }>
}) {
  const { companyId } = useParams<{ companyId: string }>()

  return (
    <div className="flex-grow-1 p-3">
      <h1>Settings</h1>

      <ServiceSettings companyId={companyId} services={services} />
    </div>
  )
}
