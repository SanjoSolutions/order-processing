import { convertHoursToMilliseconds } from './convertHoursToMilliseconds'
import { OpeningHours } from 'scheduling'

export const openingHours: OpeningHours = [
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

export const planningTimeStep = 0.5 // hours

export const services = [
  {
    name: 'Auto waschen',
    duration: convertHoursToMilliseconds(0.5),
  },
  {
    name: 'Motoröl wechseln',
    duration: convertHoursToMilliseconds(0.5),
  },
  {
    name: 'Scheibenwischerblätter wechseln',
    duration: convertHoursToMilliseconds(0.25),
  },
]
