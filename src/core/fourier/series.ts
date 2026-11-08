import type { FourierCoefficient, SignalId } from '../types'
import { getSignal, principalCoordinate } from '../signals/signals'
import { finite, harmonicIndex } from '../validation'

export function coefficients(id: SignalId, maxHarmonic: number): FourierCoefficient[] {
  harmonicIndex(maxHarmonic)
  const signal = getSignal(id)
  return Array.from({ length: maxHarmonic + 1 }, (_, n) => signal.coefficient(n))
}

/** Includes a0/2; index N is the highest index, not a count of nonzero terms. */
export function partialSum(id: SignalId, maxHarmonic: number, x: number): number {
  return evaluateSeries(coefficients(id, maxHarmonic), x)
}

export function evaluateSeries(terms: readonly FourierCoefficient[], x: number): number {
  const t = principalCoordinate(x)
  let sum = 0
  for (const term of terms) {
    harmonicIndex(term.n)
    finite(term.a, 'Cosine coefficient'); finite(term.b, 'Sine coefficient')
    sum += term.n === 0 ? term.a / 2 : term.a * Math.cos(term.n * t) + term.b * Math.sin(term.n * t)
  }
  return finite(sum, 'Fourier sum')
}

export function sampleHarmonic(term: FourierCoefficient, x: readonly number[]): number[] {
  return x.map(value => evaluateSeries([term], value))
}
