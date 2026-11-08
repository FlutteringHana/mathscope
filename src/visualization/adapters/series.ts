import type { SampledSignal } from '../../core/types'
import type { PlotSeries, Point } from '../charts/types'

/** Only reshapes data. Jump locations come from the model, never inferred from slope. */
export function segmentedPoints(x: readonly number[], y: readonly number[], jumps: readonly number[] = []): Point[][] {
  if (x.length !== y.length) throw new RangeError('Plot coordinates must have equal lengths.')
  const segments: Point[][] = []
  let current: Point[] = []
  for (let i = 0; i < x.length; i++) {
    if (!Number.isFinite(x[i]) || !Number.isFinite(y[i])) throw new RangeError('Plot coordinates must be finite.')
    const atJump = jumps.includes(x[i])
    const crossesJump = i > 0 && jumps.some(jump => x[i - 1] <= jump && x[i] >= jump)
    if (atJump || crossesJump) {
      if (current.length) segments.push(current)
      current = []
    }
    // Isolated jump midpoint samples must not join the two one-sided branches.
    if (!atJump) current.push({ x: x[i], y: y[i] })
  }
  if (current.length) segments.push(current)
  return segments
}

export function combinedSeries(data: SampledSignal, showOriginal: boolean, showApproximation: boolean): PlotSeries[] {
  const series: PlotSeries[] = []
  if (showOriginal) series.push({ id: 'original', label: 'Original signal', color: 'neutral', dashed: true, segments: segmentedPoints(data.x, data.original, data.discontinuities) })
  if (showApproximation) series.push({ id: 'approximation', label: 'Fourier approximation', color: 'cyan', segments: segmentedPoints(data.x, data.approximation) })
  return series
}
