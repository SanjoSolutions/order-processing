import { createClient } from "@/supabase/server/createClient"
import Form from "next/form"
import { AdminLayout } from "../AdminLayout"
import { createCompany } from "./actions"

export default async function CreateCompanyForm() {
  const supabase = await createClient()
  const companies = supabase.from("companies").select()

  return (
    <AdminLayout companies={companies}>
      <h1>Create company</h1>

      <Form action={createCompany}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-control"
            required
            autoFocus
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Create company
        </button>
      </Form>
    </AdminLayout>
  )
}
