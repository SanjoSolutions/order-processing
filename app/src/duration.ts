const timeIntervalRegExp = /^(?:(\d+) days? ?)?(?:(\d+):(\d+):(\d+))?$/

export function convertTimeIntervalToMilliseconds(value: string): number {
  const match = timeIntervalRegExp.exec(value)
  if (match) {
    const [, days, hours, minutes, seconds] = match
    let result = 0
    if (days) {
      result += parseInt(days, 10) * 24 * 60 * 60 * 1000
    }
    if (hours) {
      result += parseInt(hours, 10) * 60 * 60 * 1000
    }
    if (minutes) {
      result += parseInt(minutes, 10) * 60 * 1000
    }
    if (seconds) {
      result += parseInt(seconds, 10) * 1000
    }
    return result
  } else {
    throw new Error("Invalid time interval format.")
  }
}

export function formatDuration(duration: number): string {
  const days = Math.floor(duration / (24 * 60 * 60 * 1000))
  const hours = Math.floor(
    (duration % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000),
  )
  const minutes = Math.floor((duration % (60 * 60 * 1000)) / (60 * 1000))
  const seconds = Math.floor((duration % (60 * 1000)) / 1000)
  let output = ""
  if (days > 0) {
    output += days
    if (days === 1) {
      output += " day"
    } else {
      output += " days"
    }
  }
  if (hours > 0) {
    if (output.length >= 1) {
      output += " "
    }
    output += hours
    if (hours === 1) {
      output += " hour"
    } else {
      output += " hours"
    }
  }
  if (minutes > 0) {
    if (output.length >= 1) {
      output += " "
    }
    output += minutes
    if (minutes === 1) {
      output += " minute"
    } else {
      output += " minutes"
    }
  }
  if (seconds > 0) {
    if (output.length >= 1) {
      output += " "
    }
    output += seconds
    if (seconds === 1) {
      output += " second"
    } else {
      output += " seconds"
    }
  }
  return output
}

export function formatPostgresDuration(duration: string): string {
  return formatDuration(convertTimeIntervalToMilliseconds(duration))
}
