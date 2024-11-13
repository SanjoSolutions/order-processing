export interface Address {
  street_and_house_number?: string | null
  zip?: string | null
  city?: string | null
  country?: string | null
}

export function generateFormattedAddress(address: Address): string {
  let output = ""
  if (address.street_and_house_number) {
    output += address.street_and_house_number
  }
  if (address.zip) {
    if (output.length >= 1) {
      output += ", "
    }
    output += address.zip
  }
  if (address.city) {
    if (address.zip) {
      output += " "
    } else if (output.length >= 1) {
      output += ", "
    }
    output += address.city
  }
  if (address.country) {
    if (output.length >= 1) {
      output += ", "
    }
    output += address.country
  }
  return output
}
