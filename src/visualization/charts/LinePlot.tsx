import { useId, useRef, useState, type PointerEvent } from 'react'
import type { PlotSeries } from './types'
import styles from './LinePlot.module.css'

const width = 800, height = 340, left = 60, right = 24, top = 24, bottom = 48
const plotWidth = width - left - right, plotHeight = height - top - bottom
const colors = { neutral: 'var(--text)', cyan: 'var(--cyan)', violet: 'var(--violet)' }

export function LinePlot({ series, min, max, label, description }: {
  series: readonly PlotSeries[]; min: number; max: number; label: string; description: string
}) {
  const clipId = useId()
  const [view, setView] = useState({ min, max })
  const drag = useRef<{ x: number; min: number; max: number } | null>(null)
  const span = view.max - view.min
  const sx = (x: number) => left + (x - view.min) / span * plotWidth
  const sy = (y: number) => top + (1.4 - y) / 2.8 * plotHeight
  function setBounds(start: number, size: number) {
    const boundedSize = Math.min(max - min, Math.max((max - min) / 16, size))
    const boundedStart = Math.max(min, Math.min(max - boundedSize, start))
    setView({ min: boundedStart, max: boundedStart + boundedSize })
  }
  function zoom(factor: number) { const next = span * factor; setBounds((view.min + view.max - next) / 2, next) }
  function move(event: PointerEvent<SVGSVGElement>) {
    if (!drag.current) return
    const box = event.currentTarget.getBoundingClientRect()
    const delta = (event.clientX - drag.current.x) / box.width * width / plotWidth * (drag.current.max - drag.current.min)
    setBounds(drag.current.min - delta, drag.current.max - drag.current.min)
  }
  const ticks = Array.from({ length: 5 }, (_, i) => view.min + span * i / 4)
  const formatX = (x: number) => {
    const halfPi = x / Math.PI * 2
    if (Math.abs(halfPi - Math.round(halfPi)) < 1e-8) {
      const n = Math.round(halfPi)
      return n === 0 ? '0' : `${n < 0 ? '−' : ''}${Math.abs(n) === 2 ? '' : Math.abs(n) === 1 ? '' : Math.abs(n) % 2 === 0 ? Math.abs(n) / 2 : Math.abs(n)}π${Math.abs(n) % 2 ? '/2' : ''}`
    }
    return x.toFixed(2)
  }
  return <figure className={styles.figure} aria-label={label}>
    <div className={styles.toolbar}>
      <div className={styles.legend}>{series.map(item => <span key={item.id}><i style={{ borderColor: colors[item.color], borderTopStyle: item.dashed ? 'dashed' : 'solid' }} />{item.label}</span>)}</div>
      <div className={styles.actions} role="group" aria-label={`${label} view controls`}>
        <button aria-label="Pan left" disabled={view.min <= min} onClick={() => setBounds(view.min - span / 4, span)}>←</button>
        <button aria-label="Zoom in" disabled={span <= (max - min) / 16 + 1e-10} onClick={() => zoom(.5)}>+</button>
        <button aria-label="Zoom out" disabled={span >= max - min - 1e-10} onClick={() => zoom(2)}>−</button>
        <button aria-label="Pan right" disabled={view.max >= max} onClick={() => setBounds(view.min + span / 4, span)}>→</button>
        <button onClick={() => setView({ min, max })}>Reset view</button>
      </div>
    </div>
    {series.length === 0 ? <p className={styles.empty}>No curves visible. Enable a layer in the Inspector.</p> : <div className={styles.scroll} tabIndex={0} role="region" aria-label={`${label}; scroll horizontally on small screens`}>
      <svg className={styles.plot} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label}
        onPointerDown={event => { if (event.button === 0 && event.pointerType !== 'touch') { drag.current = { x: event.clientX, ...view }; event.currentTarget.setPointerCapture(event.pointerId) } }}
        onPointerMove={move} onPointerUp={() => { drag.current = null }} onPointerCancel={() => { drag.current = null }}>
        <title>{label}</title><desc>{description}</desc>
        <defs><clipPath id={clipId}><rect x={left} y={top} width={plotWidth} height={plotHeight} /></clipPath></defs>
        {[-1, -.5, 0, .5, 1].map(y => <g key={y}><line className={y === 0 ? styles.axis : styles.grid} x1={left} x2={width - right} y1={sy(y)} y2={sy(y)} /><text x={left - 12} y={sy(y) + 4} textAnchor="end">{y}</text></g>)}
        {ticks.map(x => <g key={x}><line className={Math.abs(x) < 1e-10 ? styles.axis : styles.grid} x1={sx(x)} x2={sx(x)} y1={top} y2={height - bottom} /><text x={sx(x)} y={height - bottom + 24} textAnchor="middle">{formatX(x)}</text></g>)}
        <text x={left} y={14}>Amplitude</text><text x={width - right} y={height - 4} textAnchor="end">x (radians)</text>
        <g clipPath={`url(#${clipId})`}>{series.map(item => <g key={item.id} data-series={item.id}>
          {item.segments.map((segment, index) => <path key={index} d={segment.map((point, i) => `${i ? 'L' : 'M'}${sx(point.x).toFixed(2)},${sy(point.y).toFixed(2)}`).join(' ')}
            fill="none" stroke={colors[item.color]} strokeWidth={item.dashed ? 1.7 : 2.2} strokeDasharray={item.dashed ? '7 5' : undefined} vectorEffect="non-scaling-stroke" />)}
        </g>)}</g>
      </svg>
    </div>}
    <figcaption>{description} <span>Zoom with + / −; pan by dragging or using the arrow buttons.</span></figcaption>
  </figure>
}
