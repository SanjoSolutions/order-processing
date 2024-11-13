"use client"

import { formatPostgresDuration } from "@/duration"
import { createClient } from "@/supabase/client/createClient"
import type { Service } from "@/types"
import Form from "next/form"
import { use, useEffect, useState } from "react"
import { addService } from "./ServiceSettingsActions"

const supabase = createClient()

interface BaseProps {
  services: PromiseLike<{ data: Service[] | null }>
}

interface PropsWithCompanyId extends BaseProps {
  companyId: string
}

interface PropsWithPermanentEstablishmentId extends BaseProps {
  permanentEstablishmentId: string
}

export function ServiceSettings({
  services: servicesPromise,
  ...props
}: PropsWithCompanyId | PropsWithPermanentEstablishmentId) {
  const initialServices = use(servicesPromise)
  const [services, setServices] = useState<Service[]>(
    initialServices.data ?? [],
  )

  useEffect(function listenToServiceInserts() {
    const subscription = supabase
      .channel("room1")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "services" },
        (payload) => {
          setServices((services) => [...services, payload.new as Service])
        },
      )
      .subscribe()
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <>
      <h2>Services</h2>

      {services && (
        <table className="table table-striped mb-3">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Duration</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id}>
                <td>{service.name}</td>
                <td>{formatPostgresDuration(service.duration)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3>Add new service</h3>

      <Form action={addService}>
        {"companyId" in props && (
          <input
            name="company-id"
            type="hidden"
            defaultValue={props.companyId}
          />
        )}
        {"permanentEstablishmentId" in props && (
          <input
            name="permanent-establishment-id"
            type="hidden"
            defaultValue={props.permanentEstablishmentId}
          />
        )}

        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="duration" className="form-label">
            Duration
          </label>
          <div className="row">
            <div className="col">
              <div className="input-group">
                <input
                  type="number"
                  defaultValue={0}
                  min={0}
                  className="form-control"
                  id="duration-days"
                  name="duration-days"
                  required
                />
                <span className="input-group-text" id="basic-addon2">
                  days
                </span>
              </div>
            </div>
            <div className="col">
              <div className="input-group">
                <input
                  type="number"
                  defaultValue={0}
                  min={0}
                  className="form-control"
                  id="duration-hours"
                  name="duration-hours"
                  required
                />
                <span className="input-group-text" id="basic-addon2">
                  hours
                </span>
              </div>
            </div>
            <div className="col">
              <div className="input-group">
                <input
                  type="number"
                  defaultValue={0}
                  min={0}
                  className="form-control"
                  id="duration-minutes"
                  name="duration-minutes"
                  required
                />
                <span className="input-group-text" id="basic-addon2">
                  minutes
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-end">
          <button className="btn btn-secondary">Add service</button>
        </div>
      </Form>
    </>
  )
}
