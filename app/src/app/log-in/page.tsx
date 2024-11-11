"use client"

import { LoginForm } from "@/components/login-form"
import Form from "next/form"
import { Suspense, useActionState } from "react"
import { ReturnURLInput } from "../ReturnURLInput"
import { logIn } from "./actions"

export default function Page() {
  const [state, formAction, isPending] = useActionState(logIn, {
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
        <LoginForm
          email={state.email}
          password={state.password}
          errorMessage={state.errorMessage}
          isPending={isPending}
        />
      </Form>
    </div>
  )
}
