import { defineBackend } from '@aws-amplify/backend'
import { Stack } from 'aws-cdk-lib'
import { Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam'
import { freeSlots } from './functions/free-slots/resource'
import { auth } from './auth/resource'
import { data } from './data/resource'
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations'
import { CorsHttpMethod, HttpApi } from 'aws-cdk-lib/aws-apigatewayv2'
import { HttpMethod } from 'aws-cdk-lib/aws-events'
import * as rds from 'aws-cdk-lib/aws-rds'
import * as ec2 from 'aws-cdk-lib/aws-ec2'

const backend = defineBackend({
  auth,
  data,
  freeSlots,
})

const databaseStack = backend.createStack('database-stack')

// TODO: Remove NAT gateway.
const vpc = new ec2.Vpc(databaseStack, 'VPC')

const databaseSecurityGroup = new ec2.SecurityGroup(
  databaseStack,
  'DatabaseSecurityGroup',
  {
    vpc,
    allowAllOutbound: true,
  }
)
databaseSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.POSTGRES)
databaseSecurityGroup.addIngressRule(ec2.Peer.anyIpv6(), ec2.Port.POSTGRES)
databaseSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.HTTPS)
databaseSecurityGroup.addIngressRule(ec2.Peer.anyIpv6(), ec2.Port.HTTPS)

new rds.DatabaseInstance(databaseStack, 'Database', {
  databaseName: 'scheduling',
  engine: rds.DatabaseInstanceEngine.postgres({
    version: rds.PostgresEngineVersion.VER_16_4,
  }),
  storageType: rds.StorageType.GP3,
  allocatedStorage: 20,
  instanceType: ec2.InstanceType.of(
    ec2.InstanceClass.T4G,
    ec2.InstanceSize.MICRO
  ),
  vpc,
  multiAz: false,
  publiclyAccessible: true,
  vpcSubnets: {
    subnetType: ec2.SubnetType.PUBLIC,
  },
  networkType: rds.NetworkType.IPV4,
  performanceInsightRetention: 7, // free tier
  securityGroups: [databaseSecurityGroup],
  credentials: rds.Credentials.fromGeneratedSecret('postgres'),
})

// TODO: Optional proxy to database

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
