import { useMemo } from 'react'
import type { ErrorMetrics, FourierCoefficient, SignalId } from '../../../core/types'
import { sampleSignal } from '../../../core/fourier/sampling'
import { Formula } from '../../../components/ui/Formula'
import { LinePlot } from '../../../visualization/charts/LinePlot'
import { combinedSeries } from '../../../visualization/adapters/series'
import { commonFormulas, theory } from '../config/theory'
import type { FourierConfig } from '../state/config'
import styles from './Workspace.module.css'

function GibbsView({ signalId, maxHarmonic, showOriginal, showApproximation }: {
  signalId: SignalId; maxHarmonic: number; showOriginal: boolean; showApproximation: boolean
}) {
  const center = signalId === 'square' ? 0 : Math.PI
  const data = useMemo(() => sampleSignal(signalId, maxHarmonic, 2048, center - .6, center + .6), [signalId, maxHarmonic, center])
  return <LinePlot key={signalId} series={combinedSeries(data, showOriginal, showApproximation)} min={data.min} max={data.max} label="Gibbs exploration"
    description={`Local view around x = ${signalId === 'square' ? '0' : 'π'}: 2048 midpoints in a 1.2-radian window. These local samples are separate from the global error grid.`} />
}

export default function Analysis({ config, errors, terms }: { config: FourierConfig; errors: ErrorMetrics; terms: readonly FourierCoefficient[] }) {
  return <>
    <section className={styles.metrics} aria-label="Sampled approximation errors">
      <div className={styles.metric}><span>Sampled RMSE</span><output>{errors.rmse.toFixed(6)}</output><small>Approximation to normalized L² error</small></div>
      <div className={styles.metric}><span>Sampled Maximum Absolute Error</span><output>{errors.maxAbsoluteError.toFixed(6)}</output><small>Maximum on the sample grid, not the continuous maximum</small></div>
    </section>
    <section className={styles.panel}><div className={styles.prose}><h2>Reproducible numerical estimates</h2>
      <p>N = {config.maxHarmonic} · M = {errors.sampleCount} · Uniform midpoint grid on (−π, π). Amplitude is dimensionless. The even sample count avoids the square wave’s central jump and both interval endpoints.</p>
      <Formula tex={commonFormulas.midpoint} label="Canonical midpoint sampling grid" />
      <Formula tex={commonFormulas.rmse} label="Sampled root mean square error" /><Formula tex={commonFormulas.maxError} label="Sampled maximum absolute error" />
      <p>Displayed metrics are rounded to six decimal places. Changing the plot zoom does not change this grid or these global metrics. The maximum near a jump depends on sampling resolution.</p>
    </div></section>
    <section className={styles.panel}><div className={styles.panelHeading}><h2>Fourier coefficients</h2><code>Analytical · 0 ≤ n ≤ {config.maxHarmonic}</code></div>
      <div className={styles.tableScroll} tabIndex={0} role="region" aria-label="Fourier coefficient table">
        <table><caption>All indices through N, including zero coefficients. The constant contribution is a₀/2 = 0.</caption><thead><tr><th scope="col">Index n</th><th scope="col">aₙ · cosine</th><th scope="col">bₙ · sine</th></tr></thead>
          <tbody>{terms.map(term => <tr key={term.n}><th scope="row">{term.n === 0 ? '0 (DC)' : term.n}</th><td>{term.a.toFixed(6)}</td><td>{term.n === 0 ? '—' : term.b.toFixed(6)}</td></tr>)}</tbody>
        </table>
      </div>
    </section>
    <section className={styles.panel}><div className={styles.prose}><h2>{config.signalId === 'triangle' ? 'Continuous convergence' : 'Gibbs exploration'}</h2>
      <p>{theory[config.signalId].convergence}</p>
      {config.signalId !== 'triangle' && <p>As N grows, the overshoot narrows but its limiting height approaches approximately <strong>8.949% of the jump magnitude</strong>. Here the jump magnitude is 2. This is a theoretical limiting value, not a measurement of the finite-N plot. Increase N in the Inspector to explore localization.</p>}
    </div>{config.signalId !== 'triangle' && <GibbsView signalId={config.signalId} maxHarmonic={config.maxHarmonic} showOriginal={config.showOriginal} showApproximation={config.showApproximation} />}</section>
  </>
}
