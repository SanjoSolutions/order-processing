"use client"

import { generateFormattedAddress } from "@/generateFormattedAddress"
import { createClient } from "@/supabase/client/createClient"
import {
  type Booking as BookingPostgres,
  type Company,
  type PermanentEstablishment,
  type Service as ServicePostgres,
} from "@/types"
import {
  FormEventHandler,
  use,
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEventHandler,
} from "react"
import "react-big-calendar/lib/css/react-big-calendar.css"
import {
  convertPlansToRealizationTimeSpans,
  Service,
  TimeSlot,
  TimeSpan,
  type Booking,
} from "scheduling"

const supabase = createClient()

// TODO: Support scheduling for a long time (more than a year) in the future. For the case where someone is booked out for a long time.

// TODO: Support other locales too.
const locale = "de-DE"
const withDate = Intl.DateTimeFormat(locale, {
  dateStyle: "short",
  timeStyle: "short",
})
const onlyDate = Intl.DateTimeFormat(locale, { dateStyle: "short" })
const onlyTime = Intl.DateTimeFormat(locale, { timeStyle: "short" })

function formatTimeSlot(timeSlot: TimeSlot) {
  if (isFromAndToOnSameDay(timeSlot)) {
    return `${withDate.format(timeSlot.from)} Uhr bis ${onlyTime.format(
      timeSlot.to,
    )} Uhr`
  } else {
    return `${withDate.format(timeSlot.from)} Uhr bis ${withDate.format(
      timeSlot.to,
    )} Uhr`
  }
}

function formatTimeSlotForBookingConfirmation(timeSlot: TimeSlot) {
  if (isFromAndToOnSameDay(timeSlot)) {
    return `${onlyDate.format(timeSlot.from)} von ${onlyTime.format(
      timeSlot.from,
    )} Uhr bis ${onlyTime.format(timeSlot.to)} Uhr`
  } else {
    return `${withDate.format(timeSlot.from)} Uhr bis ${withDate.format(
      timeSlot.to,
    )} Uhr`
  }
}

function isFromAndToOnSameDay(timeSlot: TimeSlot) {
  const { from, to } = timeSlot
  return (
    from.getDate() === to.getDate() &&
    from.getMonth() === to.getMonth() &&
    from.getFullYear() === to.getFullYear()
  )
}

function formatServices(services: Service[]): string {
  if (services.length === 1) {
    return `Der Service ${services[0].name} wurde`
  } else if (services.length >= 2) {
    return `Die Services ${formatAsList(
      services.map((service) => service.name),
    )} wurden`
  } else {
    return ""
  }
}

function formatAsList(elements: string[]): string {
  if (elements.length === 1) {
    return elements[0]
  } else if (elements.length >= 2) {
    return `${elements.slice(0, -1).join(", ")} und ${
      elements[elements.length - 1]
    }`
  } else {
    return ""
  }
}

const tsRangeRegExp = /^[([]"(.+)","(.+)"[)\]]$/

function convertTsRangeToTimeSpan(value: string): TimeSpan {
  const match = tsRangeRegExp.exec(value)
  if (match) {
    return {
      from: new Date(match[1] + " UTC"),
      to: new Date(match[2] + " UTC"),
    }
  } else {
    throw new Error("Failed to parse Tsrange.")
  }
}

enum BookingError {
  Other = 0,
  DuringOverlaps = 1,
}

