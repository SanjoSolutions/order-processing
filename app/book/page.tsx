'use client'

import {
  FormEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { wait } from '../wait'
import { Booking, Plan, Service, TimeSlot, TimeSpan } from './types'
import { services } from './data'

const worker = new Worker(new URL('./worker', import.meta.url), {
  type: 'module',
})

// TODO: Support other locales too.
const locale = 'de-DE'
const withDate = Intl.DateTimeFormat(locale, {
  dateStyle: 'short',
  timeStyle: 'short',
})
const onlyDate = Intl.DateTimeFormat(locale, { dateStyle: 'short' })
const onlyTime = Intl.DateTimeFormat(locale, { timeStyle: 'short' })

function formatTimeSlot(timeSlot: TimeSlot) {
  if (isFromAndToOnSameDay(timeSlot)) {
    return `${withDate.format(timeSlot.from)} Uhr bis ${onlyTime.format(
      timeSlot.to
    )} Uhr`
  } else {
    return `${withDate.format(timeSlot.from)} Uhr bis ${withDate.format(
      timeSlot.to
    )} Uhr`
  }
}

function formatTimeSlotForBookingConfirmation(timeSlot: TimeSlot) {
  if (isFromAndToOnSameDay(timeSlot)) {
    return `${onlyDate.format(timeSlot.from)} von ${onlyTime.format(
      timeSlot.from
    )} Uhr bis ${onlyTime.format(timeSlot.to)} Uhr`
  } else {
    return `${withDate.format(timeSlot.from)} Uhr bis ${withDate.format(
      timeSlot.to
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
      services.map(service => service.name)
    )} wurden`
  } else {
    return ''
  }
}

function formatAsList(elements: string[]): string {
  if (elements.length === 1) {
    return elements[0]
  } else if (elements.length >= 2) {
    return `${elements.slice(0, -1).join(', ')} und ${
      elements[elements.length - 1]
    }`
  } else {
    return ''
  }
}

function convertPlansToRealisationTimeSpans(plans: Plan[]): TimeSpan[] {
  return plans.map(convertPlanToRealisationTimeSpan)
}

function convertPlanToRealisationTimeSpan(plan: Plan): TimeSpan {
  return {
    from: plan[0].timeSpan.from,
    to: plan[plan.length - 1].timeSpan.to,
  }
}

export default function () {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [what, setWhat] = useState<number[]>([])
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [bookingWasSuccessful, setBookingWasSuccessful] = useState<
    boolean | null
  >(null)
  const [booking, setBooking] = useState<Booking | null>(null)

  useEffect(function () {
    worker.onmessage = event => {
      setTimeSlots(convertPlansToRealisationTimeSpans(event.data))
    }
    return () => {
      worker.onmessage = null
    }
  }, [])

  useEffect(function requestBookings() {
    async function request() {
      // TODO: Connect with backend
      wait(50)
      setBookings([])
    }

    request()
  }, [])

  useEffect(
    function updateTimeSlots() {
      let selectedServices = what.map(index => services[index])
      worker.postMessage({
        bookings,
        services: selectedServices,
      })
    },
    [bookings, what]
  )

  const onAddService = useCallback(
    function onAddService(event) {
      const select = event.target.parentElement.querySelector('select')
      setWhat([...what, select.value])
    },
    [what]
  )

  const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    function onSubmit(event) {
      event.preventDefault()
      setIsSubmitting(true)
      const formData = new FormData(event.target as HTMLFormElement)
      const whenIndex = formData.get('when')
      if (what.length >= 1 && whenIndex !== null) {
        // TODO: Connect with backend
        setTimeout(() => {
          setBooking({
            what: what.map(whatIndex => services[whatIndex]),
            when: timeSlots[parseInt(whenIndex.toString(), 10)],
          })
          setBookingWasSuccessful(true)
          setIsSubmitting(false)
        }, 200)
      }
    },
    [timeSlots, what]
  )

  return (
    <div className='container mt-3'>
      <div className='row'>
        <div className='col'>
          {booking && bookingWasSuccessful && (
            <div className='alert alert-success' role='alert'>
              {formatServices(booking.what)} für den{' '}
              {formatTimeSlotForBookingConfirmation(booking.when)} gebucht.
            </div>
          )}

          {bookingWasSuccessful === false && (
            <div className='alert alert-danger mb-3' role='alert'>
              Es gab einen Fehler beim buchen. Bitte versuchen Sie es
              telefonisch.
            </div>
          )}

          {!booking && (
            <form onSubmit={onSubmit}>
              <div className='mb-3'>
                <label htmlFor='what' className='form-label'>
                  Was?
                </label>
                <div className='input-group'>
                  <select
                    id='what'
                    name='what'
                    className='form-select'
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
                    className='btn btn-outline-secondary'
                    type='button'
                    id='button-addon2'
                    onClick={onAddService}
                  >
                    Hinzufügen
                  </button>
                </div>
              </div>

              {what.length >= 1 && (
                <div className='mb-3'>
                  <p className='mb-2'>Ausgewählte Dienstleistungen</p>

                  <ul className='list-group'>
                    {what.map((serviceIndex, index) => (
                      <li key={index} className='list-group-item'>
                        {services[serviceIndex].name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className='mb-3'>
                <label htmlFor='when' className='form-label'>
                  Wann?
                </label>
                <select
                  id='when'
                  name='when'
                  className='form-select'
                  required
                  disabled={isSubmitting}
                >
                  {timeSlots.map((timeSlot, index) => (
                    <option key={index} value={index} selected={index === 0}>
                      {formatTimeSlot(timeSlot)}
                    </option>
                  ))}
                </select>
              </div>
              <div className='text-end'>
                <button
                  type='submit'
                  className='btn btn-primary'
                  disabled={isSubmitting}
                >
                  Buchen
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
