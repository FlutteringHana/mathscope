import type { KeyboardEvent } from 'react'
import styles from './Tabs.module.css'

export function Tabs<T extends string>({ values, active, onChange }: {
  values: readonly T[]; active: T; onChange: (value: T) => void
}) {
  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const next = event.key === 'ArrowRight' ? (index + 1) % values.length
      : event.key === 'ArrowLeft' ? (index + values.length - 1) % values.length
      : event.key === 'Home' ? 0 : event.key === 'End' ? values.length - 1 : null
    if (next === null) return
    event.preventDefault()
    onChange(values[next])
    document.getElementById(`tab-${values[next]}`)?.focus()
  }
  return <div className={styles.tabs} role="tablist" aria-label="Workspace views">
    {values.map((value, index) => <button key={value} id={`tab-${value}`} role="tab"
      aria-selected={active === value} aria-controls="workspace-panel" tabIndex={active === value ? 0 : -1}
      onKeyDown={event => onKeyDown(event, index)} onClick={() => onChange(value)}>{value}</button>)}
  </div>
}
