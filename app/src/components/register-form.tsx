import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FormErrorMessage } from "./FormErrorMessage"

export function RegisterForm({
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
        <CardTitle className="text-2xl">Register</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <FormErrorMessage isPending={isPending} errorMessage={errorMessage} />
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              autoFocus
              defaultValue={email}
              disabled={isPending}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              defaultValue={password}
              disabled={isPending}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            Register
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          <Link href="/log-in" className="underline">
            Log in
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
