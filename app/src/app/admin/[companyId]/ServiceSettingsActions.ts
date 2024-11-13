"use server"

import { createClient } from "@/supabase/server/createClient"

export async function addService(formData: FormData) {
  const supabase = await createClient()
  const days = parseInt(formData.get("duration-days") as string, 10)
  const hours = parseInt(formData.get("duration-hours") as string, 10)
  const minutes = parseInt(formData.get("duration-minutes") as string, 10)
  let companyId
  let permanentEstablishmentId
  if (formData.has("company-id")) {
    companyId = parseInt(formData.get("company-id") as string, 10)
  } else if (formData.has("permanent-establishment-id")) {
    permanentEstablishmentId = parseInt(
      formData.get("permanent-establishment-id") as string,
      10,
    )
  } else {
    throw new Error(
      "Either company-id or permanent-establishment-id is required.",
    )
  }
  await supabase.from("services").insert({
    company_id: companyId,
    permanent_establishment_id: permanentEstablishmentId,
    name: formData.get("name") as string,
    duration: `${days} days ${hours} hours ${minutes} minutes`,
  })
}
