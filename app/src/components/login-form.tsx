import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FormErrorMessage } from "./FormErrorMessage"

export function LoginForm({
  email,
  password,
  errorMessage,
  isPending,
}: {
  email: string
  password: string
  errorMessage: string
  isPending: boolean
}) {
  return (
    <Card className="mx-auto w-96">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <FormErrorMessage isPending={isPending} errorMessage={errorMessage} />
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              required
              autoFocus
              defaultValue={email}
              disabled={isPending}
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/request-password-reset-link"
                className="ml-auto inline-block text-sm underline"
              >
                Reset password
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              required
              defaultValue={password}
              disabled={isPending}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            Log in
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          <Link href="/register" className="underline">
            Register
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
