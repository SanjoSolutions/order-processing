'use client'

import { useCallback, useState } from 'react'

const services = ['Auto waschen', 'Motoröl wechseln']

interface TimeSlot {
  from: Date
  to: Date
}

interface Booking {
  what: string
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

export default function () {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [bookingWasSuccessful, setBookingWasSuccessful] = useState<
    boolean | null
  >(null)
  const [booking, setBooking] = useState<Booking | null>(null)

  const onSubmit = useCallback(function onSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(event.target)
    const whenIndex = formData.get('when')
    const whatIndex = formData.get('what')
    if (whatIndex !== null && whenIndex !== null) {
      // TODO: Connect with backend
      setTimeout(() => {
        setBooking({
          what: services[parseInt(whatIndex.toString(), 10)],
          when: freeTimes[parseInt(whenIndex.toString(), 10)],
        })
        setBookingWasSuccessful(true)
        setIsSubmitting(false)
      }, 1000)
    }
  }, [])

  return (
    <div className='container mt-3'>
      <div className='row'>
        <div className='col'>
          {booking && bookingWasSuccessful && (
            <div className='alert alert-success' role='alert'>
              Der Service {booking.what} wurde für den{' '}
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
                >
                  <option value='' disabled selected></option>
                  {services.map((service, index) => (
                    <option key={index} value={index}>
                      {service}
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
