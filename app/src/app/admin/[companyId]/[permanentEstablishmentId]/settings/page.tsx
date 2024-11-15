import { createClient } from "@/supabase/server/createClient"
import { Client } from "./client"

export default async function ({
  params,
}: {
  params: Promise<{ permanentEstablishmentId: string }>
}) {
  const supabase = await createClient()

  const { permanentEstablishmentId } = await params
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

  return (
    <Client
      permanentEstablishment={permanentEstablishment}
      openingHours={openingHours}
      services={services}
    />
  )
}
