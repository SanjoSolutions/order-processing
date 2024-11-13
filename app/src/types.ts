import { Tables } from "./database.types.js"

export type Booking = Tables<"bookings">
export type Service = Tables<"services">
export type Company = Tables<"companies">
export type PermanentEstablishment = Tables<"permanent_establishments">
export type OpeningHours = Tables<"opening_hours">
