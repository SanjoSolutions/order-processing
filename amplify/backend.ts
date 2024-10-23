import { defineBackend } from '@aws-amplify/backend'
import { Stack } from 'aws-cdk-lib'
import { Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam'
import { freeSlots } from './functions/free-slots/resource'
import { auth } from './auth/resource'
import { data } from './data/resource'
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations'
import { CorsHttpMethod, HttpApi } from 'aws-cdk-lib/aws-apigatewayv2'
import { HttpMethod } from 'aws-cdk-lib/aws-events'

const backend = defineBackend({
  auth,
  data,
  freeSlots,
})

const apiStack = backend.createStack('api-stack')

const api = new HttpApi(apiStack, 'API', {
  apiName: 'api',
  corsPreflight: {
    allowMethods: [CorsHttpMethod.POST],
    allowOrigins: ['*'],
    allowHeaders: ['*'],
  },
  createDefaultStage: true,
})

const httpLambdaIntegration = new HttpLambdaIntegration(
  'LambdaIntegration',
  backend.freeSlots.resources.lambda
)

api.addRoutes({
  path: '/free-slots',
  methods: [HttpMethod.POST],
  integration: httpLambdaIntegration,
})

const apiPolicy = new Policy(apiStack, 'ApiPolicy', {
  statements: [
    new PolicyStatement({
      actions: ['execute-api:Invoke'],
      resources: [`${api.arnForExecuteApi('*', '/free-slots')}`],
    }),
  ],
})

backend.auth.resources.authenticatedUserIamRole.attachInlinePolicy(apiPolicy)
backend.auth.resources.unauthenticatedUserIamRole.attachInlinePolicy(apiPolicy)

backend.addOutput({
  custom: {
    API: {
      [api.httpApiName!]: {
        endpoint: api.url,
        region: Stack.of(api).region,
        apiName: api.httpApiName,
      },
    },
  },
})
