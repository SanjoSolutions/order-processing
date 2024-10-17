'use client'

import { FormEventHandler, useCallback, useEffect, useState } from 'react'
import { last, maxBy, minBy, sum } from 'lodash-es'
import { wait } from '../wait'
import { combinationsAnyLength } from '@sanjo/array'
import { without } from '../without'

const planningTimeStep = 0.5 // hours

interface Service {
  name: string
  duration: number // in hours
}

interface TimeSpan {
  from: Date
  to: Date
}

type TimeSlot = TimeSpan

interface TimeOnDay {
  /**
   * From 0 to 23.
   */
  hours: number
  minutes: number
}

type OpeningHoursEntry = {
  from: TimeOnDay
  to: TimeOnDay
} | null

type OpeningHours = [
  OpeningHoursEntry,
  OpeningHoursEntry,
  OpeningHoursEntry,
  OpeningHoursEntry,
  OpeningHoursEntry,
  OpeningHoursEntry,
  OpeningHoursEntry
]

const openingHours: OpeningHours = [
  // Sunday
  null,
  // Monday
  { from: { hours: 8, minutes: 0 }, to: { hours: 18, minutes: 0 } },
  // Tuesday
  { from: { hours: 8, minutes: 0 }, to: { hours: 18, minutes: 0 } },
  // Wednesday
  { from: { hours: 8, minutes: 0 }, to: { hours: 18, minutes: 0 } },
  // Thursday
  { from: { hours: 8, minutes: 0 }, to: { hours: 18, minutes: 0 } },
  // Friday
  { from: { hours: 8, minutes: 0 }, to: { hours: 18, minutes: 0 } },
  // Saturday
  { from: { hours: 8, minutes: 0 }, to: { hours: 14, minutes: 0 } },
]

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

interface Booking {
  what: Service[]
  when: TimeSlot
}

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

function determineOpenTimeInTime() {}

function findNextOpenDay(openingHours: OpeningHours, baseDay: number) {
  let day = (baseDay + 1) % 7
  do {
    if (openingHours[day] !== null) {
      return day
    } else if (day === baseDay) {
      return null
    }
    day = (baseDay + 1) % 7
  } while (true)
}

function isStillOpenOnDay(time: Date, openingHours: OpeningHours): boolean {
  const openingHoursOnDay = openingHours[time.getDay()]
  return Boolean(
    openingHoursOnDay &&
      (time.getHours() < openingHoursOnDay.to.hours ||
        (time.getHours() === openingHoursOnDay.to.hours &&
          time.getMinutes() < openingHoursOnDay.to.minutes))
  )
}

function mergeTimeSpans(timeSpans: TimeSpan[]): TimeSpan[] {
  timeSpans = Array.from(timeSpans)
  timeSpans.sort(compareTimeSpansByFrom)
  const mergedTimeSpans = []
  if (timeSpans.length >= 1) {
    mergedTimeSpans.push(timeSpans[0])
    for (let index = 1; index < timeSpans.length; index++) {
      let timeSpan = timeSpans[index]
      let spliceStartIndex = null
      let hasInserted = false
      for (
        let mergedTimeSpansIndex = 0;
        mergedTimeSpansIndex < mergedTimeSpans.length;
        mergedTimeSpansIndex++
      ) {
        const timeSpan2 = mergedTimeSpans[mergedTimeSpansIndex]

        if (timeSpan2.from > timeSpan.to) {
          if (spliceStartIndex !== null) {
            const spliceEndIndex = mergedTimeSpansIndex
            mergedTimeSpans.splice(
              spliceStartIndex,
              spliceEndIndex - spliceStartIndex,
              timeSpan
            )
          } else {
            mergedTimeSpans.splice(mergedTimeSpansIndex, 0, timeSpan)
          }
          hasInserted = true
          break
        } else {
          if (doTimeSpansOverlapOrConnect(timeSpan2, timeSpan)) {
            timeSpan = mergeTwoTimeSpans(timeSpan2, timeSpan)
            if (spliceStartIndex === null) {
              spliceStartIndex = mergedTimeSpansIndex
            }
          }
        }
      }
      if (!hasInserted) {
        if (spliceStartIndex !== null) {
          const spliceEndIndex = mergedTimeSpans.length
          mergedTimeSpans.splice(
            spliceStartIndex,
            spliceEndIndex - spliceStartIndex,
            timeSpan
          )
        } else {
          mergedTimeSpans.push(timeSpan)
        }
      }
    }
  }
  return mergedTimeSpans
}

function compareTimeSpansByFrom(
  timeSpan1: TimeSpan,
  timeSpan2: TimeSpan
): number {
  return timeSpan1.from.getTime() - timeSpan2.from.getTime()
}

