"use client"

import { formatPostgresDuration } from "@/duration"
import { createClient } from "@/supabase/client/createClient"
import type { Service } from "@/types"
import Form from "next/form"
import { use, useEffect, useState } from "react"
import { addService } from "./ServiceSettingsActions"
import { onDelete } from "./actions"

const supabase = createClient()

interface BaseProps {
  services: PromiseLike<{ data: Service[] | null }>
  companyServices?: PromiseLike<{ data: Service[] | null }>
}

interface PropsWithCompanyId extends BaseProps {
  companyId: string
}

interface PropsWithPermanentEstablishmentId extends BaseProps {
  permanentEstablishmentId: string
}

enum Type {
  Unhandled = 0,
  Company = 1,
  PermanentEstablishment = 2,
}

export function ServiceSettings({
  services: servicesPromise,
  companyServices: companyServicesPromise,
  ...props
}: PropsWithCompanyId | PropsWithPermanentEstablishmentId) {
  const type =
    "companyId" in props
      ? Type.Company
      : "permanentEstablishmentId" in props
        ? Type.PermanentEstablishment
        : Type.Unhandled
  const initialServices = use(servicesPromise)
  const [services, setServices] = useState<Service[]>(
    initialServices.data ?? [],
  )

  const initialCompanyServices = companyServicesPromise
    ? use(companyServicesPromise)
    : null
  const [companyServices, setCompanyServices] = useState<Service[] | null>(
    initialCompanyServices ? (initialCompanyServices.data ?? []) : null,
  )

  useEffect(
    function listenToServiceInserts() {
      let filter
      if (type === Type.Company) {
        filter = `company_id=eq.${(props as any).companyId}`
      } else {
        filter = undefined
      }

      const subscription = supabase
        .channel("room1")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "services", filter },
          (payload) => {
            const service = payload.new as Service
            if (type === Type.Company) {
              setServices((services) => [...services, service])
            } else if (type === Type.PermanentEstablishment) {
              if (service.company_id) {
                setCompanyServices((services) => [...(services ?? []), service])
              } else if (service.permanent_establishment_id) {
                setServices((services) => [...services, service])
              }
            }
          },
        )
        .on(
          "postgres_changes",
          { event: "DELETE", schema: "public", table: "services", filter },
          (payload) => {
            const service = payload.old as Service
            setServices((services) =>
              services.filter(({ id }) => id !== service.id),
            )
            setCompanyServices((services) =>
              services ? services.filter(({ id }) => id !== service.id) : null,
            )
          },
        )
        .subscribe()
      return () => {
        subscription.unsubscribe()
      }
    },
    [props],
  )

  return (
    <>
      <h2>Services</h2>

      {"permanentEstablishmentId" in props &&
        companyServices &&
        companyServices.length >= 1 && (
          <>
            <h3>Company-wide</h3>

            <table className="table table-striped mb-3">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Duration</th>
                </tr>
              </thead>
              <tbody>
                {companyServices.map((service) => (
                  <tr key={service.id}>
                    <td>{service.name}</td>
                    <td>{formatPostgresDuration(service.duration)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

      {services && (
        <>
          {"permanentEstablishmentId" in props &&
            companyServices &&
            companyServices.length >= 1 && <h3>At permanent establishment</h3>}

          <table className="table table-striped mb-3">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Duration</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <ServiceRow key={service.id} service={service} />
              ))}
            </tbody>
          </table>
        </>
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

function ServiceRow({ service }: { service: Service }) {
  return (
    <tr key={service.id}>
      <td>{service.name}</td>
      <td>{formatPostgresDuration(service.duration)}</td>
      <td>
        <form action={onDelete}>
          <input type="hidden" name="id" value={service.id} />
          <button type="submit" className="btn btn-outline-secondary">
            <i className="bi bi-trash"></i>
          </button>
        </form>
      </td>
    </tr>
  )
}
