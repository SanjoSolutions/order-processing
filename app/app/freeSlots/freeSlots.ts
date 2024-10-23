import { Booking, OpeningHours, Plan, Service, TimeSpan } from '../book/types'
import { last, maxBy, minBy } from 'lodash-es'
import { without } from '../without'
import { generateCombinations } from '../combinations/combinations'

export function findPlans(
  bookings: Booking[],
  services: Service[],
  {
    openingHours,
    planningTimeStep,
  }: { openingHours: OpeningHours; planningTimeStep: number }
): Plan[] {
  if (services.length === 0) {
    return []
  }

  const numberOfWeeks = 1

  const now = new Date()

  const closedTimes = []
  // FIXME: Use UTC in opening hours and here so that it works across time zones
  let currentDay = new Date(now)
  currentDay.setHours(0, 0, 0, 0)
  for (let week = 1; week <= numberOfWeeks + 1; week++) {
    for (
      let day = week === 1 ? now.getDay() : 0;
      day <= 6 && (week <= numberOfWeeks || day <= now.getDay());
      day++
    ) {
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

  services = services.map(service => ({ ...service }))
  const plans = continuePlanning(freeTimeSpans, services, { planningTimeStep })

  return plans
}

function continuePlanning(
  freeTimeSpans: TimeSpan[],
  services: Service[],
  { planningTimeStep }: { planningTimeStep: number }
): Plan[] {
  let plans: Plan[] = []
  for (
    let freeTimeSpanIndex = 0;
    freeTimeSpanIndex < freeTimeSpans.length;
    freeTimeSpanIndex++
  ) {
    const freeTimeSpan = freeTimeSpans[freeTimeSpanIndex]
    const sections = generateSectionsFromTimeSpan(freeTimeSpan, {
      planningTimeStep,
    })
    for (const section of sections) {
      const plan2 = continuePlanning2(
        freeTimeSpans,
        [],
        services,
        freeTimeSpanIndex,
        section
      )
      if (plan2) {
        plans.push(plan2)
      }
    }
  }
  return plans
}

function continuePlanning2(
  freeTimeSpans: TimeSpan[],
  plan: Plan,
  remainingServices: Service[],
  freeTimeSpanIndex: number,
  timeSpan: TimeSpan
): Plan | null {
  for (const services of generateCombinationsWithAMaximumDuration(
    remainingServices,
    calculateTimeSpanLength(timeSpan)
  )) {
    const plan2 = plan.concat([
      {
        timeSpan: {
          from: timeSpan.from,
          to: new Date(
            timeSpan.from.getTime() + calculateTotalServicesDuration(services)
          ),
        },
        services: Array.from(services),
      },
    ])
    if (services.size === remainingServices.length) {
      // All remaining services can be done
      return plan2
    } else {
      const remainingServices2 = without(
        remainingServices,
        last(plan2)!.services
      )
      if (freeTimeSpanIndex + 1 < freeTimeSpans.length) {
        const plan3 = continuePlanning2(
          freeTimeSpans,
          plan2,
          remainingServices2,
          freeTimeSpanIndex + 1,
          freeTimeSpans[freeTimeSpanIndex + 1]
        )
        if (plan3) {
          return plan3
        }
      }
    }
  }

  return null
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
      currentStartTime = blockedTimeSpanBefore.to
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

function generateSectionsFromTimeSpan(
  timeSpan: TimeSpan,
  { planningTimeStep }: { planningTimeStep: number }
): TimeSpan[] {
  const sections = []
  const { from, to } = timeSpan
  const planningTimeStepInMs = planningTimeStep * 60 * 60 * 1000
  let currentStartTime = findNextStartTimeThatFitsSections(from, {
    planningTimeStep,
  })
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

function* generateCombinationsWithAMaximumDuration(
  services: Service[],
  maximumDuration: number
): Generator<Set<Service>> {
  for (const servicesCombination of generateCombinations(services)) {
    if (
      calculateTotalServicesDuration(servicesCombination) <= maximumDuration
    ) {
      yield servicesCombination
    }
  }
}

function calculateTimeSpanLength(timeSpan: TimeSpan): number {
  return timeSpan.to.getTime() - timeSpan.from.getTime()
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

function calculateTotalServicesDuration(services: Set<Service>): number {
  let totalDuration = 0
  for (const service of services) {
    totalDuration += service.duration
  }
  return totalDuration
}

function findNextStartTimeThatFitsSections(
  time: Date,
  { planningTimeStep }: { planningTimeStep: number }
): Date {
  const planningTimeStepInMs = planningTimeStep * 60 * 60 * 1000
  const time2 = time.getTime() - (time.getTime() % planningTimeStepInMs)
  if (time2 === time.getTime()) {
    return new Date(time2)
  } else {
    return new Date(time2 + planningTimeStepInMs)
  }
}