function doTimeSpansOverlapOrConnect(
  timeSpan1: TimeSpan,
  timeSpan2: TimeSpan
): boolean {
  return (
    (timeSpan1.to >= timeSpan2.from && timeSpan1.to <= timeSpan2.to) ||
    (timeSpan1.from >= timeSpan2.from && timeSpan1.from <= timeSpan2.to) ||
    (timeSpan1.from < timeSpan2.from && timeSpan1.to > timeSpan2.to)
  )
}

function mergeTwoTimeSpans(timeSpan1: TimeSpan, timeSpan2: TimeSpan): TimeSpan {
  const from = minBy([timeSpan1.from, timeSpan2.from], date => date.getTime())!
  const to = maxBy([timeSpan1.to, timeSpan2.to], date => date.getTime())!
  return {
    from,
    to,
  }
}

function determineFreeTimeSpans(
  startTime: Date,
  blockedTimeSpans: TimeSpan[],
  numberOfWeeks: number
) {
  const endTime = new Date(
    startTime.getTime() + numberOfWeeks * 7 * 24 * 60 * 60 * 1000
  )
  const freeTimeSpans: TimeSpan[] = []

  let currentStartTime = startTime
  do {
    const blockedTimeSpanAfterIndex = blockedTimeSpans.findIndex(
      blockedTimeSpan => blockedTimeSpan.from > currentStartTime
    )
    const blockedTimeSpanAfter = blockedTimeSpans[blockedTimeSpanAfterIndex]
    const blockedTimeSpanBefore =
      blockedTimeSpanAfterIndex >= 1
        ? blockedTimeSpans[blockedTimeSpanAfterIndex - 1]
        : null
    const isCurrentStartTimeInBlockedTimeSpan =
      blockedTimeSpanBefore &&
      currentStartTime >= blockedTimeSpanBefore.from &&
      currentStartTime < blockedTimeSpanBefore.to
    if (isCurrentStartTimeInBlockedTimeSpan) {
      currentStartTime = blockedTimeSpanAfter.from
    }
    if (blockedTimeSpanAfter) {
      const freeTimeSpan = {
        from: currentStartTime,
        to: blockedTimeSpanAfter.from,
      }
      freeTimeSpans.push(freeTimeSpan)
      currentStartTime = blockedTimeSpanAfter.to
    } else {
      const freeTimeSpan = {
        from: currentStartTime,
        to: endTime,
      }
      freeTimeSpans.push(freeTimeSpan)
      return freeTimeSpans
    }
  } while (currentStartTime < endTime)
  return freeTimeSpans
}

function calculateTimeSpanLength(timeSpan: TimeSpan): number {
  return timeSpan.to.getTime() - timeSpan.from.getTime()
}

function generateCombinationsWithAMaximumDuration(
  services: Service[],
  maximumDuration: number
): Service[][] {
  return combinationsAnyLength(services)
    .slice(1) // Remove []
    .filter(
      services => calculateTotalServicesDuration(services) <= maximumDuration
    )
}

function calculateTotalServicesDuration(services: Service[]): number {
  return sum(
    services.map(service => convertHoursToMilliseconds(service.duration))
  )
}

function convertHoursToMilliseconds(hours: number): number {
  return hours * 60 * 60 * 1000
}

