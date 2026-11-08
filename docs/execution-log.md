# Fourier Explorer execution record

The user approved M0 and authorized sequential M1–M5 execution. Existing edits to `.gitignore` and the M0 status are preserved. Each task below inherits the scope and acceptance criteria of its matching task in `implementation-plan.md`; milestone dependencies are sequential. Automated verification means `npm test`, `npm run lint`, and `npm run build`. Review includes inspecting the implementation against the approved specifications and correcting observed failures before the milestone checkpoint.

## M1 — Application Shell

Status: verified.

| Task | Objective / scope | Dependencies | Acceptance and verification | Status |
| --- | --- | --- | --- | --- |
| M1-01 | Remove demo assets and update entry point / metadata | M0 | No starter content; dev server and production build work | Done |
| M1-02 | Establish tokens and shared control styling | M1-01 | Dark palette, typography, spacing, borders and focus styles inspected | Done |
| M1-03 | Header, navigation, workspace and Inspector | M1-02 | Three desktop columns; browser inspection | Done |
| M1-04 | Fourier navigation and planned categories | M1-03 | Active experiment and non-interactive Planned labels visible | Done |
| M1-05 | Three accessible workspace tabs | M1-03 | Browser checks preserve signal and N across all tabs | Done |
| M1-06 | Mock experiment controls and reset | M1-03 | Browser checks signal, N, visibility and reset | Done |
| M1-07 | Responsive layout and drawers | M1-03 | Desktop collapse; small-screen drawers, focus and overflow checks | Done |

Implementation: `src/app/`, `src/components/ui/`, `src/experiments/fourier/`, `src/styles/`, `src/main.tsx`, `index.html`; removed unused starter components/styles/assets. Added `vitest.config.ts`, `tests/shell.test.tsx`, npm test scripts and Vitest development dependency through npm (lockfile updated by npm).

Decisions: native dialog drawers provide modal focus management and Escape support. CSS Modules provide component styles; variables provide shared tokens. Configuration lives above tab content. M2 test setup was pulled into M1 to honor the requested per-milestone Vitest gate; no mathematical algorithms exist in M1 and no mathematical test results are claimed.

Verification: Vitest 1/1 passed; lint and build passed without warnings. Browser checks passed for signal/N changes, all tab transitions, harmonic visibility, reset, desktop layout, mobile drawers and focus entry. Browser window resizing has a minimum viewport of approximately 500 CSS pixels; narrower device emulation is deferred to M5. Review corrected duplicate slider IDs when drawers coexist with hidden desktop controls, and dialog cleanup behavior under React StrictMode.

Next: pure mathematical models, coefficients, partial sums, midpoint sampling and error metrics with mathematical tests (M2).

## M2 — Fourier Computation Engine

Status: verified. All tasks depend on M1 and the approved mathematical contract.

| Task | Objective / scope | Dependencies | Acceptance and verification | Status |
| --- | --- | --- | --- | --- |
| M2-01 | Vitest infrastructure | M1 | Node environment, TS discovery and npm scripts; completed early in M1 | Done |
| M2-02 | Signal, coefficient, sample and metric types | M2-01 | Typed pure API; production type checking | Done |
| M2-03 | Three periodic signal models | M2-02 | Symmetry, bounds, periodicity, endpoint and near-jump tests | Done |
| M2-04 | Analytical coefficients | M2-03 | Exact values, zero terms and independent midpoint integration tests | Done |
| M2-05 | Partial sums including DC | M2-04 | Known sums, N=0, highest-index convention and invalid-index tests | Done |
| M2-06 | Midpoint sampling | M2-05 | M=2048, coordinates, endpoint avoidance and segmentation metadata tests | Done |
| M2-07 | Sampled error metrics | M2-06 | Known RMSE/max values, scaled accumulation and invalid-input tests | Done |
| M2-08 | Mathematical contract tests | M2-03–07 | 54 tests passed across 3 suites; lint/build clean | Done |

Files: `src/core/types.ts`, `validation.ts`, `signals/signals.ts`, `fourier/{series,sampling,errors}.ts`, `tests/{fourier,architecture}.test.ts`, and experiment config's core type import. No dependencies added.

Decisions: the core accepts N=0 for DC-only mathematical evaluation and N≤50 for the MVP resource bound; UI remains 1–50. Sampling accepts 1–65536 points and intervals up to two periods for later Gibbs views. Canonical metrics use exactly 2048 midpoints over (−π,π). Coordinates beyond one million periods are rejected explicitly because phase reduction loses precision at large magnitudes. Near-jump values are not flattened using a broad epsilon. Scaled RMSE avoids overflow when squaring otherwise finite errors. Nonfinite results throw rather than silently producing NaN.

Verification: `npm test` 54/54; `npm run lint` and `npm run build` passed without warnings. Independent numerical integration checks harmonics 1, 2, 3, 8, 49 and 50 for every signal. Architecture test checks core's local imports and absence of DOM/React identifiers. Review confirmed the triangle is even and continuous and only square/sawtooth expose jump locations.

