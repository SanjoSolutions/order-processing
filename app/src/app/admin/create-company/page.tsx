import Form from "next/form"
import { createCompany } from "./actions"

export default function CreateCompanyForm() {
  return (
    <div>
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
    </div>
  )
}
