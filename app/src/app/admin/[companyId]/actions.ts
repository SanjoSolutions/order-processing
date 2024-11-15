"use server"

import { createClient } from "@/supabase/server/createClient"

export async function onDelete(formData: FormData) {
  const id = formData.get("id") as string
  const supabase = await createClient()
  console.log("id", id)
  await supabase.from("services").delete().eq("id", id)
}
