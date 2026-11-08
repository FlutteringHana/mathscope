import { Tabs } from '../../../components/ui/Tabs'
import { signalLabels, type FourierConfig } from '../state/config'
import { useState } from 'react'
import styles from './Workspace.module.css'

const tabs = ['Experiment', 'Theory', 'Analysis'] as const
export function Workspace({ config }: { config: FourierConfig }) {
  const [tab, setTab] = useState<typeof tabs[number]>('Experiment')
  return <>
    <div className={styles.breadcrumb}>Fourier & Signal Processing <span>/</span> Experiment 01</div>
    <div className={styles.title}><div><h1>Fourier Explorer</h1><p>Explore how simple harmonics reconstruct a periodic signal.</p></div><span className={styles.badge}>2π PERIODIC</span></div>
    <Tabs values={tabs} active={tab} onChange={setTab} />
    <div role="tabpanel" id="workspace-panel" aria-labelledby={`tab-${tab}`} tabIndex={0}>
      <section className={styles.panel}>
        <div className={styles.panelHeading}><h2>{tab === 'Experiment' ? 'Signal reconstruction' : tab}</h2><code>{signalLabels[config.signalId]} · N = {config.maxHarmonic}</code></div>
        <div className={styles.placeholder}><span className={styles.placeholderMark}>∿</span><h2>{tab === 'Experiment' ? 'Your experiment workspace' : `${tab} workspace`}</h2><p>{tab === 'Experiment' ? 'Signal visualization will be connected after the Fourier engine is verified.' : 'Mathematical content will be available in the analysis milestone.'}</p><small>Application shell · Controls currently update configuration only</small></div>
      </section>
      {tab === 'Experiment' && config.showHarmonics && <details className={styles.panel} open><summary>Harmonic components</summary><p className={styles.note}>Individual nonzero harmonics will appear here when the computation engine is connected.</p></details>}
    </div>
    <footer className={styles.footer}><span>MathScope / Fourier laboratory</span><span>Analytical models · Numerical exploration</span></footer>
  </>
}
