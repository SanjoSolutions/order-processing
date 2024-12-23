import { PartyPopper } from "lucide-react"

export default function PersonalAccountPage() {
  return (
    <div className="flex flex-col gap-y-4 py-12 h-full w-full items-center justify-center content-center max-w-screen-md mx-auto text-center">
      <PartyPopper className="h-12 w-12 text-gray-400" />
      <h1 className="text-2xl font-bold">Personal Account</h1>
      <p>
        Here's where you'll put all your awesome personal account items. If you
        only want to support team accounts, you can just remove these pages
      </p>
    </div>
  )
}
