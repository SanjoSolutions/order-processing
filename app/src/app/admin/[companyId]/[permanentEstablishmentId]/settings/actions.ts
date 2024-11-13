"use server"

import { createClient } from "@/supabase/server/createClient"

export async function addService(formData: FormData) {
  const supabase = await createClient()
  const days = parseInt(formData.get("duration-days") as string, 10)
  const hours = parseInt(formData.get("duration-hours") as string, 10)
  const minutes = parseInt(formData.get("duration-minutes") as string, 10)
  const { error, data: service } = await supabase.from("services").insert({
    name: formData.get("name") as string,
    duration: `${days} days ${hours} hours ${minutes} minutes`,
  })
}

export async function saveOpeningHours(formData: FormData) {
  const supabase = await createClient()
  const mondayFrom = formData.get("monday-from") as string
  console.log(mondayFrom)
  const { error } = await supabase.from("opening_hours").upsert({
    permanent_establishment_id: formData.get(
      "permanent-establishment-id",
    ) as string,
    monday_from: (formData.get("monday-from") as string) || null,
    monday_to: (formData.get("monday-to") as string) || null,
    tuesday_from: (formData.get("tuesday-from") as string) || null,
    tuesday_to: (formData.get("tuesday-to") as string) || null,
    wednesday_from: (formData.get("wednesday-from") as string) || null,
    wednesday_to: (formData.get("wednesday-to") as string) || null,
    thursday_from: (formData.get("thursday-from") as string) || null,
    thursday_to: (formData.get("thursday-to") as string) || null,
    friday_from: (formData.get("friday-from") as string) || null,
    friday_to: (formData.get("friday-to") as string) || null,
    saturday_from: (formData.get("saturday-from") as string) || null,
    saturday_to: (formData.get("saturday-to") as string) || null,
    sunday_from: (formData.get("sunday-from") as string) || null,
    sunday_to: (formData.get("sunday-to") as string) || null,
  })
  console.log("error", error)
}
