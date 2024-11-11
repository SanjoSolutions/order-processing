import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Check } from "lucide-react"

export default function () {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Alert variant="success" className="w-auto">
        <Check className="h-4 w-4" />
        <AlertTitle>Registered</AlertTitle>
        <AlertDescription>
          Registration was successful. Please check your email inbox for a
          confirmation mail.
        </AlertDescription>
      </Alert>
    </div>
  )
}