export function Form({
  company: companyPromise,
  permanentEstablishment: permanentEstablishmentPromise,
  bookings: initialBookingsPromise,
  services: servicesPromise,
}: {
  company: PromiseLike<{ data: Pick<Company, "name"> | null }>
  permanentEstablishment: PromiseLike<{
    data: Pick<
      PermanentEstablishment,
      "name" | "street_and_house_number" | "zip" | "city" | "country"
    > | null
  }>
  bookings: PromiseLike<{ data: BookingPostgres[] | null }>
  services: PromiseLike<{ data: ServicePostgres[] | null }>
}) {
  const company = use(companyPromise).data
  const permanentEstablishment = use(permanentEstablishmentPromise).data
  const initialBookings = use(initialBookingsPromise)
  const services = use(servicesPromise).data
  const [bookings, setBookings] = useState<Booking[]>(
    initialBookings.data?.map(({ during }) => ({
      what: [],
      when: convertTsRangeToTimeSpan(during),
    })) ?? [],
  )
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [what, setWhat] = useState<number[]>([])
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [bookingWasSuccessful, setBookingWasSuccessful] = useState<
    boolean | null
  >(null)
  const [error, setError] = useState<number | null>(null)
  const [booking, setBooking] = useState<Booking | null>(null)

  const workerRef = useRef<Worker>(null)

  useEffect(
    function () {
      const worker = new Worker(new URL("./worker.ts", import.meta.url))
      workerRef.current = worker

      worker.onmessage = (event) => {
        setTimeSlots(convertPlansToRealizationTimeSpans(event.data))
      }

      return () => {
        worker.terminate()
      }
    },
    [workerRef],
  )

  // useEffect(function requestBookings() {
  //   async function request() {
  //     const now = new Date()
  //     const { data, errors } = await client.queries.existingBookings({
  //       during: `[${now.toISOString()}, ${new Date(
  //         now.getTime() + 7 * 24 * 60 * 60 * 1000,
  //       ).toISOString()})`,
  //     })
  //     debugger
  //     if (errors) {
  //       console.error(errors)
  //     } else if (data) {
  //       const { result } = JSON.parse(data as string)
  //       const bookings = result.map((item: { during: string }) => ({
  //         what: [],
  //         when: convertTsRangeToTimeSpan(item.during),
  //       }))
  //       debugger
  //       setBookings(bookings)
  //     }
  //   }

  //   request()
  // }, [])

  useEffect(
    function updateTimeSlots() {
      if (workerRef.current) {
        let selectedServices = what.map((index) => services[index])
        const now = new Date()
        workerRef.current.postMessage({
          from: now,
          to: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
          bookings,
          services: selectedServices,
        })
      }
    },
    [bookings, what, workerRef],
  )

  const onAddService: MouseEventHandler<HTMLButtonElement> = useCallback(
    function onAddService(event) {
      const select = (
        event.target as HTMLButtonElement
      ).parentElement!.querySelector("select")!
      const addedService = parseInt(select.value, 10)
      if (!Number.isNaN(addedService)) {
        setWhat([...what, addedService])
      }
    },
    [what],
  )

  const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    async function onSubmit(event) {
      event.preventDefault()
      setIsSubmitting(true)
      const formData = new FormData(event.target as HTMLFormElement)
      const whenIndex = formData.get("when")
      if (what.length >= 1 && whenIndex !== null) {
        const timeSlot = timeSlots[parseInt(whenIndex.toString(), 10)]
        const { error, status } = await supabase.from("bookings").insert({
          during: `[${timeSlot.from.toISOString()}, ${timeSlot.to.toISOString()})`,
        })
        if (error) {
          if (error.code === "23P01") {
            setError(BookingError.DuringOverlaps)
          } else {
            setError(BookingError.Other)
          }
          setBookingWasSuccessful(false)
        } else if (status === 201) {
          setBookingWasSuccessful(true)
          setBooking({
            what: what.map((whatIndex) => services[whatIndex]),
            when: timeSlots[parseInt(whenIndex.toString(), 10)],
          })
          setError(null)
        } else {
          setBookingWasSuccessful(false)
          setError(BookingError.Other)
        }
        setIsSubmitting(false)
      }
    },
    [timeSlots, what],
  )

  const formattedAddress = generateFormattedAddress(permanentEstablishment)

  return (
    <div className="container mt-3">
      <div className="row justify-content-center">
        <div className="col col-md-6">
          <h1>Book</h1>

          <div className="mb-2">
            <strong>Company:</strong> {company?.name}
            <br />
            {permanentEstablishment && (
              <>
                <strong>Permanent establishment:</strong>{" "}
                {permanentEstablishment.name}
                {formattedAddress && ` (${formattedAddress})`}
              </>
            )}
          </div>

          {booking && bookingWasSuccessful && (
            <div className="alert alert-success" role="alert">
              {formatServices(booking.what)} für den{" "}
              {formatTimeSlotForBookingConfirmation(booking.when)} gebucht.
            </div>
          )}
          {bookingWasSuccessful === false && (
            <div className="alert alert-danger mb-3" role="alert">
              {error === BookingError.DuringOverlaps
                ? "Der Zeitraum, den Sie ausgewählt haben, ist bereits belegt. Bitte wählen Sie einen anderen Zeitraum aus."
                : "Es gab einen Fehler beim buchen. Bitte versuchen Sie es telefonisch."}
            </div>
          )}
          {!booking && (
            <form onSubmit={onSubmit}>
              <div className="mb-2">
                <label htmlFor="what" className="form-label h5">
                  What?
                </label>
                <div className="input-group">
                  <select
                    id="what"
                    name="what"
                    className="form-select"
                    required
                    disabled={isSubmitting}
                    defaultValue={0}
                  >
                    {services.map((service, index) => (
                      <option key={index} value={index}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    id="button-addon2"
                    onClick={onAddService}
                  >
                    Add
                  </button>
                </div>
              </div>

              {what.length >= 1 && (
                <div>
                  <p className="mb-2">Ausgewählte Dienstleistungen:</p>

                  <ul>
                    {what.map((serviceIndex, index) => (
                      <li key={index}>{services[serviceIndex].name}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-3 mb-3">
                <label htmlFor="when" className="form-label h5">
                  When?
                </label>
                <select
                  id="when"
                  name="when"
                  className="form-select"
                  required
                  disabled={isSubmitting || what.length === 0}
                  defaultValue={0}
                >
                  {timeSlots.map((timeSlot, index) => (
                    <option key={index} value={index}>
                      {formatTimeSlot(timeSlot)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="text-end">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting || what.length === 0}
                >
                  Book
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
