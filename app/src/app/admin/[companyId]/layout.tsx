import { createClient } from "@/supabase/server/createClient"
import Link from "next/link"
import { CompanySelect } from "../CompanySelect"
import { CreatePermanentEstablishmentButton } from "../CreatePermanentEstablishmentButton"
import { Navigation } from "../Navigation"
import { PermanentEstablishmentSelect } from "../PermanentEstablishmentSelect"
import { Sidebar } from "../Sidebar"
import { UserNavigation } from "../UserNavigation"

export default async function Admin({
  params,
  children,
}: {
  params: Promise<{ companyId: string }>
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const companies = supabase.from("companies").select()
  const companyId = (await params).companyId
  const permanentEstablishments = supabase
    .from("permanent_establishments")
    .select()
    .eq("company_id", companyId)

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

        <PermanentEstablishmentSelect
          permanentEstablishments={permanentEstablishments}
          className="mt-2"
        />

        <CreatePermanentEstablishmentButton className="mt-2" />

        <hr />

        <Navigation />

        <hr />

        <UserNavigation />
      </Sidebar>

      <main className="p-3">{children}</main>
    </div>
  )
}
