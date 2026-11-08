export type SignalId = 'square' | 'sawtooth' | 'triangle'
export interface FourierCoefficient { readonly n: number; readonly a: number; readonly b: number }
export interface SignalDefinition {
  readonly id: SignalId
  readonly label: string
  readonly symmetry: 'odd' | 'even'
  readonly continuous: boolean
  readonly evaluate: (x: number) => number
  readonly coefficient: (n: number) => FourierCoefficient
}
export interface SampledSignal {
  readonly x: readonly number[]
  readonly original: readonly number[]
  readonly approximation: readonly number[]
  readonly discontinuities: readonly number[]
  readonly min: number
  readonly max: number
}
export interface ErrorMetrics { readonly rmse: number; readonly maxAbsoluteError: number; readonly sampleCount: number }
