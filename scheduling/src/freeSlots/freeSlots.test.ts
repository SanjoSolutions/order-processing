import { findPlans } from './freeSlots.js'
import { describe, expect, it } from '@jest/globals'

describe('findPlans', () => {
  it('find plans', () => {
    const plans = findPlans(
      [],
      [
        {
          name: 'Bring out trash',
          duration: 900000,
        },
      ],
      {
        openingHours: [
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
        ],
        planningTimeStep: 0.5,
        from: new Date('2024-10-23T00:00:00'),
        to: new Date('2024-10-24T00:00:00'),
      }
    )

    // TODO: FIXME
    expect(plans).toEqual([])
  })
})