function findPlans(bookings: Booking[], services: Service[]): Plan[] {
  if (services.length === 0) {
    return []
  }

  const numberOfWeeks = 10

  const now = new Date()

  const closedTimes = []
  // FIXME: Use UTC in opening hours and here so that it works across time zones
  let currentDay = new Date(now)
  currentDay.setHours(0, 0, 0, 0)
  for (let week = 1; week < numberOfWeeks; week++) {
    for (let day = now.getDay(); day < 6; day++) {
      const openingHoursOnDay = openingHours[day]

      if (openingHoursOnDay) {
        const opensLaterThanStartOfDay =
          openingHoursOnDay.from.hours > 0 ||
          (openingHoursOnDay.from.hours === 0 &&
            openingHoursOnDay.from.minutes > 0)
        if (opensLaterThanStartOfDay) {
          const beforeOpeningTimeSpan = {
            from: currentDay,
            to: new Date(
              currentDay.getTime() +
                openingHoursOnDay.from.hours * 60 * 60 * 1000 +
                openingHoursOnDay.from.minutes * 60 * 1000
            ),
          }
          closedTimes.push(beforeOpeningTimeSpan)
        }

        const closesEarlierThanEndOfDay = !(
          openingHoursOnDay.to.hours === 0 && openingHoursOnDay.to.minutes === 0
        )
        if (closesEarlierThanEndOfDay) {
          const afterClosingTimeSpan = {
            from: new Date(
              currentDay.getTime() +
                openingHoursOnDay.to.hours * 60 * 60 * 1000 +
                openingHoursOnDay.to.minutes * 60 * 1000
            ),
            to: new Date(currentDay.getTime() + 24 * 60 * 60 * 1000),
          }
          closedTimes.push(afterClosingTimeSpan)
        }
      }

      currentDay = new Date(currentDay.getTime() + 24 * 60 * 60 * 1000)
    }
  }

  const bookedTimes = bookings.map(booking => booking.when)
  const blockedTimeSpans = mergeTimeSpans(closedTimes.concat(bookedTimes))
  const freeTimeSpans: TimeSpan[] = determineFreeTimeSpans(
    now,
    blockedTimeSpans,
    numberOfWeeks
  )

  const plans = continuePlanning(freeTimeSpans, [], services, 0)

  return plans
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

interface PlanStep {
  timeSpan: TimeSpan
  services: Service[]
}

type Plan = PlanStep[]

function continuePlanning(
  freeTimeSpans: TimeSpan[],
  plan: Plan,
  remainingServices: Service[],
  nextFreeTimeSpanIndex: number
): Plan[] {
  // TODO: Booking services multiple times
  let plans: Plan[] = []
  for (
    let freeTimeSpanIndex = nextFreeTimeSpanIndex;
    freeTimeSpanIndex < freeTimeSpans.length;
    freeTimeSpanIndex++
  ) {
    const freeTimeSpan = freeTimeSpans[freeTimeSpanIndex]
    const sections = generateSectionsFromTimeSpan(freeTimeSpan)
    for (const section of sections) {
      const possibleServiceCombinationsThatCanBeDoneInTheFreeTimeSpan =
        generateCombinationsWithAMaximumDuration(
          remainingServices,
          calculateTimeSpanLength(section)
        )
      const extraPlans =
        possibleServiceCombinationsThatCanBeDoneInTheFreeTimeSpan.map(
          services =>
            plan.concat([
              {
                timeSpan: {
                  from: section.from,
                  to: new Date(
                    section.from.getTime() +
                      calculateTotalServicesDuration(services)
                  ),
                },
                services,
              },
            ])
        )
      const extraPlansThatCompleteAllServices = extraPlans.filter(
        plan =>
          without(remainingServices, plan[plan.length - 1].services).length ===
          0
      )
      if (extraPlansThatCompleteAllServices.length >= 1) {
        plans.push(
          minBy(extraPlansThatCompleteAllServices, plan =>
            last(plan)!.timeSpan.to.getTime()
          )!
        )
      } else {
        let plans2: Plan[] = []
        for (const plan of extraPlans) {
          const remainingServices2 = without(
            remainingServices,
            plan[plan.length - 1].services
          )
          if (remainingServices2.length >= 1) {
            if (freeTimeSpanIndex + 1 < freeTimeSpans.length) {
              plans2 = plans2.concat(
                continuePlanning(
                  freeTimeSpans,
                  plan,
                  remainingServices2,
                  freeTimeSpanIndex + 1
                )
              )
            }
          }
        }
        if (plans2.length >= 1) {
          plans.push(minBy(plans2, plan => last(plan)!.timeSpan.to.getTime())!)
        }
      }
    }
  }
  return plans
}

function generateSectionsFromTimeSpan(timeSpan: TimeSpan): TimeSpan[] {
  const sections = []
  const { from, to } = timeSpan
  const planningTimeStepInMs = planningTimeStep * 60 * 60 * 1000
  let currentStartTime = findNextStartTimeThatFitsSections(from)
  while (currentStartTime < to) {
    const timeSpan2 = {
      from: currentStartTime,
      to,
    }
    sections.push(timeSpan2)

    currentStartTime = new Date(
      currentStartTime.getTime() + planningTimeStepInMs
    )
  }
  return sections
}

function findNextStartTimeThatFitsSections(time: Date): Date {
  const planningTimeStepInMs = planningTimeStep * 60 * 60 * 1000
  const time2 = time.getTime() - (time.getTime() % planningTimeStepInMs)
  if (time2 === time.getTime()) {
    return new Date(time2)
  } else {
    return new Date(time2 + planningTimeStepInMs)
  }
}

export default function () {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [what, setWhat] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [bookingWasSuccessful, setBookingWasSuccessful] = useState<
    boolean | null
  >(null)
  const [booking, setBooking] = useState<Booking | null>(null)

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
      let selectedServices = what.map(index => services[parseInt(index, 10)])
      let plans = findPlans(bookings, selectedServices)
      plans.sort(
        (plan1, plan2) =>
          plan1[plan1.length - 1].timeSpan.to.getTime() -
          plan2[plan2.length - 1].timeSpan.to.getTime()
      )
      setTimeSlots(convertPlansToRealisationTimeSpans(plans))
    },
    [bookings, what]
  )

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
            when: timeSlots[parseInt(whenIndex.toString(), 10)],
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
