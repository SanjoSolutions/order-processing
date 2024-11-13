"use server"

import { createClient } from "@/supabase/server/createClient"
import { redirect } from "next/navigation"

export async function createCompany(formData: FormData) {
  const supabase = await createClient()
  const { data: companyId } = await supabase.rpc("create_company", {
    name: formData.get("name") as string,
  })
  if (companyId) {
    redirect(`/admin/${companyId}/settings`)
  }
}
