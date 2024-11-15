import { createClient } from "@/supabase/server/createClient"
import { Client } from "./client"

export default async function ({
  params,
}: {
  params: Promise<{ companyId: string }>
}) {
  const supabase = await createClient()
  const { companyId } = await params
  const services = supabase
    .from("services")
    .select()
    .eq("company_id", companyId)

  return <Client services={services} />
}
