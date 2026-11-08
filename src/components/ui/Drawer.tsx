import { useEffect, useRef, type ReactNode } from 'react'
import styles from './Drawer.module.css'

export function Drawer({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = ref.current!
    dialog.showModal()
    return () => dialog.close()
  }, [])
  return <dialog ref={ref} className={styles.drawer} aria-label={title} onClose={() => { if (!ref.current?.open) onClose() }}>
    <div className={styles.heading}><strong>{title}</strong><button onClick={onClose} aria-label={`Close ${title}`}>Close ×</button></div>
    {children}
  </dialog>
}
