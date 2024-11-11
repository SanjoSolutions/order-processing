"use client"

import { RegisterForm } from "@/components/register-form"
import Form from "next/form"
import { useSearchParams } from "next/navigation"
import { useActionState } from "react"
import { register } from "./actions"

export default function Page() {
  const [state, formAction, isPending] = useActionState(register, {
    email: "",
    password: "",
    errorMessage: "",
  })

  const searchParams = useSearchParams()
  const returnUrl = searchParams.get("returnUrl")

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Form action={formAction}>
        {returnUrl && (
          <input type="hidden" name="returnUrl" defaultValue={returnUrl} />
        )}
        <RegisterForm
          email={state.email}
          password={state.password}
          errorMessage={state.errorMessage}
          isPending={isPending}
        />
      </Form>
    </div>
  )
}
