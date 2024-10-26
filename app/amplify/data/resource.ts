import { type ClientSchema, a, defineData } from '@aws-amplify/backend'
import { users } from './users/resource.js'
import { book } from './book/resource.js'
import { schema as generatedSqlSchema } from './schema.sql'

const sqlSchema = generatedSqlSchema
  .renameModels(() => [['bookings', 'Booking']])
  .setAuthorization(models => [
    models.Booking.authorization(allow => [allow.publicApiKey()]),
  ])

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/
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

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