Next: renderer decision, adapters, combined plot, harmonic inspection and maximum-N interaction checks (M3).

## M3 — Interactive Visualization

Status: verified. Dependencies: M2.

| Task | Objective / scope | Dependencies | Acceptance and verification | Status |
| --- | --- | --- | --- | --- |
| M3-01 | Evaluate Plotly, SVG and Canvas | M2 | Comparison and choice in `renderer-decision.md` | Done |
| M3-02 | Data-only rendering adapter | M3-01 | Adapter tests; no Fourier calculations in visualization | Done |
| M3-03 | Combined plot, axes, grid, legend, zoom/pan | M3-02 | Browser path changes on zoom/pan and restoration on reset | Done |
| M3-04 | Split original curves at jumps | M3-02 | Tests assert no segment crosses model jump locations | Done |
| M3-05 | Connect controls to computation | M3-03 | Browser verifies every signal at N=50; visibility checks | Done |
| M3-06 | Inspect all nonzero harmonic terms | M3-05 | 25 square/triangle and 50 sawtooth selectable terms at N=50 | Done |
| M3-07 | Maximum-N interaction validation | M3-06 | All signals remain interactive; timings below | Done |

Files: `src/visualization/{charts,adapters}/`, `src/experiments/fourier/hooks/useFourier.ts`, `components/{Harmonics,Workspace}.tsx` and styles; `tests/{visualization,shell}.test.*`, `docs/renderer-decision.md`, `package.json`. No dependency added. Lint now uses `--deny-warnings` to enforce the requested zero-warning gate.

Decisions: native SVG behind a generic series component; model-provided jump metadata; one individually selected harmonic chart to avoid overcrowding; keyboard zoom/pan controls and pointer drag; horizontal plot scrolling on narrow screens. Fourier computation remains entirely in core. See renderer decision for compared alternatives and primary references.

Verification: 56/56 Vitest tests; lint/build passed without warnings after removing unnecessary harmonic memoization flagged by the React Compiler lint rule. Browser checks verified all signals, segment counts, N=50, last selectable harmonic, zoom/pan/reset. The dev-browser sequence of setting N=50, waiting two frames, asserting rendered paths, selecting the final harmonic and waiting two more frames took 203 ms (square), 236 ms (sawtooth), 199 ms (triangle). These are whole scripted interaction sequences, not isolated computation benchmarks or device-independent latency guarantees. Production JS at this checkpoint: 235.85 kB (74.42 kB gzip).

Next: KaTeX, theory, coefficients, reproducible sampled metrics and Gibbs views (M4).

## M4 — Mathematical Analysis

Status: verified. Dependencies: M3.

| Task | Objective / scope | Dependencies | Acceptance and verification | Status |
| --- | --- | --- | --- | --- |
| M4-01 | KaTeX formulas | M3 | Every TeX expression parsed with errors enabled; MathML present | Done |
| M4-02 | Signal theory and conventions | M4-01 | All three definitions, symmetry, coefficients and convergence reviewed against contract | Done |
| M4-03 | Complete analytical coefficient table | M2, M4-01 | DC plus all 1–N rows, including zeros; presentation tests | Done |
| M4-04 | Reproducible error analysis | M2, M4-01 | Canonical M=2048, sampled labels, grid/rounding disclosures | Done |
| M4-05 | Local Gibbs view | M3, M4-02 | Square around 0, sawtooth around π, no triangle jump view; overshoot tests | Done |
| M4-06 | Numerical presentation | M4-03–05 | Browser metrics, formula rendering, table counts and conditional content checks | Done |

Files: `src/components/ui/Formula.*`, `src/experiments/fourier/config/theory.ts`, `components/{Theory,Analysis,Workspace}.*`, `src/core/signals/signals.ts`, `tests/analysis.test.tsx`, `package.json`, `package-lock.json`. Added KaTeX and development-only `@types/katex` through npm.

Decisions: trusted project-owned formula strings rendered with KaTeX's `trust: false`, HTML plus MathML, and throwing parse errors. Theory/Analysis load lazily, keeping formula code/fonts off the initial experiment path. Global metrics always use the canonical grid; Gibbs uses a separately disclosed 2048-point local window of width 1.2 radians. The 8.949% theoretical limit is explicitly not a finite-N measurement.

Verification: 61/61 tests passed; lint/build clean. Browser rendered all formulas without KaTeX errors, verified coefficient counts and MathML, and confirmed triangle has no Gibbs plot. N=9 RMSE / sampled maximum: square 0.200978 / 0.990235; sawtooth 0.145978 / 0.990723; triangle 0.007327 / 0.039423. Review/test correction normalized −0 to 0 in jump metadata for local windows. Production chunks remain below Vite warning thresholds.

Next: production integration, accessibility/responsiveness, performance, documentation/screenshots and deployment (M5).
