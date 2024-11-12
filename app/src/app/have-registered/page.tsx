import Link from "next/link"
import { Centered } from "../Centered"

export default function () {
  return (
    <Centered>
      <div className="alert alert-success">
        Registration was successful. Please check your email inbox for a
        confirmation mail.
      </div>
      <div className="mt-2 text-center">
        <Link href="/log-in">Log in</Link>
      </div>
    </Centered>
  )
}
