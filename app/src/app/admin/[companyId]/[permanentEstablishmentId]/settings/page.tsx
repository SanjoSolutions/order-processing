import { createClient } from "@/supabase/server/createClient"
import { Client } from "./client"

export default async function ({
  params,
}: {
  params: Promise<{ companyId: string; permanentEstablishmentId: string }>
}) {
  const supabase = await createClient()

  const { companyId, permanentEstablishmentId } = await params
  const permanentEstablishment = supabase
    .from("permanent_establishments")
    .select()
    .eq("id", permanentEstablishmentId)
    .single()
  const openingHours = supabase
    .from("opening_hours")
    .select()
    .eq("permanent_establishment_id", permanentEstablishmentId)
    .single()
  const services = supabase
    .from("services")
    .select()
    .eq("permanent_establishment_id", permanentEstablishmentId)
  const companyServices = supabase
    .from("services")
    .select()
    .eq("company_id", companyId)

  return (
    <Client
      permanentEstablishment={permanentEstablishment}
      openingHours={openingHours}
      services={services}
      companyServices={companyServices}
    />
  )
}
