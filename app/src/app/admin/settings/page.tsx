"use client"

import { type FormEventHandler, useCallback, useEffect, useState } from "react"
import { Service } from "scheduling"

export default function () {
  const [services, setServices] = useState<Service[]>([])

  useEffect(function () {
    async function requestData() {
      // FIXME
      // const { data: services, errors } = await client.models.Service.list()
      // setServices(services || [])
    }

    requestData()
  }, [])

  const onSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    async function onSubmit(event) {
      event.preventDefault()
      const form = event.target as HTMLFormElement
      const formData = new FormData(form)
      // FIXME
      // const { errors, data: service } = await client.models.Service.create({
      //   name: formData.get("name")!.toString(),
      //   duration: parseFloat(formData.get("duration")!.toString()),
      // })
      // if (errors) {
      //   errors.forEach((error) => console.error(error))
      // }
    },
    [],
  )

  return (
    <div className="flex-grow-1 p-3">
      <h1>Services</h1>

      {services && (
        <ul className="list-group">
          {services.map((service) => (
            <li className="list-group-item">
              {service.name} ({service.duration}h)
            </li>
          ))}
        </ul>
      )}

      <h2>Add new service</h2>

      <form onSubmit={onSubmit}>
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
            autoFocus
          />
        </div>

        <div className="mb-3">
          <label htmlFor="duration" className="form-label">
            Duration
          </label>
          <div className="input-group">
            <input
              type="number"
              min={0}
              className="form-control"
              id="duration"
              name="duration"
              required
            />
            <span className="input-group-text" id="basic-addon2">
              h
            </span>
          </div>
        </div>

        <div className="text-end">
          <button className="btn btn-secondary">Add service</button>
        </div>
      </form>
    </div>
  )
}
