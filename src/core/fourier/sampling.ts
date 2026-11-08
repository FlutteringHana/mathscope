import type { SampledSignal, SignalId } from '../types'
import { discontinuities, getSignal } from '../signals/signals'
import { coefficients, evaluateSeries } from './series'

export const SAMPLE_COUNT = 2048

/** Uniform midpoint quadrature. The default interval is the canonical error grid. */
export function sampleSignal(id: SignalId, maxHarmonic: number, count = SAMPLE_COUNT, min = -Math.PI, max = Math.PI): SampledSignal {
  if (!Number.isInteger(count) || count < 1 || count > 65536) throw new RangeError('Sample count must be an integer from 1 to 65536.')
  const jumps = discontinuities(id, min, max)
  const signal = getSignal(id)
  const terms = coefficients(id, maxHarmonic)
  const x = Array.from({ length: count }, (_, i) => min + (i + .5) * (max - min) / count)
  return { x, original: x.map(signal.evaluate), approximation: x.map(value => evaluateSeries(terms, value)), discontinuities: jumps, min, max }
}
