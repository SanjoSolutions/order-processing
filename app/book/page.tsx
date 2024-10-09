'use client'

import { FormEventHandler, useCallback, useState } from 'react'

interface Service {
  name: string
  duration: number // in hours
}

const services = [
  {
    name: 'Auto waschen',
    duration: 0.5,
  },
  {
    name: 'Motoröl wechseln',
    duration: 0.5,
  },
  {
    name: 'Scheibenwischerblätter wechseln',
    duration: 0.25,
  },
]

interface TimeSlot {
  from: Date
  to: Date
}

interface Booking {
  what: Service[]
  when: TimeSlot
}

const freeTimes: TimeSlot[] = [
  {
    from: new Date('2024-10-09T12:00'),
    to: new Date('2024-10-09T13:00'),
  },
  {
    from: new Date('2024-10-09T13:00'),
    to: new Date('2024-10-09T14:00'),
  },
  {
    from: new Date('2024-10-09T18:00'),
    to: new Date('2024-10-10T12:00'),
  },
]

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

export default function () {
  const [what, setWhat] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [bookingWasSuccessful, setBookingWasSuccessful] = useState<
    boolean | null
  >(null)
  const [booking, setBooking] = useState<Booking | null>(null)

  const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    function onSubmit(event) {
      event.preventDefault()
      setIsSubmitting(true)
      const formData = new FormData(event.target as HTMLFormElement)
      const whatIndexes = formData.getAll('what')
      const whenIndex = formData.get('when')
      if (whatIndexes.length >= 1 && whenIndex !== null) {
        // TODO: Connect with backend
        setTimeout(() => {
          setBooking({
            what: whatIndexes.map(
              whatIndex => services[parseInt(whatIndex.toString(), 10)]
            ),
            when: freeTimes[parseInt(whenIndex.toString(), 10)],
          })
          setBookingWasSuccessful(true)
          setIsSubmitting(false)
        }, 200)
      }
    },
    []
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
                <select
                  id='what'
                  name='what'
                  className='form-select'
                  required
                  disabled={isSubmitting}
                  multiple
                  value={what}
                  onChange={event => {
                    setWhat(
                      Array.from(event.target.selectedOptions).map(
                        option => option.value
                      )
                    )
                  }}
                >
                  {services.map((service, index) => (
                    <option key={index} value={index}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>
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
                  {freeTimes.map((timeSlot, index) => (
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
