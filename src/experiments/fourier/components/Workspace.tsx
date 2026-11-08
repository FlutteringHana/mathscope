import { Tabs } from '../../../components/ui/Tabs'
import { signalLabels, type FourierConfig } from '../state/config'
import { useState } from 'react'
import { useFourier } from '../hooks/useFourier'
import { combinedSeries } from '../../../visualization/adapters/series'
import { LinePlot } from '../../../visualization/charts/LinePlot'
import { Harmonics } from './Harmonics'
import styles from './Workspace.module.css'

const tabs = ['Experiment', 'Theory', 'Analysis'] as const
export function Workspace({ config }: { config: FourierConfig }) {
  const [tab, setTab] = useState<typeof tabs[number]>('Experiment')
  const { samples, terms } = useFourier(config.signalId, config.maxHarmonic)
  return <>
    <div className={styles.breadcrumb}>Fourier & Signal Processing <span>/</span> Experiment 01</div>
    <div className={styles.title}><div><h1>Fourier Explorer</h1><p>Explore how simple harmonics reconstruct a periodic signal.</p></div><span className={styles.badge}>2π PERIODIC</span></div>
    <Tabs values={tabs} active={tab} onChange={setTab} />
    <div role="tabpanel" id="workspace-panel" aria-labelledby={`tab-${tab}`} tabIndex={0}>
      <section className={styles.panel}>
        <div className={styles.panelHeading}><h2>{tab === 'Experiment' ? 'Signal reconstruction' : tab}</h2><code>{signalLabels[config.signalId]} · N = {config.maxHarmonic}</code></div>
        {tab === 'Experiment' ? <LinePlot key={config.signalId} series={combinedSeries(samples, config.showOriginal, config.showApproximation)} min={samples.min} max={samples.max}
          label="Signal reconstruction" description="Original: dashed neutral line. Fourier partial sum: solid cyan line. 2048 midpoint samples over one period; original curves are separated at jumps." />
          : <div className={styles.placeholder}><h2>{tab} workspace</h2><p>Mathematical content will be available in the analysis milestone.</p></div>}
      </section>
      {tab === 'Experiment' && config.showHarmonics && <Harmonics terms={terms} x={samples.x} min={samples.min} max={samples.max} />}
    </div>
    <footer className={styles.footer}><span>MathScope / Fourier laboratory</span><span>Analytical models · Numerical exploration</span></footer>
  </>
}
