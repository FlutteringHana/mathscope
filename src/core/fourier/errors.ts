import type { ErrorMetrics } from '../types'
import { finite } from '../validation'

/** Sampled statistics, not continuous suprema. Scaled accumulation prevents squared-error overflow. */
export function errorMetrics(original: readonly number[], approximation: readonly number[]): ErrorMetrics {
  if (original.length === 0 || original.length !== approximation.length) throw new RangeError('Error arrays must have equal, nonzero lengths.')
  let scale = 0
  let scaledSum = 0
  for (let i = 0; i < original.length; i++) {
    const error = Math.abs(finite(finite(original[i], 'Original sample') - finite(approximation[i], 'Approximation sample'), 'Sample error'))
    if (error > scale) {
      scaledSum = scaledSum * (scale / error) ** 2 + 1
      scale = error
    } else if (scale > 0) scaledSum += (error / scale) ** 2
  }
  return { rmse: finite(scale * Math.sqrt(scaledSum / original.length), 'RMSE'), maxAbsoluteError: scale, sampleCount: original.length }
}
