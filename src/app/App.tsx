import { useState } from 'react'
import { Navigation } from './navigation/Navigation'
import { Drawer } from '../components/ui/Drawer'
import { Inspector } from '../experiments/fourier/components/Inspector'
import { Workspace } from '../experiments/fourier/components/Workspace'
import { defaultConfig } from '../experiments/fourier/state/config'
import styles from './App.module.css'

export default function App() {
  const [config, setConfig] = useState({ ...defaultConfig })
  const [drawer, setDrawer] = useState<'navigation' | 'inspector' | null>(null)
  const [inspectorVisible, setInspectorVisible] = useState(true)
  return <>
    <a className={styles.skip} href="#workspace">Skip to workspace</a>
    <header className={styles.header}>
      <div className={styles.brand}><span aria-hidden="true">∿</span> MathScope <small>INTERACTIVE MATHEMATICS</small></div>
      <div className={styles.headerActions}><button className={styles.menuButton} onClick={() => setDrawer('navigation')}>Library</button>
        <button onClick={() => {
          if (window.matchMedia('(max-width: 1100px)').matches) setDrawer('inspector')
          else setInspectorVisible(!inspectorVisible)
        }}>Inspector</button></div>
    </header>
    <div className={`${styles.layout} ${!inspectorVisible ? styles.collapsed : ''}`}>
      <aside className={styles.sidebar}><Navigation /></aside>
      <main id="workspace" className={styles.workspace}><Workspace config={config} /></main>
      {inspectorVisible && <aside className={styles.inspector} aria-label="Inspector"><Inspector config={config} onChange={setConfig} /></aside>}
    </div>
    {drawer && <Drawer title={drawer === 'navigation' ? 'Library' : 'Inspector'} onClose={() => setDrawer(null)}>
      {drawer === 'navigation' ? <Navigation onSelect={() => setDrawer(null)} /> : <Inspector config={config} onChange={setConfig} />}
    </Drawer>}
  </>
}
