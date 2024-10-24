import type { Schema } from '../resource'
import {
  CognitoIdentityProviderClient,
  ListUsersCommand,
} from '@aws-sdk/client-cognito-identity-provider'
import { env } from '$amplify/env/users'

const client = new CognitoIdentityProviderClient()

export const handler: Schema['users']['functionHandler'] = async (
  event,
  context
) => {
  const input = {
    UserPoolId: env.AMPLIFY_AUTH_USERPOOL_ID,
    // AttributesToGet: [
    //   // SearchedAttributeNamesListType
    //   'STRING_VALUE',
    // ],
    // Limit: Number('int'),
    // PaginationToken: 'STRING_VALUE',
    // Filter: 'STRING_VALUE',
  }
  const command = new ListUsersCommand(input)
  const response = await client.send(command)
  console.log('response', response)
  return []
}
