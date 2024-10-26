import { type ClientSchema, a, defineData } from '@aws-amplify/backend'
import { users } from './users/resource.js'
import { book } from './book/resource.js'
import { schema as generatedSqlSchema } from './schema.sql'
import { existingBookings } from './existingBookings/handler.js'

const sqlSchema = generatedSqlSchema
  .renameModels(() => [['bookings', 'Booking']])
  .setAuthorization(models => [
    models.Booking.authorization(allow => [allow.publicApiKey()]),
  ])

const schema = a.schema({
  TimeSpan: a.customType({
    from: a.datetime().required(),
    to: a.datetime().required(),
  }),

  Service: a
    .model({
      name: a.string().required(),
      duration: a.float().required(),
    })
    .authorization(allow => [
      allow.publicApiKey().to(['read']),
      allow.group('Admins'),
    ]),

  User: a.customType({
    name: a.string(),
  }),

  users: a
    .query()
    .returns(a.ref('User').array())
    .authorization(allow => [allow.group('Admins')])
    .handler(a.handler.function(users)),

  book: a
    .mutation()
    .arguments({
      during: a.string().required(),
    })
    .returns(a.json().required())
    .authorization(allow => [allow.publicApiKey()])
    .handler(a.handler.function(book)),

  existingBookings: a
    .query()
    .arguments({
      during: a.string().required(),
    })
    .returns(a.ref('Booking').array())
    .authorization(allow => [allow.publicApiKey()])
    .handler(a.handler.function(existingBookings)),
})

const combinedSchema = a.combine([schema, sqlSchema])

export type Schema = ClientSchema<typeof combinedSchema>

export const data = defineData({
  schema: combinedSchema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
})
