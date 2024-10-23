import { findPlans } from '../freeSlots/freeSlots.js'
import { openingHours, planningTimeStep } from '../book/data'

onmessage = event => {
  postMessage(
    findPlans(event.data.bookings, event.data.services, {
      openingHours,
      planningTimeStep,
    })
  )
}
