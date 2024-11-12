"use client"

import Link from "next/link.js"
import { useActionState } from "react"
import { Centered } from "../Centered"
import { logIn } from "./actions"

export default function Login() {
  const [state, formAction, isPending] = useActionState(logIn, {
    email: "",
    password: "",
    errorMessage: "",
  })

  return (
    <Centered>
      <form action={formAction}>
        {state.errorMessage && (
          <div className="alert alert-danger">{state.errorMessage}</div>
        )}

        <div className="form-floating mb-2">
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            placeholder="name@example.com"
            autoFocus
            defaultValue={state.email}
          />
          <label htmlFor="floatingInput">Email address</label>
        </div>

        <div className="form-floating mb-2">
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            placeholder="Password"
            defaultValue={state.password}
          />
          <label htmlFor="floatingPassword">Password</label>
        </div>

        <button
          className="btn btn-primary w-100 py-2"
          type="submit"
          disabled={isPending}
        >
          Log in
        </button>

        <div className="mt-2 text-center">
          <Link className="me-2" href="/request-password-reset-link">
            Reset password
          </Link>
          <Link href="/register">Register</Link>
        </div>
      </form>
    </Centered>
  )
}
