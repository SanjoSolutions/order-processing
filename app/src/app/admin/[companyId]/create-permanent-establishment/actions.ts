"use server"

import { createClient } from "@/supabase/server/createClient"
import { redirect } from "next/navigation"

export async function createPermanentEstablishment(formData: FormData) {
  const supabase = await createClient()
  const companyId = parseInt(formData.get("company-id") as string, 10)
  console.log("companyId", companyId)
  const { data } = await supabase
    .from("permanent_establishments")
    .insert({
      name: formData.get("name") as string,
      company_id: companyId,
    })
    .select("id")
    .single()
  if (data) {
    redirect(`/admin/${companyId}/${data.id}`)
  }
}
