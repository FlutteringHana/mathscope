import katex from 'katex'
import 'katex/dist/katex.min.css'
import styles from './Formula.module.css'

/** Only project-owned TeX is accepted. KaTeX's untrusted mode and MathML output are retained. */
export function Formula({ tex, label }: { tex: string; label: string }) {
  const html = katex.renderToString(tex, { displayMode: true, throwOnError: true, trust: false, output: 'htmlAndMathml' })
  return <div className={styles.formula} role="group" aria-label={label} tabIndex={0} dangerouslySetInnerHTML={{ __html: html }} />
}
