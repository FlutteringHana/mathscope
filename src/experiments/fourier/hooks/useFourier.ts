import { useMemo } from 'react'
import type { SignalId } from '../../../core/types'
import { sampleSignal } from '../../../core/fourier/sampling'
import { coefficients } from '../../../core/fourier/series'
import { errorMetrics } from '../../../core/fourier/errors'

export function useFourier(signalId: SignalId, maxHarmonic: number) {
  return useMemo(() => {
    const samples = sampleSignal(signalId, maxHarmonic)
    return { samples, terms: coefficients(signalId, maxHarmonic), errors: errorMetrics(samples.original, samples.approximation) }
  }, [signalId, maxHarmonic])
}
