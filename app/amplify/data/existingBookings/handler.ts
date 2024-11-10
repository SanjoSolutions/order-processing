import type { Schema } from '../resource'
import { env } from '$amplify/env/existingBookings'
import pg from 'pg'

export const handler: Schema['existingBookings']['functionHandler'] = async (
  event,
  context
) => {
  let response
  let client

  try {
    client = new pg.Client({
      connectionString: env.connectionString,
      ssl: true,
    })
    await client.connect()
  } catch (error) {
    response = {
      error: 2,
    }
  }

  if (client) {
    try {
      const queryResult = await client.query(
        `
      SELECT * FROM bookings
      WHERE during && $1::tsrange
      `,
        [event.arguments.during]
      )
      response = {
        result: queryResult.rows,
      }
    } catch (error: any) {
      console.error(error)
      response = {
        error: 2,
      }
    } finally {
      await client.end()
    }
  }

  return response!
}
