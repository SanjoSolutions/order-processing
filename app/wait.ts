/**
 * @param duration In milliseconds.
 */
export function wait(duration: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, duration))
}
