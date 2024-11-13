import { createClient } from "@/supabase/server/createClient"
import { Form } from "./component"

export default async function () {
  const supabase = await createClient()

  const now = new Date()
  const range = `[${now.toISOString()}, ${new Date(
    now.getTime() + 7 * 24 * 60 * 60 * 1000,
  ).toISOString()})`
  const bookings = supabase.from("bookings").select().overlaps("during", range)

  const company = supabase.from("companies").select("name").single()
  const permanentEstablishment = supabase
    .from("permanent_establishments")
    .select("name, street_and_house_number, zip, city, country")
    .single()

  return (
    <Form
      company={company}
      permanentEstablishment={permanentEstablishment}
      bookings={bookings}
    />
  )
}
