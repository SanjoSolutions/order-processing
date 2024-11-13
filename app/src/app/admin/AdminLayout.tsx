import type { Company } from "@/types"
import Link from "next/link"
import { CompanySelect } from "./CompanySelect"
import { Sidebar } from "./Sidebar"
import { UserNavigation } from "./UserNavigation"

export function AdminLayout({
  children,
  companies,
}: {
  children?: React.ReactNode
  companies: PromiseLike<{ data: Company[] | null }>
}) {
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

      <main className="p-3">{children}</main>
    </div>
  )
}
