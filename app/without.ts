export function without<T = any>(elements: T[], elementsToExclude: T[]): T[] {
  const elementsToExcludeSet = new Set(elementsToExclude)
  return elements.filter(element => !elementsToExcludeSet.has(element))
}
