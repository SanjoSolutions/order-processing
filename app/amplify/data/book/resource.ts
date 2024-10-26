import { defineFunction, secret } from '@aws-amplify/backend'

export const book = defineFunction({
  environment: {
    connectionString: secret('SQL_CONNECTION_STRING'),
  },
})
