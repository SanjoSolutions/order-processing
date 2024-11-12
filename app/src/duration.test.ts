import { describe, expect, it } from "vitest"
import {
  convertTimeIntervalToMilliseconds,
  formatDuration,
  formatPostgresDuration,
} from "./duration"

describe("convertTimeIntervalToMilliseconds", () => {
  it('converts "1 day 01:00:00" to milliseconds', () => {
    const result = convertTimeIntervalToMilliseconds("1 day 01:00:00")
    expect(result).toBe(90000000)
  })

  it('converts "2 days 12:30:45" to milliseconds', () => {
    const result = convertTimeIntervalToMilliseconds("2 days 12:30:45")
    expect(result).toBe(217845000)
  })

  it('converts "0 days 00:00:00" to milliseconds', () => {
    const result = convertTimeIntervalToMilliseconds("0 days 00:00:00")
    expect(result).toBe(0) // 0 milliseconds
  })

  it('throws an error for invalid format "invalid string"', () => {
    expect(() => convertTimeIntervalToMilliseconds("invalid string")).toThrow(
      "Invalid time interval format.",
    )
  })
})

describe("formatDuration", () => {
  it('formats 90000000 milliseconds to "1 day 1 hour"', () => {
    const result = formatDuration(90000000)
    expect(result).toBe("1 day 1 hour")
  })

  it('formats 217845000 milliseconds to "2 days 12 hours 30 minutes 45 seconds"', () => {
    const result = formatDuration(217845000)
    expect(result).toBe("2 days 12 hours 30 minutes 45 seconds")
  })

  it("formats 0 milliseconds to an empty string", () => {
    const result = formatDuration(0)
    expect(result).toBe("")
  })

  it('formats 3600000 milliseconds to "1 hour"', () => {
    const result = formatDuration(3600000)
    expect(result).toBe("1 hour")
  })

  it('formats 60000 milliseconds to "1 minute"', () => {
    const result = formatDuration(60000)
    expect(result).toBe("1 minute")
  })

  it('formats 1000 milliseconds to "1 second"', () => {
    const result = formatDuration(1000)
    expect(result).toBe("1 second")
  })

  it('formats 86400000 milliseconds to "1 day"', () => {
    const result = formatDuration(86400000)
    expect(result).toBe("1 day")
  })

  it('formats 7200000 milliseconds to "2 hours"', () => {
    const result = formatDuration(7200000)
    expect(result).toBe("2 hours")
  })

  it('formats 120000 milliseconds to "2 minutes"', () => {
    const result = formatDuration(120000)
    expect(result).toBe("2 minutes")
  })

  it('formats 2000 milliseconds to "2 seconds"', () => {
    const result = formatDuration(2000)
    expect(result).toBe("2 seconds")
  })

  it('formats 172800000 milliseconds to "2 days"', () => {
    const result = formatDuration(172800000)
    expect(result).toBe("2 days")
  })
})

describe("formatPostgresDuration", () => {
  it('formats "2 days 12:30:45" to "2 days 12 hours 30 minutes 45 seconds"', () => {
    const result = formatPostgresDuration("2 days 12:30:45")
    expect(result).toBe("2 days 12 hours 30 minutes 45 seconds")
  })
})
