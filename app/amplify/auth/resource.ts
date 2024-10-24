import { defineAuth } from '@aws-amplify/backend'
import { users } from '../data/users/resource.js'

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  groups: ['Admins'],
  access: allow => [allow.resource(users).to(['listUsers'])],
})
