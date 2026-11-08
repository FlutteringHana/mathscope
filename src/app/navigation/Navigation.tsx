import styles from '../App.module.css'

export function Navigation({ onSelect }: { onSelect?: () => void }) {
  return <nav aria-label="Mathematics experiments" className={styles.navigation}>
    <div className={styles.eyebrow}>EXPERIMENT LIBRARY</div>
    {['Calculus & Analysis', 'Linear Algebra', 'Complex Analysis'].map(name =>
      <div className={styles.planned} key={name}><span>{name}</span><small>Planned</small></div>)}
    <div className={styles.category}>Fourier & Signal Processing</div>
    <button className={styles.activeExperiment} aria-current="page" onClick={onSelect}>∿ <span>Fourier Explorer</span></button>
    <div className={styles.planned}><span>Differential Equations</span><small>Planned</small></div>
    <div className={styles.libraryNote}>A laboratory for mathematical ideas.<br />One experiment at a time.</div>
  </nav>
}
