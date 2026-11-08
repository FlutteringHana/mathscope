export function finite(value: number, name: string): number {
  if (!Number.isFinite(value)) throw new RangeError(`${name} must be finite.`)
  return value
}

/** Explicit resource bound, shared by this MVP's analytical API and UI. N=0 is the DC-only sum. */
export const MAX_HARMONIC = 50
export function harmonicIndex(n: number): void {
  if (!Number.isInteger(n) || n < 0 || n > MAX_HARMONIC) throw new RangeError(`Harmonic index must be an integer from 0 to ${MAX_HARMONIC}.`)
}
