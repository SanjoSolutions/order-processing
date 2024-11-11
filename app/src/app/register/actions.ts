"use server"

import { createClient } from "@/lib/supabase/server"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export async function register(previousState: any, formData: FormData) {
  const origin = (await headers()).get("origin")

  const returnUrl = formData.get("returnUrl") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const supabase = await createClient()

  let emailRedirectTo = `${origin}/auth/callback`
  if (returnUrl) {
    emailRedirectTo += `?returnUrl=${returnUrl}`
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo,
    },
  })

  if (error) {
    return {
      email,
      password,
      errorMessage: error.message,
    }
  }

  redirect("/have-registered")
}
