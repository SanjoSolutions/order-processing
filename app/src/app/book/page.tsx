import { createClient } from "@/supabase/server/createClient"
import { Form } from "./component"

export default async function () {
  const supabase = await createClient()

  const now = new Date()
  const bookings = supabase
    .from("bookings")
    .select()
    .contains(
      "during",
      `[${now.toISOString()}, ${new Date(
        now.getTime() + 7 * 24 * 60 * 60 * 1000,
      ).toISOString()})`,
    )

  return <Form bookings={bookings} />
}
