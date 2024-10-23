import type { APIGatewayProxyHandlerV2 } from 'aws-lambda'
import { findPlans } from '../../../app/freeSlots/freeSlots'
import { convertPlansToRealizationTimeSpans } from '../../../app/freeSlots/convertPlansToRealizationTimeSpans'

export const handler: APIGatewayProxyHandlerV2 = async event => {
  console.log('event', event)

  if (event.body) {
    const { bookings, services, openingHours, planningTimeStep } = JSON.parse(
      event.body
    )

    const plans = findPlans(bookings, services, {
      openingHours,
      planningTimeStep,
    })

    const realizationTimeSPans = convertPlansToRealizationTimeSpans(plans)

    return {
      statusCode: 200,
      // Modify the CORS settings below to match your specific requirements
      headers: {
        'Access-Control-Allow-Origin': '*', // Restrict this to domains you trust
        'Access-Control-Allow-Headers': '*', // Specify only the headers you need to allow
      },
      body: JSON.stringify(realizationTimeSPans),
    }
  } else {
    return {
      statusCode: 400,
      // Modify the CORS settings below to match your specific requirements
      headers: {
        'Access-Control-Allow-Origin': '*', // Restrict this to domains you trust
        'Access-Control-Allow-Headers': '*', // Specify only the headers you need to allow
      },
      body: '',
    }
  }
}
