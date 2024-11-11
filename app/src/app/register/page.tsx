"use client"

import { RegisterForm } from "@/components/register-form"
import Form from "next/form"
import { Suspense, useActionState } from "react"
import { ReturnURLInput } from "../ReturnURLInput"
import { register } from "./actions"

export default function Page() {
  const [state, formAction, isPending] = useActionState(register, {
    email: "",
    password: "",
    errorMessage: "",
  })

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Form action={formAction}>
        <Suspense>
          <ReturnURLInput />
        </Suspense>
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
