import { createClient } from "@/supabase/server/createClient"
import { AdminLayout } from "./AdminLayout"

export default async function Admin() {
  const supabase = await createClient()
  const companies = supabase.from("companies").select()

  return <AdminLayout companies={companies} />
}
