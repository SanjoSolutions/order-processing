"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function logIn(previousState: any, formData: FormData) {
  const returnUrl = formData.get("returnUrl") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return {
      email,
      password,
      errorMessage: error.message,
    }
  } else {
    return redirect(returnUrl || "/dashboard")
  }
}
