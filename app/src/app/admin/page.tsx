import { createClient } from "@/supabase/server/createClient"
import Link from "next/link"
import { CompanySelect } from "./CompanySelect"
import { Sidebar } from "./Sidebar"
import { UserNavigation } from "./UserNavigation"

export default async function Admin() {
  const supabase = await createClient()
  const companies = supabase.from("companies").select()

  return (
    <div className="d-flex flex-nowrap flex-grow-1 w-100">
      <Sidebar>
        <CompanySelect companies={companies} />

        <Link
          href="/admin/create-company"
          className="btn btn-outline-secondary"
        >
          Create company
        </Link>

        <div className="mb-auto"></div>

        <hr />

        <UserNavigation />
      </Sidebar>

      <main className="p-3"></main>
    </div>
  )
}
