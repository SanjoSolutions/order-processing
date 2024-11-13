import Form from "next/form"
import { createPermanentEstablishment } from "./actions"

export default async function CreatePermanentEstablishmentForm({
  params,
}: {
  params: Promise<{ companyId: string }>
}) {
  const { companyId } = await params

  return (
    <div>
      <h1>Create permanent establishment</h1>

      <Form action={createPermanentEstablishment}>
        <input name="company-id" type="hidden" defaultValue={companyId} />

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
          Create permanent establishment
        </button>
      </Form>
    </div>
  )
}
