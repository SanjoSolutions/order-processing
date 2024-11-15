"use client"

import type { OpeningHours, PermanentEstablishment, Service } from "@/types"
import { useParams } from "next/navigation"
import { ServiceSettings } from "../../ServiceSettings"
import { AddressSettings } from "./AddressSettings"
import { OpeningHoursSettings } from "./OpeningHoursSettings"

export function Client({
  permanentEstablishment,
  openingHours,
  services,
  companyServices,
}: {
  permanentEstablishment: PromiseLike<{ data: PermanentEstablishment | null }>
  openingHours: PromiseLike<{ data: OpeningHours | null }>
  services: PromiseLike<{ data: Service[] | null }>
  companyServices?: PromiseLike<{ data: Service[] | null }>
}) {
  const { permanentEstablishmentId } = useParams<{
    permanentEstablishmentId: string
  }>()

  return (
    <div className="flex-grow-1 p-3">
      <h1>Settings</h1>

      <AddressSettings
        permanentEstablishment={permanentEstablishment}
        className="mb-3"
      />

      <OpeningHoursSettings
        openingHours={openingHours}
        permanentEstablishmentId={permanentEstablishmentId}
      />

      <ServiceSettings
        permanentEstablishmentId={permanentEstablishmentId}
        services={services}
        companyServices={companyServices}
      />
    </div>
  )
}
