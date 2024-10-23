export function* generateCombinations<T>(array: T[]): Generator<Set<T>> {
  const length = array.length
  for (let i = 2 ** length - 1; i > 0; i--) {
    const set = new Set<T>()
    for (let index = 0; index <= length; index++) {
      if (i & (1 << index)) {
        set.add(array[index])
      }
    }
    yield set
  }
}
