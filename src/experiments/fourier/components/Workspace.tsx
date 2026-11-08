import { Tabs } from '../../../components/ui/Tabs'
import { signalLabels, type FourierConfig } from '../state/config'
import { lazy, Suspense, useState } from 'react'
import { useFourier } from '../hooks/useFourier'
import { combinedSeries } from '../../../visualization/adapters/series'
import { LinePlot } from '../../../visualization/charts/LinePlot'
import { Harmonics } from './Harmonics'
import styles from './Workspace.module.css'

const tabs = ['Experiment', 'Theory', 'Analysis'] as const
const Theory = lazy(() => import('./Theory'))
const Analysis = lazy(() => import('./Analysis'))
export function Workspace({ config }: { config: FourierConfig }) {
  const [tab, setTab] = useState<typeof tabs[number]>('Experiment')
  const { samples, terms, errors } = useFourier(config.signalId, config.maxHarmonic)
  return <>
    <div className={styles.breadcrumb}>Fourier & Signal Processing <span>/</span> Experiment 01</div>
    <div className={styles.title}><div><h1>Fourier Explorer</h1><p>Explore how simple harmonics reconstruct a periodic signal.</p></div><span className={styles.badge}>2π PERIODIC</span></div>
    <Tabs values={tabs} active={tab} onChange={setTab} />
    <div role="tabpanel" id="workspace-panel" aria-labelledby={`tab-${tab}`} tabIndex={0}>
      {tab === 'Experiment' && <><section className={styles.panel}>
        <div className={styles.panelHeading}><h2>{tab === 'Experiment' ? 'Signal reconstruction' : tab}</h2><code>{signalLabels[config.signalId]} · N = {config.maxHarmonic}</code></div>
        <LinePlot key={config.signalId} series={combinedSeries(samples, config.showOriginal, config.showApproximation)} min={samples.min} max={samples.max}
          label="Signal reconstruction" description="Original: dashed neutral line. Fourier partial sum: solid cyan line. 2048 midpoint samples over one period; original curves are separated at jumps." />
      </section>
      {config.showHarmonics && <Harmonics terms={terms} x={samples.x} min={samples.min} max={samples.max} />}</>}
      <Suspense fallback={<p role="status">Loading mathematical content…</p>}>
        {tab === 'Theory' && <Theory signalId={config.signalId} />}
        {tab === 'Analysis' && <Analysis config={config} errors={errors} terms={terms} />}
      </Suspense>
    </div>
    <footer className={styles.footer}><span>MathScope / Fourier laboratory</span><span>Analytical models · Numerical exploration</span></footer>
  </>
}
