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
}
