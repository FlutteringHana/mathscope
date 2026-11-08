import { describe, expect, it } from 'vitest'
import { getSignal, principalCoordinate } from '../src/core/signals/signals'
import { coefficients, evaluateSeries, partialSum } from '../src/core/fourier/series'
import { sampleSignal } from '../src/core/fourier/sampling'
import { errorMetrics } from '../src/core/fourier/errors'
import type { SignalId } from '../src/core/types'

const ids: SignalId[] = ['square', 'sawtooth', 'triangle']
describe.each(ids)('%s mathematical contract', id => {
  const signal = getSignal(id)
  it('has the documented symmetry, periodicity, bounds and zero mean', () => {
    for (const x of [.01, .27, 1, 2.6, Math.PI]) {
      expect(signal.evaluate(-x)).toBeCloseTo(signal.evaluate(x) * (signal.symmetry === 'odd' ? -1 : 1), 12)
      for (const k of [-3, -1, 1, 4]) expect(signal.evaluate(x + k * 2 * Math.PI)).toBeCloseTo(signal.evaluate(x), 12)
    }
    const data = sampleSignal(id, 9)
    expect(data.original.every(v => Math.abs(v) <= 1)).toBe(true)
    expect(data.original.reduce((a, b) => a + b, 0) / data.x.length).toBeCloseTo(0, 12)
  })
  it('matches independently integrated coefficients', () => {
    const m = 32768
    for (const n of [1, 2, 3, 8, 49, 50]) {
      let a = 0; let b = 0
      for (let i = 0; i < m; i++) {
        const x = -Math.PI + (i + .5) * 2 * Math.PI / m
        a += signal.evaluate(x) * Math.cos(n * x) * 2 / m
        b += signal.evaluate(x) * Math.sin(n * x) * 2 / m
      }
      expect(signal.coefficient(n).a).toBeCloseTo(a, 6)
      expect(signal.coefficient(n).b).toBeCloseTo(b, 6)
    }
  })
  it('uses the precise midpoint grid and finite sums at N=50', () => {
    const data = sampleSignal(id, 50)
    expect(data.x).toHaveLength(2048)
    expect(data.x[0]).toBe(-Math.PI + Math.PI / 2048)
    expect(data.x[2047]).toBe(-Math.PI + 2047.5 * 2 * Math.PI / 2048)
    expect(data.x).not.toContain(0)
    expect(data.x).not.toContain(Math.PI)
    expect(data.approximation.every(Number.isFinite)).toBe(true)
    expect(data.approximation[800]).toBe(partialSum(id, 50, data.x[800]))
  })
  it('reduces sampled RMSE with more harmonics', () => {
    const low = sampleSignal(id, 1); const high = sampleSignal(id, 50)
    expect(errorMetrics(high.original, high.approximation).rmse).toBeLessThan(errorMetrics(low.original, low.approximation).rmse)
  })
  it.each([-1, .5, 51, NaN, Infinity])('rejects invalid harmonic index %s', n => {
    expect(() => signal.coefficient(n)).toThrow(RangeError)
    expect(() => partialSum(id, n, .2)).toThrow(RangeError)
  })
  it.each([NaN, Infinity, -Infinity, 1e20])('rejects invalid coordinate %s', x => {
    expect(() => signal.evaluate(x)).toThrow(RangeError)
    expect(() => partialSum(id, 9, x)).toThrow(RangeError)
  })
})

