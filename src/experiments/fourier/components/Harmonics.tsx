import { useState } from 'react'
import type { FourierCoefficient } from '../../../core/types'
import { sampleHarmonic } from '../../../core/fourier/series'
import { segmentedPoints } from '../../../visualization/adapters/series'
import { LinePlot } from '../../../visualization/charts/LinePlot'
import styles from './Workspace.module.css'

export function Harmonics({ terms, x, min, max }: { terms: readonly FourierCoefficient[]; x: readonly number[]; min: number; max: number }) {
  const nonzero = terms.filter(term => term.n > 0 && (term.a !== 0 || term.b !== 0))
  const [selected, setSelected] = useState(1)
  const term = nonzero.find(item => item.n === selected) ?? nonzero[0]
  const series = [{ id: `harmonic-${term.n}`, label: `Harmonic n = ${term.n}`, color: 'violet' as const,
    segments: segmentedPoints(x, sampleHarmonic(term, x)) }]
  return <details className={styles.panel} open>
    <summary>Harmonic components <span className={styles.subtle}>{nonzero.length} nonzero terms</span></summary>
    <p className={styles.note}>Inspect one contribution at a time. Zero coefficients are omitted here and retained in the Analysis table.</p>
    <div className={styles.harmonicList} role="group" aria-label="Inspect harmonic">
      {nonzero.map(item => <button key={item.n} aria-pressed={item.n === term.n} onClick={() => setSelected(item.n)}>n = {item.n}</button>)}
    </div>
    <LinePlot series={series} min={min} max={max} label={`Harmonic n = ${term.n}`} description={`Contribution: aₙ cos(nx) + bₙ sin(nx). aₙ = ${term.a.toFixed(6)}, bₙ = ${term.b.toFixed(6)}.`} />
  </details>
}
