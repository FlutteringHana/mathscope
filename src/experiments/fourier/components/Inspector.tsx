import { useId } from 'react'
import { defaultConfig, isSignalId, signalLabels, type FourierConfig } from '../state/config'
import styles from './Inspector.module.css'

export function Inspector({ config, onChange }: { config: FourierConfig; onChange: (config: FourierConfig) => void }) {
  const harmonicId = useId()
  return <div className={styles.controls}>
    <div><span className={styles.eyebrow}>PARAMETERS</span><h2>Experiment controls</h2></div>
    <label className={styles.field}>Signal<select value={config.signalId} onChange={event => {
      if (isSignalId(event.target.value)) onChange({ ...config, signalId: event.target.value })
    }}>{Object.entries(signalLabels).map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></label>
    <div className={styles.field}>
      <label htmlFor={harmonicId}>Maximum harmonic index <output htmlFor={harmonicId}>N = {config.maxHarmonic}</output></label>
      <input id={harmonicId} type="range" min="1" max="50" step="1" value={config.maxHarmonic}
        onChange={event => onChange({ ...config, maxHarmonic: Number(event.target.value) })} />
      <div className={styles.range}><span>1</span><span>50</span></div>
      <p className={styles.hint}>N is the highest harmonic index, including terms with zero coefficients.</p>
    </div>
    <fieldset><legend>VISIBLE LAYERS</legend>
      {([['showOriginal', 'Original signal'], ['showApproximation', 'Fourier approximation'], ['showHarmonics', 'Harmonic components']] as const).map(([key, label]) =>
        <label className={styles.toggle} key={key}><input type="checkbox" checked={config[key]} onChange={event => onChange({ ...config, [key]: event.target.checked })} />{label}</label>)}
    </fieldset>
    <button onClick={() => onChange({ ...defaultConfig })}>↺ Reset parameters</button>
    <div className={styles.conventions}><span className={styles.eyebrow}>CONVENTIONS</span><p>Period <code>2π</code><br />Amplitude <code>[−1, 1]</code><br />Analytical coefficients</p></div>
  </div>
}
