"use client"

import type { OpeningHours } from "@/types"
import Form from "next/form"
import { use, useActionState } from "react"
import { saveOpeningHours } from "./actions"

export function OpeningHoursSettings({
  permanentEstablishmentId,
  openingHours: openingHoursPromise,
}: {
  permanentEstablishmentId: string
  openingHours: PromiseLike<{ data: OpeningHours | null }>
}) {
  const openingHours = use(openingHoursPromise).data

  const [state, formAction] = useActionState(saveOpeningHours, openingHours)

  return (
    <Form action={formAction}>
      <h2>Opening hours</h2>

      <input
        name="permanent-establishment-id"
        type="hidden"
        defaultValue={permanentEstablishmentId}
      />

      <table className="table table-striped mb-3">
        <thead>
          <tr>
            <th scope="col">Day</th>
            <th scope="col">From</th>
            <th scope="col">To</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Monday</td>
            <td>
              <input
                name="monday-from"
                className="form-control"
                type="time"
                defaultValue={state?.monday_from ?? ""}
              />
            </td>
            <td>
              <input
                name="monday-to"
                className="form-control"
                type="time"
                defaultValue={state?.monday_to ?? ""}
              />
            </td>
          </tr>
          <tr>
            <td>Tuesday</td>
            <td>
              <input
                name="tuesday-from"
                className="form-control"
                type="time"
                defaultValue={state?.tuesday_from ?? ""}
              />
            </td>
            <td>
              <input
                name="tuesday-to"
                className="form-control"
                type="time"
                defaultValue={state?.tuesday_to ?? ""}
              />
            </td>
          </tr>
          <tr>
            <td>Wednesday</td>
            <td>
              <input
                name="wednesday-from"
                className="form-control"
                type="time"
                defaultValue={state?.wednesday_from ?? ""}
              />
            </td>
            <td>
              <input
                name="wednesday-to"
                className="form-control"
                type="time"
                defaultValue={state?.wednesday_to ?? ""}
              />
            </td>
          </tr>
          <tr>
            <td>Thursday</td>
            <td>
              <input
                name="thursday-from"
                className="form-control"
                type="time"
                defaultValue={state?.thursday_from ?? ""}
              />
            </td>
            <td>
              <input
                name="thursday-to"
                className="form-control"
                type="time"
                defaultValue={state?.thursday_to ?? ""}
              />
            </td>
          </tr>
          <tr>
            <td>Friday</td>
            <td>
              <input
                name="friday-from"
                className="form-control"
                type="time"
                defaultValue={state?.friday_from ?? ""}
              />
            </td>
            <td>
              <input
                name="friday-to"
                className="form-control"
                type="time"
                defaultValue={state?.friday_to ?? ""}
              />
            </td>
          </tr>
          <tr>
            <td>Saturday</td>
            <td>
              <input
                name="saturday-from"
                className="form-control"
                type="time"
                defaultValue={state?.saturday_from ?? ""}
              />
            </td>
            <td>
              <input
                name="saturday-to"
                className="form-control"
                type="time"
                defaultValue={state?.saturday_to ?? ""}
              />
            </td>
          </tr>
          <tr>
            <td>Sunday</td>
            <td>
              <input
                name="sunday-from"
                className="form-control"
                type="time"
                defaultValue={state?.sunday_from ?? ""}
              />
            </td>
            <td>
              <input
                name="sunday-to"
                className="form-control"
                type="time"
                defaultValue={state?.sunday_to ?? ""}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <div className="text-end">
        <button className="btn btn-secondary" type="submit">
          {/* TODO: Feedback that save has worked. */}
          Save
        </button>
      </div>
    </Form>
  )
}
