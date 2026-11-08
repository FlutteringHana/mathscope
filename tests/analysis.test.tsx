import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import katex from 'katex'
import { commonFormulas, theory } from '../src/experiments/fourier/config/theory'
import Theory from '../src/experiments/fourier/components/Theory'
import Analysis from '../src/experiments/fourier/components/Analysis'
import { defaultConfig } from '../src/experiments/fourier/state/config'
import { sampleSignal } from '../src/core/fourier/sampling'
import { coefficients } from '../src/core/fourier/series'
import { errorMetrics } from '../src/core/fourier/errors'

it('renders every documented formula as valid KaTeX with accessible MathML', () => {
  const formulas = [...Object.values(commonFormulas), ...Object.values(theory).flatMap(item => [item.definition, item.coefficients, item.series])]
  for (const tex of formulas) expect(katex.renderToString(tex, { throwOnError: true, trust: false })).toContain('<math')
})
describe.each(['square', 'sawtooth', 'triangle'] as const)('%s analysis presentation', signalId => {
  it('uses reproducible canonical metrics and all coefficient rows', () => {
    const data = sampleSignal(signalId, 9)
    const errors = errorMetrics(data.original, data.approximation)
    const html = renderToStaticMarkup(<Analysis config={{ ...defaultConfig, signalId }} errors={errors} terms={coefficients(signalId, 9)} />)
    expect(html).toContain(errors.rmse.toFixed(6))
    expect(html).toContain(errors.maxAbsoluteError.toFixed(6))
    expect(html).toContain('M = 2048')
    expect(html.match(/<tr>/g)).toHaveLength(11)
    if (signalId === 'triangle') { expect(html).toContain('Continuous convergence'); expect(html).not.toContain('8.949%') }
    else { expect(html).toContain('8.949%'); expect(html).toContain('separate from the global error grid') }
    expect(renderToStaticMarkup(<Theory signalId={signalId} />)).toContain('katex-mathml')
  })
})
it('shows overshoot localized near actual square and sawtooth jumps', () => {
  for (const id of ['square', 'sawtooth'] as const) {
    const center = id === 'square' ? 0 : Math.PI
    const local = sampleSignal(id, 50, 2048, center - .6, center + .6)
    expect(Math.max(...local.approximation)).toBeGreaterThan(1.1)
    expect(Math.max(...local.approximation)).toBeLessThan(1.2)
    expect(local.discontinuities).toEqual([center])
  }
  const triangle = sampleSignal('triangle', 50)
  expect(Math.max(...triangle.approximation)).toBeLessThan(1)
})
