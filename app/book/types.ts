export interface Service {
  name: string
  duration: number // in hours
}

export interface TimeSpan {
  from: Date
  to: Date
}

export type TimeSlot = TimeSpan

export interface TimeOnDay {
  /**
   * From 0 to 23.
   */
  hours: number
  minutes: number
}

export type OpeningHoursEntry = {
  from: TimeOnDay
  to: TimeOnDay
} | null

export type OpeningHours = [
  OpeningHoursEntry,
  OpeningHoursEntry,
  OpeningHoursEntry,
  OpeningHoursEntry,
  OpeningHoursEntry,
  OpeningHoursEntry,
  OpeningHoursEntry
]

export interface Booking {
  what: Service[]
  when: TimeSlot
}

export interface PlanStep {
  timeSpan: TimeSpan
  services: Service[]
}

export type Plan = PlanStep[]
