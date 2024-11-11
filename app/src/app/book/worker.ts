import { findPlans } from 'scheduling'
import { openingHours, planningTimeStep } from '../book/data'

onmessage = event => {
  postMessage(
    findPlans(event.data.bookings, event.data.services, {
      from: event.data.from,
      to: event.data.to,
      openingHours,
      planningTimeStep,
    })
  )
}
