import type { SignalId } from '../../../core/types'
import { Formula } from '../../../components/ui/Formula'
import { commonFormulas, theory } from '../config/theory'
import { signalLabels } from '../state/config'
import styles from './Workspace.module.css'

export default function Theory({ signalId }: { signalId: SignalId }) {
  const content = theory[signalId]
  return <div className={styles.reading}>
    <section className={styles.panel}><div className={styles.prose}><span className={styles.sectionNumber}>01 / SIGNAL MODEL</span><h2>{signalLabels[signalId]}</h2>
      <Formula tex={content.definition} label="Signal definition" /><p>{content.boundary}</p><p>{content.symmetry}</p>
    </div></section>
    <section className={styles.panel}><div className={styles.prose}><span className={styles.sectionNumber}>02 / FOURIER EXPANSION</span><h2>From a signal to its harmonics</h2>
      <p>All signals use period 2π and zero mean. The coefficients below are analytical expressions, not estimates from sampled data.</p>
      <Formula tex={commonFormulas.integrals} label="Fourier coefficient integral definitions" />
      <Formula tex={content.coefficients} label="Analytical coefficients of the selected signal" />
      <Formula tex={content.series} label="Infinite Fourier series" />
      <h3>The finite approximation</h3><Formula tex={commonFormulas.partialSum} label="Fourier partial sum" />
      <p>N denotes the highest harmonic index. Every index from 1 through N is included, even when its coefficient is zero. The Explorer supports N = 1–50.</p>
    </div></section>
    <section className={styles.panel}><div className={styles.prose}><span className={styles.sectionNumber}>03 / CONVERGENCE</span><h2>What changes as N grows?</h2>
      <p>{content.convergence}</p><Formula tex={commonFormulas.jump} label="Convergence at a jump" />
      <p>For square and sawtooth waves, the value at a jump is the midpoint of the two limits. Original curves are drawn as separate segments at jumps. The triangle wave is continuous and needs no such split.</p>
    </div></section>
  </div>
}
