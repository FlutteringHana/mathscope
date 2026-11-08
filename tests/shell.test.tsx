import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import App from '../src/app/App'

describe('application shell', () => {
  it('exposes the workspace, controls, and computed visualization', () => {
    const html = renderToStaticMarkup(<App />)
    for (const label of ['Fourier Explorer', 'Experiment', 'Theory', 'Analysis', 'Square Wave', 'Sawtooth Wave', 'Triangle Wave', 'N = 9', 'Reset parameters', 'Planned', '2048 midpoint samples']) expect(html).toContain(label)
    expect(html).not.toContain('Vite logo')
    expect(html).toContain('aria-selected="true"')
    expect(html).toContain('aria-label="Mathematics experiments"')
  })
})
