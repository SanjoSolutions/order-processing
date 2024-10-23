import { defineFunction } from '@aws-amplify/backend'

export const freeSlots = defineFunction({
  name: 'free-slots',
  memoryMB: 128,
})
