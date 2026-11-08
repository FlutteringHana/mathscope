import type { FourierCoefficient, SignalDefinition, SignalId } from '../types'
import { finite, harmonicIndex } from '../validation'

export const PERIOD = 2 * Math.PI

/** Reduce to [-pi, pi). No epsilon-wide flattening of values near a jump. */
export function principalCoordinate(x: number): number {
  finite(x, 'Coordinate')
  // Large arguments lose phase information in IEEE-754; reject rather than imply accurate reduction.
  if (Math.abs(x) > 1e6 * PERIOD) throw new RangeError('Coordinate exceeds the supported range of one million periods.')
  const remainder = x % PERIOD
  return remainder >= Math.PI ? remainder - PERIOD : remainder < -Math.PI ? remainder + PERIOD : remainder
}

function evaluate(id: SignalId, x: number): number {
  const t = principalCoordinate(x)
  // Exact representable multiples use the declared midpoint convention, including repeated periods.
  const multiple = x / Math.PI
  const atMultiple = Number.isInteger(multiple) && x === multiple * Math.PI
  if (id === 'square') return atMultiple || t === 0 || Math.abs(t) === Math.PI ? 0 : t < 0 ? -1 : 1
  if (id === 'sawtooth') return atMultiple && Math.abs(multiple % 2) === 1 || Math.abs(t) === Math.PI ? 0 : t / Math.PI
  return 1 - 2 * Math.abs(t) / Math.PI
}

function coefficient(id: SignalId, n: number): FourierCoefficient {
  harmonicIndex(n)
  if (n === 0) return { n, a: 0, b: 0 }
  if (id === 'square') return { n, a: 0, b: n % 2 ? 4 / (Math.PI * n) : 0 }
  if (id === 'sawtooth') return { n, a: 0, b: 2 * (n % 2 ? 1 : -1) / (Math.PI * n) }
  return { n, a: n % 2 ? 8 / (Math.PI ** 2 * n ** 2) : 0, b: 0 }
}

const signals: Record<SignalId, SignalDefinition> = {
  square: { id: 'square', label: 'Square Wave', symmetry: 'odd', continuous: false, evaluate: x => evaluate('square', x), coefficient: n => coefficient('square', n) },
  sawtooth: { id: 'sawtooth', label: 'Sawtooth Wave', symmetry: 'odd', continuous: false, evaluate: x => evaluate('sawtooth', x), coefficient: n => coefficient('sawtooth', n) },
  triangle: { id: 'triangle', label: 'Triangle Wave', symmetry: 'even', continuous: true, evaluate: x => evaluate('triangle', x), coefficient: n => coefficient('triangle', n) },
}

export function getSignal(id: SignalId): SignalDefinition {
  if (!Object.hasOwn(signals, id)) throw new RangeError('Unknown signal identifier.')
  return signals[id]
}

/** Jump locations only; corners of the continuous triangle wave are not jumps. */
export function discontinuities(id: SignalId, min: number, max: number): number[] {
  const signal = getSignal(id)
  principalCoordinate(min); principalCoordinate(max)
  if (max <= min || max - min > 2 * PERIOD) throw new RangeError('Sampling interval must be positive and span at most two periods.')
  if (signal.continuous) return []
  const points: number[] = []
  for (let k = Math.ceil(min / Math.PI); k <= Math.floor(max / Math.PI); k++) {
    if (id === 'square' || Math.abs(k % 2) === 1) points.push(k === 0 ? 0 : k * Math.PI)
  }
  return points
}