describe('analytical conventions', () => {
  it('implements the three definitions and endpoint conventions', () => {
    const square = getSignal('square'); const saw = getSignal('sawtooth'); const triangle = getSignal('triangle')
    expect(square.evaluate(-.1)).toBe(-1); expect(square.evaluate(.1)).toBe(1)
    expect(saw.evaluate(Math.PI / 2)).toBe(.5)
    expect(triangle.evaluate(0)).toBe(1); expect(triangle.evaluate(Math.PI / 2)).toBe(0)
    for (let k = -5; k <= 5; k++) {
      expect(square.evaluate(k * Math.PI)).toBe(0)
      expect(saw.evaluate(k * Math.PI)).toBeCloseTo(0, 14)
      expect(triangle.evaluate(k * Math.PI)).toBeCloseTo(k % 2 ? -1 : 1, 14)
    }
    expect(square.evaluate(Number.EPSILON)).toBe(1)
    expect(square.evaluate(-Number.EPSILON)).toBe(-1)
    expect(square.evaluate(Number.MIN_VALUE)).toBe(1)
    expect(square.evaluate(-Number.MIN_VALUE)).toBe(-1)
    expect(saw.evaluate(Math.PI - 1e-10)).toBeGreaterThan(.99)
    expect(saw.evaluate(Math.PI + 1e-10)).toBeLessThan(-.99)
  })
  it('has exact analytical coefficients and zero even harmonics where required', () => {
    expect(getSignal('square').coefficient(3)).toEqual({ n: 3, a: 0, b: 4 / (3 * Math.PI) })
    expect(getSignal('sawtooth').coefficient(2)).toEqual({ n: 2, a: 0, b: -1 / Math.PI })
    expect(getSignal('triangle').coefficient(3)).toEqual({ n: 3, a: 8 / (9 * Math.PI ** 2), b: 0 })
    for (const id of ['square', 'triangle'] as const) for (let n = 2; n <= 50; n += 2) expect(getSignal(id).coefficient(n)).toEqual({ n, a: 0, b: 0 })
  })
  it('includes a0/2 and all indices through N, including zeros', () => {
    expect(evaluateSeries([{ n: 0, a: 6, b: 0 }, { n: 1, a: 2, b: 0 }], 0)).toBe(5)
    expect(coefficients('square', 9)).toHaveLength(10)
    expect(partialSum('square', 0, 1)).toBe(0)
    expect(partialSum('square', 2, .3)).toBeCloseTo(4 / Math.PI * Math.sin(.3), 14)
    expect(partialSum('triangle', 3, .7)).toBeCloseTo(8 / Math.PI ** 2 * (Math.cos(.7) + Math.cos(2.1) / 9), 14)
    expect(partialSum('sawtooth', 2, .7)).toBeCloseTo((2 * Math.sin(.7) - Math.sin(1.4)) / Math.PI, 14)
  })
  it('provides jump locations for segmented rendering and periodic zoom windows', () => {
    expect(sampleSignal('square', 9).discontinuities).toEqual([-Math.PI, 0, Math.PI])
    expect(sampleSignal('sawtooth', 9).discontinuities).toEqual([-Math.PI, Math.PI])
    expect(sampleSignal('triangle', 9).discontinuities).toEqual([])
    expect(sampleSignal('sawtooth', 50, 2048, Math.PI - .6, Math.PI + .6).discontinuities).toEqual([Math.PI])
  })
})

describe('numerical error handling', () => {
  it('computes known metrics and stable large-magnitude RMSE', () => {
    expect(errorMetrics([1, 2, 3], [0, 2, 5])).toEqual({ rmse: Math.sqrt(5 / 3), maxAbsoluteError: 2, sampleCount: 3 })
    expect(errorMetrics([1, 1], [1, 1]).rmse).toBe(0)
    expect(errorMetrics([1e200, 1e200], [0, 0]).rmse).toBe(1e200)
  })
  it('rejects empty, unequal, nonfinite or overflowing error data', () => {
    for (const [a, b] of [[[], []], [[1], []], [[NaN], [1]], [[1], [Infinity]], [[1e308], [-1e308]]]) expect(() => errorMetrics(a, b)).toThrow(RangeError)
    expect(() => evaluateSeries([{ n: 1, a: NaN, b: 0 }], 0)).toThrow(RangeError)
  })
  it.each([0, -1, 1.5, NaN, Infinity, 65537])('rejects invalid sample count %s', count => expect(() => sampleSignal('square', 9, count)).toThrow(RangeError))
  it('rejects unknown signals and invalid intervals', () => {
    expect(() => getSignal('unknown' as SignalId)).toThrow(RangeError)
    expect(() => getSignal('toString' as SignalId)).toThrow(RangeError)
    expect(() => sampleSignal('square', 9, 100, 1, 0)).toThrow(RangeError)
    expect(() => sampleSignal('square', 9, 100, 0, Infinity)).toThrow(RangeError)
    expect(() => principalCoordinate(NaN)).toThrow(RangeError)
  })
})
