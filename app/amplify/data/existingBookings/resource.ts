import { defineFunction, secret } from '@aws-amplify/backend'

export const existingBookings = defineFunction({
  environment: {
    connectionString: secret('SQL_CONNECTION_STRING'),
  },
})
