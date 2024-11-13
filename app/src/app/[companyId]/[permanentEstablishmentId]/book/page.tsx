import { createClient } from "@/supabase/server/createClient"
import { Form } from "./component"

export default async function ({
  params,
}: {
  params: Promise<{ companyId: string; permanentEstablishmentId: string }>
}) {
  const { companyId, permanentEstablishmentId } = await params
  const supabase = await createClient()

  const now = new Date()
  const range = `[${now.toISOString()}, ${new Date(
    now.getTime() + 7 * 24 * 60 * 60 * 1000,
  ).toISOString()})`
  const bookings = supabase.from("bookings").select().overlaps("during", range)

  const company = supabase
    .from("companies")
    .select("name")
    .eq("id", companyId)
    .single()
  const permanentEstablishment = supabase
    .from("permanent_establishments")
    .select("name, street_and_house_number, zip, city, country")
    .eq("id", permanentEstablishmentId)
    .single()
  const services = supabase
    .from("services")
    .select()
    .or(
      `company_id.eq.${companyId},permanent_establishment_id.eq.${permanentEstablishmentId}`,
    )

  return (
    <Form
      company={company}
      permanentEstablishment={permanentEstablishment}
      bookings={bookings}
      services={services}
    />
  )
}
