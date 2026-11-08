# M3 renderer decision: native SVG

| Criterion | Plotly.js | Native SVG | Canvas 2D |
| --- | --- | --- | --- |
| Interaction | Built-in zoom, pan, hover and mode bar | Small custom zoom/pan control implementation | Custom hit testing and interactions |
| Performance | General plotting engine; incremental updates available | A few paths of 2048 samples fit this bounded MVP | Suitable for many dense series; redraw required |
| Customization | Layout/trace configuration | Direct CSS, markup and clipping control | Imperative drawing commands |
| TypeScript | Documented TS support; wrapper optional | React DOM/SVG types already installed | Browser API types already installed |
| Bundle | Adds a plotting dependency; exact size depends on selected traces | No additional dependency | No additional dependency |
| Complexity | Lowest initial chart setup; integration/theme configuration | Small renderer sufficient for two curves and one inspected harmonic | Additional accessibility and resize handling |

Selected native SVG. The chart accepts generic series/segments and domain bounds, without model imports. The adapter reshapes arrays and splits at core-provided jump locations; it does no Fourier calculation. The experiment layer owns sampling and harmonic evaluation. Only one selected harmonic is plotted at a time, and every nonzero term is selectable. Buttons support keyboard zoom/pan/reset, with pointer drag as an additional pan interaction. Small screens can scroll the graph region to preserve readable labels.

This decision is specific to the MVP's N≤50 and M=2048 workload. Plotly/Canvas were evaluated by documented capabilities and implementation requirements, not installed or benchmarked. No unmeasured dependency-size figures are claimed. Actual SVG update performance is recorded in `execution-log.md`.

Sources: [Plotly interaction configuration](https://plotly.com/javascript/configuration-options/), [Plotly update API](https://plotly.com/javascript/plotlyjs-function-reference/), [Plotly TypeScript guide](https://plotly.com/javascript/guides/typescript/), [MDN SVG viewBox](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/viewBox), [MDN Canvas accessibility](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/canvas).
