import { createClient } from "@/supabase/server/createClient"
import { Client } from "./client"

export default async function () {
  const supabase = await createClient()
  const services = supabase.from("services").select()

  return <Client services={services} />
}
