import { useEffect, useRef, type KeyboardEvent, type ReactNode } from 'react'
import styles from './Drawer.module.css'

export function Drawer({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = ref.current!
    dialog.showModal()
    return () => dialog.close()
  }, [])
  function containFocus(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== 'Tab') return
    const elements = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), select, input, a[href], [tabindex="0"]'))
    const first = elements[0], last = elements[elements.length - 1]
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
  }
  return <dialog ref={ref} className={styles.drawer} aria-label={title} onKeyDown={containFocus} onClose={() => { if (!ref.current?.open) onClose() }}>
    <div className={styles.heading}><strong>{title}</strong><button onClick={onClose} aria-label={`Close ${title}`}>Close ×</button></div>
    {children}
  </dialog>
}
