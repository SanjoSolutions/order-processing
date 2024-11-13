import { createClient } from "@/supabase/server/createClient"
import { Client } from "./client"

export default async function ({
  params,
}: {
  params: Promise<{ permanentEstablishmentId: string }>
}) {
  const supabase = await createClient()

  const { permanentEstablishmentId } = await params
  const openingHours = supabase
    .from("opening_hours")
    .select()
    .eq("permanent_establishment_id", permanentEstablishmentId)
    .single()
  const services = supabase.from("services").select()

  return <Client openingHours={openingHours} services={services} />
}
