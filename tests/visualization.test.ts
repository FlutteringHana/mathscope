import { expect, it } from 'vitest'
import { sampleSignal } from '../src/core/fourier/sampling'
import { combinedSeries, segmentedPoints } from '../src/visualization/adapters/series'

it('never connects original signal segments across known jumps', () => {
  for (const id of ['square', 'sawtooth', 'triangle'] as const) {
    const samples = sampleSignal(id, 50)
    const series = combinedSeries(samples, true, true)
    expect(series[0].segments).toHaveLength(id === 'square' ? 2 : 1)
    for (const segment of series[0].segments) for (const jump of samples.discontinuities) {
      expect(segment[0].x < jump && segment[segment.length - 1].x > jump).toBe(false)
    }
    expect(series[1].segments).toHaveLength(1)
  }
  expect(segmentedPoints([-1, 0, 1], [-1, 0, 1], [0])).toEqual([[{ x: -1, y: -1 }], [{ x: 1, y: 1 }]])
})
it('honors visibility without changing source data', () => {
  const samples = sampleSignal('square', 9)
  expect(combinedSeries(samples, false, false)).toEqual([])
  expect(combinedSeries(samples, false, true).map(series => series.id)).toEqual(['approximation'])
  expect(samples.original).toHaveLength(2048)
})
