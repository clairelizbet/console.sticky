export type NumericRange = number[] | Readonly<number[]>

export function compareAscending(a: number, b: number): number {
  if (a > b) return 1
  if (a < b) return -1
  return 0
}

export function inRange(
  num: number,
  range: NumericRange,
  inclusive: boolean = true
): boolean {
  const [lowerBound, upperBound] = [...range].sort(compareAscending)

  return inclusive
    ? num >= lowerBound && num <= upperBound
    : num > lowerBound && num < upperBound
}

export function inAnyRange(
  num: number,
  ranges: Array<NumericRange>,
  inclusive: boolean = true
): boolean {
  let found: boolean = false

  for (const range of ranges) {
    found = inRange(num, range, inclusive)
    if (found) break
  }

  return found
}
