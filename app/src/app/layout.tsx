import { cn } from "@/lib/utils"
import { Inter as FontSans } from "next/font/google"
import Script from "next/script"
import "./custom.scss"
import "./globals.css"

const defaultUrl =
  (process.env.NEXT_PUBLIC_URL as string) || "http://localhost:3000"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Scheduling",
  description: "The fastest way to build apps with Next.js and Supabase",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={cn(
        "min-h-screen bg-background font-sans antialiased",
        fontSans.variable,
      )}
    >
      <body className="bg-background text-foreground">
        <main className="min-h-screen flex flex-col items-center">
          {children}
        </main>

        <Script src="/bootstrap.bundle.min.js" />
      </body>
    </html>
  )
}
