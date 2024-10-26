import type { Schema } from '../resource'
import { env } from '$amplify/env/book'
import pg from 'pg'

export const handler: Schema['book']['functionHandler'] = async (
  event,
  context
) => {
  let result
  let client

  try {
    client = new pg.Client({
      connectionString: env.connectionString,
      ssl: true,
    })
    await client.connect()
  } catch (error) {
    result = {
      error: 2,
    }
  }

  if (client) {
    try {
      const queryResult = await client.query(
        `
      INSERT INTO bookings (during)
      VALUES ($1)
      `,
        [event.arguments.during]
      )
      result = {
        result: {
          hasBooked: queryResult.rowCount === 1,
        },
      }
    } catch (error: any) {
      if (
        error.severity === 'ERROR' &&
        error.constraint === 'bookings_during_excl'
      ) {
        result = {
          error: 1,
        }
      } else {
        console.error(error)
        result = {
          error: 2,
        }
      }
    } finally {
      await client.end()
    }
  }

  return result!
}
