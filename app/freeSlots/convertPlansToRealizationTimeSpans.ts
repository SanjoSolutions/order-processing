import { Plan, TimeSpan } from '../book/types'

export function convertPlansToRealizationTimeSpans(plans: Plan[]): TimeSpan[] {
  return plans.map(convertPlanToRealizationTimeSpan)
}

function convertPlanToRealizationTimeSpan(plan: Plan): TimeSpan {
  return {
    from: plan[0].timeSpan.from,
    to: plan[plan.length - 1].timeSpan.to,
  }
}
