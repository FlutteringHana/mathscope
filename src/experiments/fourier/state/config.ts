import type { SignalId } from '../../../core/types'
export type { SignalId } from '../../../core/types'
export interface FourierConfig {
  signalId: SignalId
  maxHarmonic: number
  showOriginal: boolean
  showApproximation: boolean
  showHarmonics: boolean
}
export const signalLabels: Record<SignalId, string> = { square: 'Square Wave', sawtooth: 'Sawtooth Wave', triangle: 'Triangle Wave' }
export const defaultConfig: FourierConfig = {
  signalId: 'square', maxHarmonic: 9, showOriginal: true, showApproximation: true, showHarmonics: true,
}
export function isSignalId(value: string): value is SignalId { return Object.hasOwn(signalLabels, value) }
